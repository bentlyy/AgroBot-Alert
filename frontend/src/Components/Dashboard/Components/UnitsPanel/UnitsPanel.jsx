import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { MdSensors, MdArrowForward } from 'react-icons/md';

const UnitsPanel = ({ full }) => {
  const [unidades, setUnidades] = useState([]);
  const [sensores, setSensores] = useState({});
  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {
    axios.get('/api/unidades').then(res => setUnidades(res.data)).catch(() => {});
    axios.get('/api/sensores').then(res => {
      const map = {};
      res.data.forEach(s => {
        if (!map[s.id_unidad]) map[s.id_unidad] = [];
        map[s.id_unidad].push(s);
      });
      setSensores(map);
    }).catch(() => {});
  }, []);

  const getStatus = (id) => {
    const sens = sensores[id];
    if (!sens || sens.length === 0) return 'offline';
    const avg = sens.reduce((a, s) => a + parseFloat(s.temperatura_s1 || 0), 0) / sens.length;
    return avg > 33 ? 'warning' : 'online';
  };

  const display = full ? unidades : unidades.slice(0, 5);

  return (
    <>
      <div className="dashCard">
        <div className="cardHeader">
          <h3><MdSensors style={{ marginRight: 6 }} /> Unidades de Monitoreo</h3>
          {!full && <span className="cardAction">Ver todas <MdArrowForward /></span>}
        </div>
        <div className="unitList">
          {display.length === 0 && (
            <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '1rem 0' }}>
              No hay unidades registradas
            </p>
          )}
          {display.map((u, i) => (
            <motion.div
              key={u.id_unidad}
              className="unitItem"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              onClick={() => setSelectedUnit(u)}
            >
              <span className={`unitDot ${getStatus(u.id_unidad)}`} />
              <div className="unitInfo">
                <div className="unitName">{u.nombre}</div>
                <div className="unitCoord">
                  {sensores[u.id_unidad]?.length || 0} sensores · Lat {u.latitude} · Lng {u.longitude}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedUnit && (
        <div className="modalOverlay" onClick={() => setSelectedUnit(null)}>
          <motion.div
            className="modalContent"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modalHeader">
              <h2>{selectedUnit.nombre}</h2>
              <button className="closeBtn" onClick={() => setSelectedUnit(null)}>✕</button>
            </div>
            <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.85rem' }}>
              ID: {selectedUnit.id_unidad} · Lat: {selectedUnit.latitude} · Lng: {selectedUnit.longitude}
            </p>
            {(sensores[selectedUnit.id_unidad] || []).length === 0 ? (
              <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '1rem' }}>
                Esta unidad no tiene sensores asignados
              </p>
            ) : (
              <div className="sensorGrid">
                {sensores[selectedUnit.id_unidad].map(s => (
                  <div key={s.id_sensor} className="sensorItem">
                    <label>{s.nombre || `Sensor #${s.id_sensor}`}</label>
                    <div className="value">{s.temperatura_s1}°C</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: 2 }}>
                      Hum: {s.humedad_s1}% | EC: {s.electroconductividad_s1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
};

export default UnitsPanel;
