import React, { useEffect, useState } from 'react';

interface Props {
  job: string;
  title: string;
  useFilenameQuery?: boolean;
}

const dummyLogsData = [
  {
    msg: '127.0.0.1 - - [23/Jun/2025:04:52:10 +0000] "GET /index.html HTTP/1.1" 200 1024',
    level: 'info',
  },
  {
    msg: '127.0.0.1 - - [23/Jun/2025:04:52:20 +0000] "GET /admin HTTP/1.1" 401 512',
    level: 'warn',
  },
  {
    msg: '127.0.0.1 - - [23/Jun/2025:04:52:30 +0000] "POST /upload HTTP/1.1" 500 256',
    level: 'error',
  },
  {
    msg: '127.0.0.1 - - [23/Jun/2025:04:52:40 +0000] "GET /metrics HTTP/1.1" 200 900',
    level: 'info',
  },
  {
    msg: '127.0.0.1 - - [23/Jun/2025:04:52:50 +0000] "GET /favicon.ico HTTP/1.1" 404 0',
    level: 'warn',
  },
];

const LogsViewer: React.FC<Props> = ({ title }) => {
  const [logs, setLogs] = useState<{ msg: string; level: string; timestamp: string }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toISOString();
      const updated = dummyLogsData.map((log) => ({ ...log, timestamp: now }));
      setLogs((prev) => [...updated, ...prev].slice(0, 50));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>{title}</h2>
      <div className="log-box">
        {logs.length ? (
          logs.map((log, i) => (
            <div key={i} className={`log-entry ${log.level}`}>
              [{log.timestamp}] {log.msg}
            </div>
          ))
        ) : (
          <div>No logs found.</div>
        )}
      </div>
    </div>
  );
};

export default LogsViewer;
