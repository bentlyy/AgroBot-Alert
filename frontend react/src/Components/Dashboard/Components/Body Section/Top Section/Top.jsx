import React, { useState, useEffect } from "react";
import './top.css';
import { MdOutlineNotificationsNone } from "react-icons/md";
import { BiSearchAlt } from "react-icons/bi";
import { TbMessageCircle } from "react-icons/tb";
import { BsArrowRightShort, BsQuestionCircle } from "react-icons/bs";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

import img from '../../../Assets/user(3).png';

const Top = () => {
    const [units, setUnits] = useState([]);

    useEffect(() => {
        // Fetch unit data
        axios.get('http://localhost:3000/api/map')  // Adjust URL to your API endpoint
            .then(response => setUnits(response.data))
            .catch(error => console.error('Error fetching unit data:', error));
    }, []);

    return (
        <div className="topSection">
            <div className="headerSection flex">
                <div className="title">
                    <h1>Welcome to Pranti.</h1>
                    <p>Hello isratech, welcome back!</p>
                </div>

                <div className="searchBar flex">
                    <input type="text" placeholder='Search Dashboard' />
                    <BiSearchAlt className="icon"/>
                </div>

                <div className="adminDiv flex">
                    <TbMessageCircle className="icon"/>
                    <MdOutlineNotificationsNone className="icon"/>
                    <div className="adminImage">
                        <img src={img} alt="Admin Image" />
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
