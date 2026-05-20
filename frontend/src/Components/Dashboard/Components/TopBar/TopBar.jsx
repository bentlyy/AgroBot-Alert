import React from 'react';
import { MdOutlineNotificationsNone, MdSearch, MdMessage } from 'react-icons/md';

const TopBar = ({ user }) => {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="topBar">
      <div className="pageTitle">
        <h1>Dashboard</h1>
        <p>{dateStr.charAt(0).toUpperCase() + dateStr.slice(1)} — {timeStr}</p>
      </div>
      <div className="topActions">
        <div className="searchBar">
          <MdSearch className="icon" />
          <input type="text" placeholder="Buscar..." />
        </div>
        <button className="iconBtn">
          <MdMessage />
        </button>
        <button className="iconBtn">
          <MdOutlineNotificationsNone />
          <span className="dot" />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
