import React from "react";
import './top.css'
import { MdOutlineNotificationsNone } from "react-icons/md";
import { BiSearchAlt } from "react-icons/bi";
import { TbMessageCircle } from "react-icons/tb";
import { MdOutlineNotificationsNone } from "react-icons/md";

import img from '../../../Assets/user(3).png'
import video from '../../../Assets/video.mp4'
import img2 from '../../../Assets/user(2).png'

import { BsArrowRightShort } from "react-icons/bs";


const Top = () => {
    return (
        <div className="topSection">
            <div className="headerSection flex">
                <div className="title">
                    <h1>Welcome to Pranti.</h1>
                    <p> Helllo isratech, welcome back!</p>
                </div>

                <div className="searchBar flex">
                    <input type="text" placeholder='Search Dashboard' />
                    <BiSearchAlt className="icon"/>
                </div>

                <div className="adminDiv flex">
                    <TbMessageCircle className="icon"/>
                    <MdOutlineNotificationsNone className="icon"/>
                    <div className="adminImage">
                        <img src="{img}" alt="Admin Image" />    
                    </div>                    
                </div>

            </div>

            <div className="cardSection flex">
                <div className="rightCard flex">
                    <h1>Create and sell extraordinary products</h1>
                    <p>the worlds fast growinfsa indasdasshahdsa hsadhas hsdah sjdak</p>

                    <div className="buttons flex">
                        <button className="btn">Explore more</button>
                        <button className="btn transparent">Top sellers</button>
                    </div>

                    <div className="videoDiv">
                        <video src={video} autoPlay loop muted ></video>
                    </div>

                </div>

                <div className="leftCard flex">
                    <div className="main flex">
                        <div className="textDiv">
                            <h1>My stat</h1>

                            <div className="flex">
                                <span>
                                    Today <br/> <small>4 Orders</small>
                                </span>
                            </div>
                            
                            <div className="flex">
                                <span>
                                    This Month <br/> <small>175 Orders</small>
                                </span>
                            </div>

                            <span className="flex link">
                                Go to my orders <BsArrowRightShort
                                className="icon"/>
                            </span>

                        </div>

                        <div className="imgDiv">
                            <img src={img2} alt="Image Name" />
                        </div>

                        <div className="sideBarCard">
                            <BsQuestionCircle className="icon"/>
                            <div className="cardContent">
                              <div className="circle1"></div>
                              <div className="circle2"></div>

                              <h3>help center</h3>

                              <p>having trouble in planti, please contact us from for more questuions..</p>
                
                              <button className="btn">go to help center</button>
                            </div>

                        </div>
                </div>

            </div>
        </div>

    </div>
    )
}

export default Top