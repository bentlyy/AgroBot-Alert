import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './activity.css';

const Activity = () => {
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/alertas/alertas')
      .then(response => setAlerts(response.data))
      .catch(error => console.error('Error fetching alerts:', error));

    axios.get('http://localhost:3000/api/alertas/notificaciones')
      .then(response => setNotifications(response.data))
      .catch(error => console.error('Error fetching notifications:', error));
  }, []);

  return (
    <div className="activitySection">
      <div className="alerts">
        <h2>Recent Alerts</h2>
        <ul>
          {alerts.map(alert => (
            <li key={alert.id_alerta}>
              <p>{alert.mensaje}</p>
              <small>{alert.timestamp}</small>
            </li>
          ))}
        </ul>
      </div>
      <div className="notifications">
        <h2>Recent Notifications</h2>
        <ul>
          {notifications.map(notification => (
            <li key={notification.id_notificacion}>
              <p>{notification.mensaje}</p>
              <small>{notification.timestamp}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Activity;
