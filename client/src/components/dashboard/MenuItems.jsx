// src/components/dashboard/MenuItem.jsx
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './DashboardSidebar.module.css';

export const allMenuItems = [
  {
    name: 'Dashboard',
    exact: true,
    to: '/dashboard',
    iconClassName: 'bi bi-speedometer2',
  },
  {
    name: 'Article',
    to: '/dashboard',
    iconClassName: 'bi bi-journal-text',
    subMenus: [
      { name: 'Add Article', to: '/dashboard/add-article' },
      { name: 'All Articles', to: '/dashboard/all-article' },
    ],
  },
  {
    name: 'Category',
    to: '/dashboard',
    iconClassName: 'bi bi-tags',
    subMenus: [
      { name: 'Add Category', to: '/dashboard/add-category' },
      { name: 'All Categories', to: '/dashboard/all-category' },
    ],
  },
];

const MenuItems = ({ name, subMenus, iconClassName, to, onClick, sidebarInactive }) => {
  const [expand, setExpand] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleExpand = () => setExpand(!expand);
  
  const toggleSubmenu = () => {
    setOpen(!open);
  };

  return (
    <>
    {/*<li onClick={onClick}>
      <Link to={to} className={`${styles.menuItem}`} onClick={toggleExpand}>
        <div className={styles.menuIcon}>
          <i className={iconClassName}></i>
        </div>
        <span>{name}</span>
        {subMenus?.length > 0 && (
          <i
            className={`bi bi-chevron-${expand ? 'up' : 'down'} ms-auto`}
            style={{ fontSize: '0.8rem' }}
          />
        )}
      </Link>

      {subMenus?.length > 0 && (
        <ul className={`${styles.subMenu} ${expand ? styles.active : ''}`}>
          {subMenus.map((s, i) => (
            <li key={i}>
              <NavLink to={s.to} activeClassName={styles.activeSubLink}>
                {s.name}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>*/}
    <li className={styles.menuItem} onClick={toggleSubmenu}>
        <div className={styles.menuIcon}>
          <i className={`bi ${iconClassName}`} />
        </div>
        {!sidebarInactive && <span>{name}</span>}
        {subMenus && (
          <i className={`bi ${open ? 'bi-caret-up-fill' : 'bi-caret-down-fill'}`} style={{ marginLeft: 'auto' }} />
        )}
      </li>

      {subMenus && (
        <ul className={`${styles.subMenu} ${open ? styles.active : ''}`}>
          {subMenus.map((sub, index) => (
            <li key={index}>
              <Link to={sub.route}>{sub.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default MenuItems;
