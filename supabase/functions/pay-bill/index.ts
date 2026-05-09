import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const flutterwaveKey = Deno.env.get("FLUTTERWAVE_SECRET_KEY") ?? "";

    // Initialize Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify JWT
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

    // Parse payload
    const { amount, billType, billLabel, reference, note, userPin, iconName, simulateStatus } = await req.json();

    if (!amount || !billType || !userPin) {
      throw new Error("Missing required parameters");
    }

    // PHASE 1: Reserve Funds
    // This locks the row, checks balance/PIN, deducts money, and creates a pending transaction.
    const { data: txId, error: reserveError } = await supabase.rpc("reserve_bill_funds", {
      payer_id: user.id,
      bill_amount: amount,
      bill_type: billType,
      bill_label: billLabel,
      bill_reference: reference,
      bill_note: note,
      user_pin: userPin,
      icon_name: iconName,
    });

    if (reserveError) {
      throw new Error(reserveError.message);
    }

    if (!txId) {
      throw new Error("Failed to generate transaction reservation");
    }

    // PHASE 2: Call Third-Party API (Flutterwave)
    let apiSuccess = false;
    let apiErrorMessage = "";

    try {
      if (flutterwaveKey) {
        // If we have a real API key, attempt a real API call to Flutterwave Bills API
        const fwPayload = {
          country: "NG",
          customer: reference, // Phone number or Meter ID
          amount: amount,
          type: billType.toUpperCase(),
          reference: txId, // Using our DB transaction ID as the idempotency key
        };

        const fwResponse = await fetch("https://api.flutterwave.com/v3/bills", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${flutterwaveKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fwPayload)
        });

        const fwData = await fwResponse.json();
        
        if (fwData.status === "success") {
          apiSuccess = true;
        } else {
          apiSuccess = false;
          apiErrorMessage = fwData.message || "Third-party API rejected the payment.";
        }
      } else {
        // SIMULATION MODE: If no API key is provided, we simulate a network delay and success.
        // This allows frontend UI testing without needing a real active Flutterwave account.
        console.log(`[SIMULATION] Sending ${amount} for ${billType} to ${reference}`);
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network latency
        
        if (simulateStatus === "success") {
          apiSuccess = true;
        } else if (simulateStatus === "failure") {
          apiSuccess = false;
          apiErrorMessage = "Simulated Biller API failure (Test Mode).";
        } else {
          // Randomly simulate a failure 5% of the time to test rollbacks
          if (Math.random() < 0.05) {
            apiSuccess = false;
            apiErrorMessage = "Simulated network failure from Biller API.";
          } else {
            apiSuccess = true;
          }
        }
      }
    } catch (networkErr) {
      console.error("Network error calling Biller API:", networkErr);
      apiSuccess = false;
      apiErrorMessage = "Biller Network Unreachable.";
    }

    // PHASE 3: Resolve Transaction
    // Either mark success or refund the wallet on failure
    const resolutionStatus = apiSuccess ? "success" : "failed";

    const { error: resolveError } = await supabase.rpc("resolve_bill_funds", {
      tx_id: txId,
      resolution_status: resolutionStatus,
    });

    if (resolveError) {
      // In a true production app, if this fails, it goes to a Dead Letter Queue for manual admin reconciliation
      console.error(`CRITICAL: Failed to resolve transaction ${txId}. Status: ${resolutionStatus}`);
    }

    if (!apiSuccess) {
      // Throw error to notify frontend of failure (and confirm they were refunded)
      throw new Error(`Payment failed: ${apiErrorMessage}. You have been refunded.`);
    }

    return new Response(JSON.stringify({ success: true, transactionId: txId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    // Return 200 so the frontend's supabase.functions.invoke doesn't throw a generic HttpError,
    // allowing it to read the exact error.message in the response body.
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});
