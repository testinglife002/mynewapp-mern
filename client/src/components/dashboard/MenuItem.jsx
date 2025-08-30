import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom';

const MenuItem = (props) => {

          
    const { name, subMenus, iconClassName, onClick, to, exact } = props;
    const [expand, setExpand] = useState(false);

  return (
    <div>
      <li 
          onClick={props.onClick}
        >
        <Link
            exact
            to={to}
           // onClick={() => {
           //  setExpand((e) => !e);
           // }}
          className={`menu-item`}
        >
          <div className="menu-icon">
            <i 
                className={iconClassName}
                ></i>
          </div>
          <span>{name}</span>
        </Link>
        {
          
        subMenus && subMenus.length > 0 ? (
          <ul className={`sub-menu`}>
            {subMenus.map((menu, index) => (
              <li key={index}>
                <NavLink to={menu.to} >{menu.name}</NavLink>
              </li>
            ))}
          </ul>
        ) : null
        
        }
      </li>
    </div>
  )
}

export default MenuItem