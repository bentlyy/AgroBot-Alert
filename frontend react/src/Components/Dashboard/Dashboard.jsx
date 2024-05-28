import React from 'react'
//import Sidebar from '../Dashboard/Components/SideBar Section/Sidebar'
//import Body from '../Dashboard/Components/Body Section/Body'



const Dashboard = () => {
    return(
        <div className='dashboard flex'>
          <div className='dashboardContainer flex'></div>
          <Sidebar/>
          <Body/> 
        </div>
    )
}

export default Dashboard