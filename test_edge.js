const url = "https://mdjutljhsgdrxmypckvu.supabase.co/functions/v1/pay-bill";
// Using the same key from check_api.js, assuming it's the user's auth token
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kanV0bGpoc2dkcnhteXBja3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNjM4ODgsImV4cCI6MjA5MjkzOTg4OH0.4NGHN1aLEzoWF8-a7wp5b-_wWapGWIyVyNtjE3_cFWg";

async function run() {
  console.log("Fetching Edge Function...");
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: 100,
        billType: "Airtime",
        billLabel: "MTN Airtime",
        reference: "08012345678",
        note: "Airtime Top-Up",
        userPin: "1234",
        iconName: "Phone"
      })
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Body:", text);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
run();
