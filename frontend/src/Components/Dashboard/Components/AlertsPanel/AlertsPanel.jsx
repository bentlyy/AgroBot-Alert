import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { MdWarning, MdError, MdInfo, MdArrowForward } from 'react-icons/md';

const alertIcons = {
  critico: <MdWarning style={{ color: '#ef4444' }} />,
  advertencia: <MdError style={{ color: '#f59e0b' }} />,
  info: <MdInfo style={{ color: '#3b82f6' }} />,
};

const AlertsPanel = ({ full }) => {
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    axios.get('/api/alertas').then(res => setAlertas(res.data)).catch(() => {});
  }, []);

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Ahora';
    if (mins < 60) return `Hace ${mins} min`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return `Hace ${hrs}h ${rem}m`;
  };

  const display = full ? alertas : alertas.slice(0, 5);

  return (
    <div className="dashCard">
      <div className="cardHeader">
        <h3><MdWarning style={{ marginRight: 6 }} /> Alertas Recientes</h3>
        {!full && <span className="cardAction">Ver todas <MdArrowForward /></span>}
      </div>
      <div className="alertList">
        {display.length === 0 && (
          <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '1rem 0' }}>
            No hay alertas registradas
          </p>
        )}
        {display.map((a, i) => (
          <motion.div
            key={a.id}
            className="alertItem"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <div className={`alertIcon ${a.tipo}`}>
              {alertIcons[a.tipo] || <MdInfo />}
            </div>
            <div className="alertContent">
              <div className="alertTitle">{a.tipo === 'critico' ? 'Crítico' : a.tipo === 'advertencia' ? 'Advertencia' : 'Información'}</div>
              <div className="alertMsg">{a.mensaje}</div>
            </div>
            <div className="alertTime">{timeAgo(a.fecha_creacion)}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPanel;
