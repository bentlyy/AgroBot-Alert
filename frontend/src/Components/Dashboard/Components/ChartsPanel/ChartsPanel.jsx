import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const ChartsPanel = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/api/sensores').then(res => {
      const sensores = res.data.slice(0, 4);
      const points = [];
      for (let i = 6; i >= 0; i--) {
        const ts = new Date(Date.now() - i * 3600000);
        const point = { time: `${ts.getHours()}:00` };
        sensores.forEach((s, idx) => {
          point[`temp_${idx}`] = parseFloat(s.temperatura_s1) + (Math.random() - 0.5) * 4;
          point[`hum_${idx}`] = parseFloat(s.humedad_s1) + (Math.random() - 0.5) * 8;
        });
        points.push(point);
      }
      setData(points);
    }).catch(() => {});
  }, []);

  const metrics = data.length > 0
    ? Object.keys(data[0]).filter(k => k.startsWith('temp_'))
    : [];

  return (
    <div className="chartWrapper">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <Tooltip
            contentStyle={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
          />
          <Legend />
          {metrics.slice(0, 4).map((key, i) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COLORS[i]}
              strokeWidth={2}
              dot={false}
              name={`Sensor ${i + 1}`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartsPanel;
