import React from "react";
import './sidebar.css'

import logo from '../../Assets/logo.png'
import { IoMdSpeedometer } from "react-icons/io";
import { BsQuestionCircle } from "react-icons/bs";

const Sidebar = () => {
    return (

        <div className='sideBAr grid'>
            <div className="logoDiv flex">
                <img src="" alt="Image Name" />
                <h2>Planti.</h2>
            </div>

            <div className="menuDiv">
                <h3 className="divTitle">
                    QUICK MENU
                </h3>
                <ul className="menuLists grid">
                    <li className="listItem">
                        <a href="#" className="menuLink flex">
                            <IoMdSpeedometer className="icon"/>
                            <span className="smallText">
                                Dash board
                            </span>
                        </a>
                    </li>

                    <li className="listItem">
                        <a href="" className="menuLink flex">
                            <IoMdSpeedometer className="icon"/>
                            <span className="smallText">
                                My orders
                            </span>
                        </a>
                    </li>

                    <li className="listItem">
                        <a href="#" className="menuLink flex">
                            <IoMdSpeedometer className="icon"/>
                            <span className="smallText">
                                Explore
                            </span>
                        </a>
                    </li>

                    <li className="listItem">
                        <a href="#" className="menuLink flex">
                            <IoMdSpeedometer className="icon"/>
                            <span className="smallText">
                                Products
                            </span>
                        </a>
                    </li>

                </ul>
            </div>

            <div className="settingsDiv">
                <h3 className="divTitle">
                    SETTINGS
                </h3>
                <ul className="menuLists grid">
                    <li className="listItem">
                        <a href="#" className="menuLink flex">
                            <IoMdSpeedometer className="icon"/>
                            <span className="smallText">
                                Charts
                            </span>
                        </a>
                    </li>

                    <li className="listItem">
                        <a href="" className="menuLink flex">
                            <IoMdSpeedometer className="icon"/>
                            <span className="smallText">
                                Trends
                            </span>
                        </a>
                    </li>

                    <li className="listItem">
                        <a href="#" className="menuLink flex">
                            <IoMdSpeedometer className="icon"/>
                            <span className="smallText">
                                Explore
                            </span>
                        </a>
                    </li>

                    <li className="listItem">
                        <a href="#" className="menuLink flex">
                            <IoMdSpeedometer className="icon"/>
                            <span className="smallText">
                                Contact
                            </span>
                        </a>    
                    </li>

                    <li className="listItem">
                        <a href="#" className="menuLink flex">
                            <IoMdSpeedometer className="icon"/>
                            <span className="smallText">
                                Billing
                            </span>
                        </a>    
                    </li>

                </ul>
            </div>

            <div className="sideBarCard">
                <BsQuestionCircle className="icon"/>
                <div></div>
                <div></div>

                <h3>help center</h3>

                <p>having trouble in planti, please contact us from for more questuions..</p>
                
                <button className="btn">go to help center</button>
            </div>

        </div>

    )
}

export default Sidebar