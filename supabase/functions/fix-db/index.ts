import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as postgres from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const dbUrl = Deno.env.get("SUPABASE_DB_URL");
    if (!dbUrl) throw new Error("SUPABASE_DB_URL is missing");

    // Use a direct database connection pool
    const pool = new postgres.Pool(dbUrl, 1, true);
    const connection = await pool.connect();

    try {
      // 1. Terminate hanging idle transactions (except ours) to release any locks
      await connection.queryObject(`
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE state = 'idle in transaction'
          AND pid <> pg_backend_pid();
      `);

      // 2. Add pin_hash
      await connection.queryObject(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name='profiles' AND column_name='pin_hash'
            ) THEN
                ALTER TABLE public.profiles ADD COLUMN pin_hash TEXT;
            END IF;
        END $$;
      `);

      // 3. Create extension
      await connection.queryObject(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

      // 4. Create function
      await connection.queryObject(`
        CREATE OR REPLACE FUNCTION public.set_user_pin(new_pin TEXT)
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        SET search_path = public, extensions
        AS $$
        BEGIN
            UPDATE profiles 
            SET pin_hash = crypt(new_pin, gen_salt('bf'))
            WHERE id = auth.uid();
        END;
        $$;
      `);

      // 4b. Fix reserve_bill_funds to also use the correct search path
      await connection.queryObject(`
        CREATE OR REPLACE FUNCTION public.reserve_bill_funds(
            payer_id UUID,
            bill_amount DECIMAL,
            bill_type TEXT,
            bill_label TEXT,
            bill_reference TEXT,
            bill_note TEXT,
            user_pin TEXT,
            icon_name TEXT
        )
        RETURNS UUID
        LANGUAGE plpgsql
        SECURITY DEFINER
        SET search_path = public, extensions
        AS $$
        DECLARE
            payer_wallet RECORD;
            payer_profile RECORD;
            new_tx_id UUID;
        BEGIN
            IF bill_amount <= 0 THEN RAISE EXCEPTION 'Amount must be greater than zero.'; END IF;
            IF auth.uid() != payer_id THEN RAISE EXCEPTION 'Unauthorized: You can only pay bills from your own account.'; END IF;

            SELECT pin_hash INTO payer_profile FROM profiles WHERE id = payer_id;
            IF payer_profile.pin_hash IS NULL THEN RAISE EXCEPTION 'PIN not set. Please set up a transaction PIN first.'; END IF;
            IF payer_profile.pin_hash != crypt(user_pin, payer_profile.pin_hash) THEN RAISE EXCEPTION 'Incorrect PIN. Payment aborted.'; END IF;

            SELECT * INTO payer_wallet FROM wallets WHERE user_id = payer_id FOR UPDATE;
            IF payer_wallet IS NULL THEN RAISE EXCEPTION 'Wallet not found.'; END IF;
            IF payer_wallet.balance < bill_amount THEN RAISE EXCEPTION 'Insufficient funds.'; END IF;

            UPDATE wallets SET balance = balance - bill_amount, updated_at = now() WHERE id = payer_wallet.id;

            INSERT INTO transactions (wallet_id, user_id, type, icon, label, amount, fee, reference, note, status)
            VALUES (payer_wallet.id, payer_id, 'debit', icon_name, bill_label, bill_amount, 0, bill_reference, bill_note, 'pending')
            RETURNING id INTO new_tx_id;

            RETURN new_tx_id;
        END;
        $$;
      `);

      // 5. Grant permissions
      await connection.queryObject(`GRANT EXECUTE ON FUNCTION public.set_user_pin(TEXT) TO authenticated;`);
      await connection.queryObject(`GRANT EXECUTE ON FUNCTION public.set_user_pin(TEXT) TO anon;`);

      // 6. Reload cache
      await connection.queryObject(`NOTIFY pgrst, 'reload schema';`);

      // 7. Drop strict icon check constraint from transactions table
      await connection.queryObject(`ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_icon_check;`);

      // 8. Drop unique constraint on reference column — same phone/meter can have multiple transactions
      await connection.queryObject(`ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_reference_key;`);

      return new Response(JSON.stringify({ success: true, message: "DB perfectly fixed and locks cleared!" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } finally {
      connection.release();
      await pool.end();
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
