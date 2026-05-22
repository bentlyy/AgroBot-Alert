import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { MdCheckCircle, MdCancel, MdEmail, MdPhone } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';

const NotificacionesStatus = () => {
  const [estado, setEstado] = useState(null);

  useEffect(() => {
    axios.get('/api/alertas/notificaciones/estado').then(r => setEstado(r.data)).catch(() => {});
  }, []);

  if (!estado) {
    return (
      <div className="dashCard" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-light)' }}>Cargando estado de notificaciones...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dashboardGrid2">
      <div className="dashCard">
        <div className="cardHeader">
          <h3><FaWhatsapp style={{ marginRight: 8, color: '#25D366' }} /> WhatsApp (Twilio)</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {estado.whatsapp.configurado ? <MdCheckCircle style={{ color: 'var(--success)', fontSize: 20 }} /> : <MdCancel style={{ color: 'var(--danger)', fontSize: 20 }} />}
            <span>{estado.whatsapp.configurado ? 'Configurado' : 'No configurado'}</span>
          </div>
          <div style={{ background: 'var(--bg)', borderRadius: 8, padding: 12, fontSize: '0.85rem' }}>
            <p><strong>Desde:</strong> {estado.whatsapp.desde}</p>
            <p><strong>Destino:</strong> {estado.whatsapp.destino_predeterminado}</p>
          </div>
          {!estado.whatsapp.configurado && (
            <div style={{ background: 'rgba(239,68,68,0.08)', borderRadius: 8, padding: 12, fontSize: '0.8rem', color: 'var(--danger)' }}>
              Para activar WhatsApp, configura en tu <code>.env</code>:
              <pre style={{ marginTop: 8, background: '#1e293b', color: '#e2e8f0', padding: 8, borderRadius: 4, fontSize: '0.75rem' }}>
TWILIO_ACCOUNT_SID=tu_sid
TWILIO_AUTH_TOKEN=tu_token
TWILIO_WHATSAPP_TO=+56953818617
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="dashCard">
        <div className="cardHeader">
          <h3><MdEmail style={{ marginRight: 8, color: '#ea4335' }} /> Email</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {estado.email.configurado ? <MdCheckCircle style={{ color: 'var(--success)', fontSize: 20 }} /> : <MdCancel style={{ color: 'var(--danger)', fontSize: 20 }} />}
            <span>{estado.email.configurado ? 'Configurado' : 'No configurado'}</span>
          </div>
          <div style={{ background: 'var(--bg)', borderRadius: 8, padding: 12, fontSize: '0.85rem' }}>
            <p><strong>Usuario:</strong> {estado.email.usuario}</p>
            <p><strong>Destino:</strong> {estado.email.destino_predeterminado}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificacionesStatus;
