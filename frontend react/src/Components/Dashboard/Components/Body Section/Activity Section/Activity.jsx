import React from "react";
import './activity.css'
import { BsArrowRightCircle, BsArrowRightShort } from "react-icons/bs";

import user from '../../../Assets/user(1).png'

const Activity = () => {
    return (
        <div className="activitySection">
            <div className="heading flex">
                <h1>Resent Activity</h1>
                <button className="btn flex">
                    See all
                    <BsArrowRightShort className="icon"/>
                </button>
            </div>

            <div className="secContainer grid">

                <div className="singleCustomer flex">
                    <img src={user} alt="Customer Image" />
                    <div className="customerDetails">
                        <span className="name">Ola Martha</span>
                        <small>Ordered a neew plant</small>
                    </div>
                    <div className="duration">
                        2 min ago
                    </div>
                </div>

                <div className="singleCustomer flex">
                    <img src={user} alt="Customer Image" />
                    <div className="customerDetails">
                        <span className="name">Ola Martha</span>
                        <small>Ordered a neew plant</small>
                    </div>
                    <div className="duration">
                        2 min ago
                    </div>
                </div>

                <div className="singleCustomer flex">
                    <img src={user} alt="Customer Image" />
                    <div className="customerDetails">
                        <span className="name">Ola Martha</span>
                        <small>Ordered a neew plant</small>
                    </div>
                    <div className="duration">
                        2 min ago
                    </div>
                </div>

                <div className="singleCustomer flex">
                    <img src={user} alt="Customer Image" />
                    <div className="customerDetails">
                        <span className="name">Ola Martha</span>
                        <small>Ordered a neew plant</small>
                    </div>
                    <div className="duration">
                        2 min ago
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Activity