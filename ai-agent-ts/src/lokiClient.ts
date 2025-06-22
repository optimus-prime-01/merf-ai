import axios from "axios";

const LOKI_BASE_URL = "http://localhost:3100/loki/api/v1/query_range";

/**
 * Fetch recent logs for a specific job label
 */
export async function fetchLogsFromLoki(job: string, durationMinutes = 10): Promise<string[]> {
  const endNs = Date.now() * 1_000_000;
  const startNs = endNs - durationMinutes * 60 * 1_000_000_000;

  const query = `{job="${job}"}`;

  try {
    const response = await axios.get(LOKI_BASE_URL, {
      params: {
        query,
        limit: 10,
        start: startNs.toString(),
        end: endNs.toString(),
      },
    });

    const results: string[] = [];
    const streams = response.data.data.result;
    for (const stream of streams) {
      for (const [_, line] of stream.values) {
        results.push(line);
      }
    }
    return results;
  }  catch (error: unknown) {
  if (error instanceof Error) {
    console.error("❌ Failed to fetch logs from Loki:", error.message);
  } else {
    console.error("❌ Failed to fetch logs from Loki:", error);
  }
  return [];
}

}
