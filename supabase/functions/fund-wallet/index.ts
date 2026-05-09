import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Constants
const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    // Initialize Supabase admin client (bypasses RLS to credit wallet)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify JWT and get user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    // Parse the request body
    const { reference } = await req.json();
    if (!reference) {
      throw new Error("Payment reference is required");
    }

    // Call Paystack API to verify the transaction
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const paystackData = await paystackRes.json();

    if (!paystackData.status || paystackData.data.status !== "success") {
      throw new Error("Payment verification failed at Paystack.");
    }

    // The amount in Paystack is in kobo, we need it in NGN
    const fundAmount = paystackData.data.amount / 100;

    // Check if we've already processed this transaction reference (Idempotency)
    const { data: existingTx } = await supabase
      .from("transactions")
      .select("id")
      .eq("reference", reference)
      .maybeSingle();

    if (existingTx) {
      throw new Error("Payment reference already processed");
    }

    // Get the user's wallet
    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (walletError || !wallet) {
      throw new Error("Wallet not found for user");
    }

    // Fund the wallet
    const { error: updateError } = await supabase
      .from("wallets")
      .update({
        balance: wallet.balance + fundAmount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", wallet.id);

    if (updateError) {
      throw new Error("Failed to update wallet balance");
    }

    // Record the transaction
    const { error: txError } = await supabase
      .from("transactions")
      .insert({
        wallet_id: wallet.id,
        user_id: user.id,
        type: "credit",
        icon: "fund",
        label: "Added Money",
        amount: fundAmount,
        fee: 0,
        reference: reference,
        note: "Paystack Top-Up",
      });

    if (txError) {
      // Non-fatal, but we should log it
      console.error("Failed to record transaction:", txError);
    }

    return new Response(JSON.stringify({ success: true, amount: fundAmount }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
