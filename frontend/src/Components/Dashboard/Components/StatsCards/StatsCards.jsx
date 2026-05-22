import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { MdSensors, MdOutlineAgriculture } from 'react-icons/md';
import { TbAlertTriangle } from 'react-icons/tb';
import { FiUsers } from 'react-icons/fi';

const iconMap = {
  unidades: <MdOutlineAgriculture />,
  sensores: <MdSensors />,
  alertas: <TbAlertTriangle />,
  usuarios: <FiUsers />,
};

const iconColorMap = {
  unidades: 'green',
  sensores: 'blue',
  alertas: 'red',
  usuarios: 'indigo',
};

const StatsCards = ({ selectedUserId }) => {
  const [stats, setStats] = useState({ unidades: 0, sensores: 0, alertas: 0, usuarios: 0 });

  const fetchStats = useCallback(() => {
    const params = selectedUserId ? `?id_usuario=${selectedUserId}` : '';
    Promise.all([
      axios.get(`/api/unidades${params}`).then(r => r.data.length).catch(() => 0),
      axios.get('/api/sensores').then(r => r.data.length).catch(() => 0),
      axios.get(`/api/alertas${params}`).then(r => r.data.length).catch(() => 0),
      axios.get('/api/usuarios').then(r => r.data.length).catch(() => 0),
    ]).then(([unidades, sensores, alertas, usuarios]) => {
      setStats({ unidades, sensores, alertas, usuarios });
    });
  }, [selectedUserId]);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const cards = [
    { key: 'unidades', label: 'Unidades', value: stats.unidades },
    { key: 'sensores', label: 'Sensores', value: stats.sensores },
    { key: 'alertas', label: 'Alertas', value: stats.alertas },
    { key: 'usuarios', label: 'Usuarios', value: stats.usuarios },
  ];

  return (
    <div className="statsGrid">
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          className="statCard"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
        >
          <div className="statHeader">
            <div className={`statIcon ${iconColorMap[card.key]}`}>{iconMap[card.key]}</div>
          </div>
          <h2>{card.value}</h2>
          <p>{card.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
