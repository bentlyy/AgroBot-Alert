import React from 'react';
import Sidebar from './Components/Sidebar Section/Sidebar';
import Body from './Components/Body Section/Body';

import '../../App.scss'

const Dashboard = () => {
    const menuItems = [
        { id: 1, name: 'Unidades', link: 'Unidades' },
        { id: 2, name: 'Usuarios', link: 'Usuarios' },
        { id: 2, name: 'Alertas', link: 'Alertas' },
        { id: 3, name: 'Criterios', link: 'Criterios' },
        { id: 4, name: 'Notificaciones', link: 'Notificaciones' },
        // Add more menu items as needed
    ];

    return (
        <div className='dashboard'>
            <div className="dashboardContainer">
                <Sidebar menuItems={menuItems} />
                <Body />
            </div>
        </div>
    );
}

export default Dashboard;
