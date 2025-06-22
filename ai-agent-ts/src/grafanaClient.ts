import axios from "axios";

const PROMETHEUS_URL = process.env.PROMETHEUS_URL!;
const LOKI_URL = process.env.LOKI_URL!;
const JAEGER_URL = process.env.JAEGER_URL!;

export async function fetchAlerts() {
  const res = await axios.get(`${PROMETHEUS_URL}/api/v1/alerts`);
  return res.data.data.alerts || [];
}

export async function fetchLokiLogs(query: string) {
  const res = await axios.get(`${LOKI_URL}/loki/api/v1/query`, {
    params: { query },
  });
  return res.data.data;
}

export async function fetchTraces(service = 'alert-receiver-service') {
  const res = await axios.get(`${JAEGER_URL}/api/traces`, {
    params: {
      service,
      lookback: "1h",
      limit: 10
    },
  });
  return res.data.data;
}
