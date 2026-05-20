import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MdDashboard, MdOutlineAgriculture, MdSensors, MdOutlineNotifications,
  MdPeople, MdLogout, MdWarning, MdMenu
} from 'react-icons/md';
import { TbAlertTriangle } from 'react-icons/tb';
import { FiSettings } from 'react-icons/fi';
import TopBar from './Components/TopBar/TopBar';
import StatsCards from './Components/StatsCards/StatsCards';
import MapView from './Components/MapView/MapView';
import ChartsPanel from './Components/ChartsPanel/ChartsPanel';
import AlertsPanel from './Components/AlertsPanel/AlertsPanel';
import UnitsPanel from './Components/UnitsPanel/UnitsPanel';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [user, setUser] = useState({ nombre: 'Usuario', rol: 'usuario' });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <MdDashboard /> },
    { key: 'unidades', label: 'Unidades', icon: <MdOutlineAgriculture /> },
    { key: 'sensores', label: 'Sensores', icon: <MdSensors /> },
    { key: 'alertas', label: 'Alertas', icon: <TbAlertTriangle />, badge: 3 },
    { key: 'usuarios', label: 'Usuarios', icon: <MdPeople /> },
    { key: 'notificaciones', label: 'Notificaciones', icon: <MdOutlineNotifications /> },
  ];

  const initials = user.nombre
    ? user.nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="dashboard">
      <motion.aside className="sidebar" initial={{ x: -260 }} animate={{ x: 0 }} transition={{ duration: 0.3 }}>
        <div className="logo">
          <h2>AgroBot</h2>
          <small>Monitoreo Agrícola</small>
        </div>

        <div className="navSection">
          <div className="sectionTitle">Menú Principal</div>
          {navItems.map(item => (
            <div
              key={item.key}
              className={`navItem ${activeSection === item.key ? 'active' : ''}`}
              onClick={() => setActiveSection(item.key)}
            >
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && <span className="badge">{item.badge}</span>}
            </div>
          ))}
        </div>

        <div className="navSection">
          <div className="sectionTitle">Configuración</div>
          <div className="navItem">
            <span className="icon"><FiSettings /></span>
            <span>Ajustes</span>
          </div>
        </div>

        <div className="footer">
          <div className="userInfo">
            <div className="avatar">{initials}</div>
            <div className="details">
              <div className="name">{user.nombre}</div>
              <div className="role">{user.rol}</div>
            </div>
          </div>
          <button className="logoutBtn" onClick={handleLogout}>
            <MdLogout style={{ marginRight: 6 }} /> Cerrar Sesión
          </button>
        </div>
      </motion.aside>

      <main className="mainContent">
        <TopBar user={user} />
        <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {activeSection === 'dashboard' && (
            <>
              <StatsCards />
              <div className="dashboardGrid">
                <div className="dashCard">
                  <div className="cardHeader">
                    <h3><MdSensors style={{ marginRight: 6 }} /> Mapa de Sensores</h3>
                    <span className="cardAction">Ver todos →</span>
                  </div>
                  <MapView />
                </div>
                <AlertsPanel />
              </div>
              <div className="dashboardGrid2">
                <div className="dashCard">
                  <div className="cardHeader">
                    <h3><MdWarning style={{ marginRight: 6 }} /> Temperatura y Humedad</h3>
                    <span className="cardAction">Ver historial →</span>
                  </div>
                  <ChartsPanel />
                </div>
                <UnitsPanel />
              </div>
            </>
          )}
          {activeSection === 'unidades' && <UnitsPanel full />}
          {activeSection === 'sensores' && <StatsCards />}
          {activeSection === 'alertas' && <AlertsPanel full />}
          {activeSection === 'usuarios' && <div className="dashCard" style={{ padding: '2rem', textAlign: 'center' }}><h2>Gestión de Usuarios</h2><p style={{ color: 'var(--text-light)', marginTop: 8 }}>Módulo en desarrollo</p></div>}
          {activeSection === 'notificaciones' && <div className="dashCard" style={{ padding: '2rem', textAlign: 'center' }}><h2>Notificaciones</h2><p style={{ color: 'var(--text-light)', marginTop: 8 }}>Módulo en desarrollo</p></div>}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
