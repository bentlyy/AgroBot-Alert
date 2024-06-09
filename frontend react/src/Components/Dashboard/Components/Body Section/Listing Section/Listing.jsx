import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './listing.css';

const Listing = () => {
  const [units, setUnits] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/units')
      .then(response => setUnits(response.data))
      .catch(error => console.error('Error fetching units:', error));
  }, []);

  return (
    <div className="listingSection">
      <h2>Lista de Unidades</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Sensor Data</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {units.map(unit => (
            <tr key={unit.id_unidad}>
              <td>{unit.nombre}</td>
              <td>{unit.sensorData}</td>
              <td>{unit.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Listing;
