import { fetchLogsFromLoki } from "./lokiClient";

// ✅ Mock Gemini analysis function (for now)
export async function analyzeAlertLLM(alertText: string): Promise<string> {
  console.log("📥 Received alert:", alertText);

  // Fetch logs from Loki for 'alert-receiver' job
  const logs = await fetchLogsFromLoki("alert-receiver", 10); // last 10 min
  const logsText = logs.length ? logs.join("\n") : "No logs found for the past 10 minutes.";

  const prompt = `
You are an SRE assistant. Analyze the following alert and its related logs:

🚨 Alert:
${alertText}

📝 Recent Logs:
${logsText}

🧠 Provide:
1. Root cause
2. Suggested resolution
3. Long-term improvement
`;

  console.log("🧠 Prompt sent to Gemini (mocked):", prompt);

  // 🧪 Mock Gemini response
  return `
**Root Cause:** Memory usage spike on node-2 due to continuous heavy load. Logs confirm repeated alert patterns.

**Suggested Resolution:** Restart the impacted process. Free up unnecessary background services on node-2.

**Long-Term Fix:** Add memory limits to critical pods, enable auto-scaling, and monitor via heap dumps.
`;
}
