import React, { useState, useEffect } from "react";
import './top.css';
import { MdOutlineNotificationsNone } from "react-icons/md";
import { BiSearchAlt } from "react-icons/bi";
import { TbMessageCircle } from "react-icons/tb";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import img from '../../../Assets/user(3).png';

const Top = ({ nombreUsuario }) => {
    const [units, setUnits] = useState([]);
    const [inactiveTime, setInactiveTime] = useState(0);
    const navigate = useNavigate();

    // Función para restablecer el tiempo de inactividad
    const resetInactiveTime = () => {
        setInactiveTime(0);
    };

    // Función para manejar la inactividad del usuario
    const handleInactive = () => {
        setInactiveTime(prevTime => prevTime + 1);
    };

    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/');  // Redirigir a la página de inicio de sesión
    };

    // Efecto para iniciar el temporizador de inactividad
    useEffect(() => {
        const intervalId = setInterval(handleInactive, 1000);
        return () => clearInterval(intervalId);
    }, []);

    // Efecto para comprobar si se ha alcanzado el tiempo de inactividad máximo
    useEffect(() => {
        const maxInactiveTime = 60 * 10; // 15 minutos de inactividad antes de cerrar sesión
        if (inactiveTime >= maxInactiveTime) {
            handleLogout(); // Cerrar sesión automáticamente
        }
    }, [inactiveTime]);

    // Manejar el evento de actividad del usuario
    const handleActivity = () => {
        resetInactiveTime(); // Restablecer el tiempo de inactividad cuando hay actividad
    };

    // Adjuntar el detector de eventos de actividad del usuario
    useEffect(() => {
        document.addEventListener('mousemove', handleActivity);
        document.addEventListener('keypress', handleActivity);
        return () => {
            document.removeEventListener('mousemove', handleActivity);
            document.removeEventListener('keypress', handleActivity);
        };
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3000/api/map')
            .then(response => setUnits(response.data))
            .catch(error => console.error('Error fetching unit data:', error));
    }, []);

    return (
        <div className="topSection">
            <div className="headerSection flex">
                <div className="title">
                    <h1>Agrobot Alert</h1>
                    <p>Hola {nombreUsuario}, bienvenido de vuelta!</p>
                </div>

                <div className="searchBar flex">
                    <input type="text" placeholder='Busqueda por unidad' />
                    <BiSearchAlt className="icon"/>
                </div>

                <div className="adminDiv flex">
                    <TbMessageCircle className="icon"/>
                    <MdOutlineNotificationsNone className="icon"/>
                    <div className="adminImage">
                        <img src={img} alt="Admin Image" />
                        <button onClick={handleLogout} className="logoutButton">Cerrar Sesión</button>
                    </div>
                </div>
            </div>

            <div className="cardSection flex">
                <div className="rightCard flex">
                    <h1>Track and Monitor Your Units</h1>
                    <p>View real-time data and locations of all your units on the map.</p>

                    <div className="mapContainer">
                        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ height: "400px", width: "100%" }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {units.map(unit => (
                                <Marker key={unit.id_unidad} position={[unit.latitude, unit.longitude]}>
                                    <Popup>
                                        <h3>{unit.nombre}</h3>
                                        <p>Sensor Data: {unit.sensorData}</p>
                                        <p>Other Info: {unit.otherInfo}</p>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Top;
