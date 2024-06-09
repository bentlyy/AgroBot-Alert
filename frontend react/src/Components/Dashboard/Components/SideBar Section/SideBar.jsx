import React from "react";
import './sidebar.css'

import logo from '../../Assets/logo.png'
import { IoMdSpeedometer } from "react-icons/io";
import { BsQuestionCircle } from "react-icons/bs";

const Sidebar = () => {
    return (

        <div className='sideBAr grid'>
            <div className="logoDiv flex">
                {/*<img src={logo} alt="Image Name" />*/}
            </div>

            <div className="menuDiv">
                <h3 className="divTitle">
                    Menú
                </h3>
                <ul className="menuLists grid">
                    <li className="listItem">
                        <a href="#" className="menuLink flex">
                            <IoMdSpeedometer className="icon"/>
                            <span className="smallText">
                                Dashboard
                            </span>
                        </a>
                    </li>

                    <li className="listItem">
                        <a href="#" className="menuLink flex">
                            <IoMdSpeedometer className="icon"/>
                            <span className="smallText">
                                Unidades
                            </span>
                        </a>
                    </li>

                    <li className="listItem">
                        <a href="#" className="menuLink flex">
                            <IoMdSpeedometer className="icon"/>
                            <span className="smallText">
                                Usuarios
                            </span>
                        </a>
                    </li>

                    <li className="listItem">
                        <a href="#" className="menuLink flex">
                            <IoMdSpeedometer className="icon"/>
                            <span className="smallText">
                                Alertas
                            </span>
                        </a>
                    </li>

                    <li className="listItem">
                        <a href="#" className="menuLink flex">
                            <IoMdSpeedometer className="icon"/>
                            <span className="smallText">
                                Criterios
                            </span>
                        </a>
                    </li>

                    <li className="listItem">
                        <a href="#" className="menuLink flex">
                            <IoMdSpeedometer className="icon"/>
                            <span className="smallText">
                                Notificaciones
                            </span>
                        </a>    
                    </li>

                </ul>
            </div>

            <div className="sideBarCard">
                <BsQuestionCircle className="icon"/>
                <div></div>
                <div></div>

                <h3>Centro de ayuda</h3>

                <p>Tienes problemas? </p>
                
                <button className="btn">contactanos</button>
            </div>

        </div>

    )
}

export default Sidebar;
