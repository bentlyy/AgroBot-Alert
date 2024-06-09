//Dashboard.jsx
import React from 'react'

import Sidebar from '../Dashboard/Components/Sidebar Section/Sidebar'
import Body from '../Dashboard/Components/Body Section/Body'

const Dashboard = () => {
    return(
        <div className="dashboard flex">
            <div className="dashboardContainer flex">
            <Sidebar/>
            <Body/>
            {/*<Routes>
                    <Route path="/" element={<DashboardHome />} />
                    <Route path="/" element={<Orders />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/settings" element={<Settings />} />
            </Routes>*/}
            </div>
        </div>
    )
}

export default Dashboard