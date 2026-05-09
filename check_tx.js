const url = "https://mdjutljhsgdrxmypckvu.supabase.co/rest/v1/transactions?select=*";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kanV0bGpoc2dkcnhteXBja3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNjM4ODgsImV4cCI6MjA5MjkzOTg4OH0.4NGHN1aLEzoWF8-a7wp5b-_wWapGWIyVyNtjE3_cFWg";

async function run() {
  console.log("Fetching transactions...");
  try {
    const res = await fetch(url, {
      headers: {
        "apikey": key,
        "Authorization": `Bearer ${key}`
      },
      signal: AbortSignal.timeout(10000)
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Body:", text.slice(0, 200));
  } catch (e) {
    console.error("Error:", e.message);
  }
}
run();
