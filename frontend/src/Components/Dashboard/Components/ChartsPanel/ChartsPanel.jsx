import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const ChartsPanel = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/sensores'),
      axios.get('/api/mediciones/sensor/1'),
    ]).then(([sensRes, medRes]) => {
      const sensores = sensRes.data.slice(0, 4);
      const mediciones = medRes.data || [];

      if (!mediciones.length || !sensores.length) {
        setLoading(false);
        return;
      }

      const grouped = {};
      mediciones.forEach(m => {
        const key = new Date(m.timestamp).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
        if (!grouped[key]) grouped[key] = { time: key };
        grouped[key][`temp_0`] = parseFloat(m.valor);
      });

      sensores.forEach((s, idx) => {
        Object.keys(grouped).forEach(key => {
          if (!grouped[key][`temp_${idx}`]) {
            grouped[key][`temp_${idx}`] = parseFloat(s.temperatura_s1);
          }
          if (!grouped[key][`hum_${idx}`]) {
            grouped[key][`hum_${idx}`] = parseFloat(s.humedad_s1);
          }
        });
      });

      setData(Object.values(grouped).slice(-12));
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const metrics = data.length > 0
    ? Object.keys(data[0]).filter(k => k.startsWith('temp_'))
    : [];

  if (loading) {
    return (
      <div className="chartWrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-light)' }}>Cargando datos...</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="chartWrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-light)' }}>Sin datos de mediciones disponibles</p>
      </div>
    );
  }

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
