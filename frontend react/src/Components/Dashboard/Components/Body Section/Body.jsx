import React from "react";
import './body.css';
import Top from './Top Section/Top';
import Alertas from './Alertas/Alertas';
import Notificaciones from './Notificaciones/Notificaciones';
import Usuarios from './Usuarios/Usuarios';
import Criterios from './Criterios/Criterios';
import Unidades from './Unidades/Unidades';
import { Routes, Route } from "react-router-dom";

const Body = () => {
    const nombreUsuario = localStorage.getItem('usuario');
    return (
        <div className="mainContent">
            <Top nombreUsuario={nombreUsuario} />
            <div className="bottom flex">
                <Routes>
                    <Route path="Unidades" element={<Unidades />} />
                    <Route path="Usuarios" element={<Usuarios />} />
                    <Route path="Criterios" element={<Criterios />} />
                    <Route path="Alertas" element={<Alertas />} />
                    <Route path="Notificaciones" element={<Notificaciones />} />
                    {/* Add more routes as needed */}
                </Routes>
            </div>
        </div>
    );
}

export default Body;
