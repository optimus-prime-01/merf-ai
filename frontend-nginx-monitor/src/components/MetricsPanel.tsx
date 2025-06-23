// import React from 'react';

// const MetricsPanel: React.FC = () => {
//   return (
//     <div>
//       <h2>Grafana Metrics</h2>
//       <iframe
//         src="http://localhost:3000/d/nginx/nginx-dashboard?orgId=1"
//         width="100%"
//         height="400"
//         frameBorder="0"
//         title="Grafana Metrics"
//       />
//     </div>
//   );
// };

// export default MetricsPanel;
import React, { useEffect, useState } from 'react';

interface Props {
  title: string;
}

const dummyMetrics = [
  { label: 'CPU Usage (%)', value: '65.3' },
  { label: 'Memory Usage (MB)', value: '2048' },
  { label: 'Active Connections', value: '145' },
  { label: 'Requests per Second', value: '22' },
];

const MetricsPanel: React.FC<Props> = ({ title }) => {
  const [metrics, setMetrics] = useState(dummyMetrics);

  useEffect(() => {
    const interval = setInterval(() => {
      // Optional: Randomize values slightly for realism
      setMetrics((prev) =>
        prev.map((m) => ({
          ...m,
          value: (parseFloat(m.value) + (Math.random() * 2 - 1)).toFixed(1),
        }))
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>{title}</h2>
      <div className="metrics-box">
        {metrics.map((m, i) => (
          <div key={i} className="metric">
            <span className="label">{m.label}</span>
            <span className="value">{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricsPanel;