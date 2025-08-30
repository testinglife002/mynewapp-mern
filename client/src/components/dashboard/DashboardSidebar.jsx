// src/components/dashboard/SideMenu.jsx
import React, { useState } from 'react';
import styles from './DashboardSidebar.module.css';
// import MenuItem, { menuItems } from './MenuItem';
import MenuItems, { allMenuItems } from './MenuItems';

const DashboardSidebar = ({ onCollapse }) => {
  const [inactive, setInactive] = useState(false);
  const toggleMenu = () => {
    setInactive(!inactive);
    onCollapse(!inactive);
  };

  return (
    <div className={`${styles.sideMenu} ${inactive ? styles.inactive : ''}`}>
        <br/>WW
      <div className={styles.topSection}>
        <div onClick={toggleMenu} className={styles.toggleMenuBtn}>
            <i
            className={`bi ${
                inactive ? 'bi-arrow-right-square-fill' : 'bi-arrow-left-square-fill'
            }`}
            />
        </div>
        {!inactive && (
            <div className={styles.logo}>
            <h5>Dashboard</h5>
            </div>
        )}
      </div>


      <div className={styles.searchController}>
        <button className={styles.searchBtn}>
          <i className="bi bi-search" />
        </button>
        <input type="text" placeholder="Search" />
      </div>

      <div className={styles.divider} />

      <div className={styles.mainMenu}>
        <ul>
          {allMenuItems.map((item, i) => (
            <MenuItems
              key={i}
              {...item}
              sidebarInactive={inactive} // 👈 pass this down
              onClick={() => inactive && setInactive(false)}
            />
          ))}
        </ul>
      </div>

      <div className={styles.footer}>
        <div className={styles.avatar}>
          <img src="https://via.placeholder.com/40" alt="User" />
        </div>
        <div className={styles.userInfo}>
          <h5>Rizwan Khan</h5>
          <p>rizwankhan@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
