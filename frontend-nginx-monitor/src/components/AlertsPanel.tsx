import React, { useEffect, useState } from 'react';

interface Alert {
  id: number;
  timestamp: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
}

const generateDummyAlerts = (): Alert[] => {
  const now = new Date();
  return Array.from({ length: 4 }, (_, i) => {
    const time = new Date(now.getTime() - i * 60000).toLocaleTimeString();
    const severities = ['info', 'warning', 'critical'];
    const messages = [
      'CPU usage exceeded 80% on node-1',
      'High response time detected on /api/login',
      'Memory leak suspected on node-3',
      'Disk I/O errors on persistent volume claim'
    ];
    return {
      id: i,
      timestamp: time,
      message: messages[i % messages.length],
      severity: severities[i % severities.length] as 'info' | 'warning' | 'critical'
    };
  });
};

const AlertsPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(generateDummyAlerts());

  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts(generateDummyAlerts());
    }, 10 * 60 * 1000); // every 10 minutes
    return () => clearInterval(interval);
  }, []);

  const removeAlert = (id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <div>
      <h2>🚨 Active Alerts</h2>
      <ul className="alerts-list">
        {alerts.map(alert => (
          <li key={alert.id} className={`alert alert-${alert.severity}`}>
            <strong>[{alert.timestamp}]</strong> {alert.message}
            <button onClick={() => removeAlert(alert.id)}>Dismiss</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlertsPanel;
