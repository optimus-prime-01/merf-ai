import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface Props {
  title: string;
}

const generateDummyData = () => {
  const now = new Date();
  return Array.from({ length: 10 }, (_, i) => {
    const timestamp = new Date(now.getTime() - (9 - i) * 10000).toLocaleTimeString();
    return {
      time: timestamp,
      Server: Math.floor(100 + Math.random() * 50),
      Socket: Math.floor(80 + Math.random() * 30),
      WriteStream: Math.floor(50 + Math.random() * 25),
      Total: Math.floor(200 + Math.random() * 60),
      AlertError: Math.floor(1 + Math.random() * 5),
      MemoryUsage: Math.floor(60 + Math.random() * 20)
    };
  });
};

const TimeSeriesChart: React.FC<Props> = ({ title }) => {
  const [data, setData] = useState(generateDummyData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateDummyData());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Server" stroke="#8884d8" />
          <Line type="monotone" dataKey="Socket" stroke="#82ca9d" />
          <Line type="monotone" dataKey="WriteStream" stroke="#ffc658" />
          <Line type="monotone" dataKey="Total" stroke="#ff7300" />
          <Line type="monotone" dataKey="AlertError" stroke="#ff0000" />
          <Line type="monotone" dataKey="MemoryUsage" stroke="#00bcd4" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeSeriesChart;
