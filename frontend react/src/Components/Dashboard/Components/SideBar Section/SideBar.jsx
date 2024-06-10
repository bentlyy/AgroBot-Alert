import React from 'react';
import './sidebar.css';
import { IoMdSpeedometer } from "react-icons/io";
import { BsQuestionCircle } from "react-icons/bs";
import { Link } from "react-router-dom";

const Sidebar = ({ menuItems }) => {
  return (
    <div className='sideBAr grid'>
      <div className="logoDiv flex">
        {/*<img src={logo} alt="Image Name" />*/}
      </div>

      <div className="menuDiv">
        <h3 className="divTitle">Menú</h3>
        <ul className="menuLists grid">
          {menuItems.map((menuItem) => (
            <li className="listItem" key={menuItem.id}>
              <Link to={menuItem.link} className="menuLink flex">
                <IoMdSpeedometer className="icon"/>
                <span className="smallText">{menuItem.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="sideBarCard">
        <BsQuestionCircle className="icon"/>
        <div></div>
        <div></div>

        <h3>Centro de ayuda</h3>
        <p>Tienes problemas?</p>
        <button className="btn">contactanos</button>
      </div>
    </div>
  );
};

export default Sidebar;
