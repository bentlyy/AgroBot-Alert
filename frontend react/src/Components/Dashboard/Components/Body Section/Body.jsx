import React from "react";
import './body.css'
import Top from './Top Section/Top'
import Listing from './Listing Section/Listing'
import Activity from './Activity Section/Activity'

const Body = () => {
    const nombreUsuario = localStorage.getItem('usuario');
    return (
        <div className="mainContent">
            <Top nombreUsuario={nombreUsuario} />

            <div className="bottom flex">
                <Listing />
                <Activity />
            </div>
        </div>
    )
}

export default Body;
