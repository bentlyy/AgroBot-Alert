import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const sensorIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div style="width:16px;height:16px;background:#4f46e5;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(79,70,229,0.4);"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const MapView = () => {
  const [unidades, setUnidades] = useState([]);
  const [sensores, setSensores] = useState({});
  const [selected, setSelected] = useState(null);

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

  const center = unidades.length > 0
    ? [parseFloat(unidades[0].latitude), parseFloat(unidades[0].longitude)]
    : [-33.456, -70.65];
  const bounds = unidades.length > 0
    ? unidades.map(u => [parseFloat(u.latitude), parseFloat(u.longitude)])
    : [center];

  return (
    <>
      <MapContainer center={center} zoom={11} style={{ height: 350, width: '100%', borderRadius: 8 }} className="mapContainer" scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {unidades.map((u, idx) => {
          const sens = sensores[u.id_unidad] || [];
          const pos = [parseFloat(u.latitude), parseFloat(u.longitude)];
          return (
            <Marker key={u.id_unidad} position={pos} icon={sensorIcon}>
              <Popup>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minWidth: 200 }}>
                  <h4 style={{ marginBottom: 6, color: '#1e293b' }}>{u.nombre}</h4>
                  <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>
                    ID: {u.id_unidad} | Lat: {u.latitude} | Lng: {u.longitude}
                  </p>
                  {sens.length > 0 ? (
                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 6, marginTop: 4 }}>
                      {sens.map(s => (
                        <div key={s.id_sensor} style={{ fontSize: 12, marginBottom: 4 }}>
                          <strong>{s.nombre || `Sensor #${s.id_sensor}`}</strong>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 8px', marginTop: 2, color: '#475569' }}>
                            <span>🌡️ T1: {s.temperatura_s1}°C</span>
                            <span>🌡️ T2: {s.temperatura_s2}°C</span>
                            <span>💧 H1: {s.humedad_s1}%</span>
                            <span>💧 H2: {s.humedad_s2}%</span>
                            <span>⚡ EC1: {s.electroconductividad_s1}</span>
                            <span>⚡ EC2: {s.electroconductividad_s2}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: 12, color: '#94a3b8' }}>Sin sensores asignados</p>
                  )}
                </motion.div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
};

export default MapView;
