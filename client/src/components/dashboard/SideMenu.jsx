import React, { useEffect, useState } from 'react';
import './SideMenu.css'
import MenuItem from './MenuItem';
// import MenuItem from './MenuItem';



/**
 * @author
 * @function SideMenu
 **/

// added more menuItems for testing
export const menuItems = [
  {
    name: "Dashboard",
    exact: true,
    to: "/dashboard",
    iconClassName: "bi bi-speedometer2",
  },
  {
    name: "Article",
    exact: true,
    to: "/dashboard",
    iconClassName: "bi bi-speedometer2",
    subMenus: [
      { name: "Add Article", to: "/dashboard/add-article" },
      { name: "All Article", to: "/dashboard/all-article" },
    ],
  },
  {
    name: "Category",
    exact: true,
    to: "/dashboard",
    iconClassName: "bi bi-speedometer2",
    subMenus: [
      { name: "Add Category", to: "/dashboard/add-category" },
      { name: "All Category", to: "/dashboard/all-category" },
    ],
  },
  {
    name: "Tag",
    exact: true,
    to: "/dashboard",
    iconClassName: "bi bi-speedometer2",
    subMenus: [
      { name: "Add Tag", to: "/dashboard/add-tag" },
      { name: "All Tag", to: "/dashboard/all-tag" },
    ],
  },
  {
    name: "Category Type",
    exact: true,
    to: "/dashboard",
    iconClassName: "bi bi-speedometer2",
    subMenus: [
      { name: "Add Category Type", to: "/dashboard/add-category-type" },
      { name: "All Category Type", to: "/dashboard/all-category-type" },
    ],
  },

];



const SideMenu = (props) => {

    const [inactive, setInactive] = useState(false);

    useEffect(() => {
      if (inactive) {
        removeActiveClassFromSubMenu();
      }
      props.onCollapse(inactive);
    },[inactive])

    //just an improvment and it is not recorded in video :(
    const removeActiveClassFromSubMenu = () => {
      document.querySelectorAll(".sub-menu").forEach((el) => {
        el.classList.remove("active");
      });
    };


    /*just a little improvement over click function of menuItem
      Now no need to use expand state variable in MenuItem component
    */
    useEffect(() => {
      let menuItems = document.querySelectorAll(".menu-item");
      menuItems.forEach((el) => {
        el.addEventListener("click", (e) => {
          const next = el.nextElementSibling;
          removeActiveClassFromSubMenu();
          menuItems.forEach((el) => el.classList.remove("active"));
          el.classList.toggle("active");
          console.log(next);
          if (next !== null) {
            next.classList.toggle("active");
          }
        });
      });
    }, []);

  return (
    <div>
    <div>

    <div className={`side-menu ${inactive ? "inactive" : ""}`}>

        <div onClick={() => setInactive(!inactive)} className="toggle-menu-btn" style={{color:'white'}} >
          {inactive ? (
            <i className="bi bi-arrow-right-square-fill"></i>
          ) : (
            <i className="bi bi-arrow-left-square-fill"></i>
          )}
        </div>

      <div className="top-section">

          

        <div className="logo">
        <h5><span>DashboardSidebar</span></h5>
        <br/>
          <img src="" alt="webscript" />
         
        </div>
       
      </div>

      <div className="search-controller">
        <button className="search-btn">
          <i class="bi bi-search"></i>
        </button>

        <input type="text" placeholder="search" />
      </div>

      <div className="divider"></div>

      <div className="main-menu">
        <ul>
          {
            
          menuItems.map((menuItem, index) => (
            <MenuItem
              key={index}
              name={menuItem.name}
               exact={menuItem.exact}
               to={menuItem.to}
              subMenus={menuItem.subMenus || []}
               iconClassName={menuItem.iconClassName}
               onClick={(e) => {
                if (inactive) {
                  setInactive(false);
                }
               }}
            />
          ))
          
          }


          {/*
          <li>
            <a className="menu-item">
              <div className="menu-icon">
                <i class="bi bi-speedometer2"></i>
              </div>
              <span>Dashboard</span>
            </a>
          </li>

        
          
          <MenuItem
                name={"Content"}
                subMenus={[{ name: "Courses" }, { name: "Videos" }]}
            />
          
                      
          
          <li>
            <a className="menu-item">
              <div className="menu-icon">
                <i class="bi bi-vector-pen"></i>
              </div>
              <span>Design</span>
            </a>
          </li>
          */}   
          
          
        </ul>
      </div>
      
      
      <div className="side-menu-footer">
        <div className="avatar">
          <img src="" alt="user" />
        </div>
        <div className="user-info">
          <h5>Rizwan Khan</h5>
          <p>rizwankhan@gmail.com</p>
        </div>
      </div>
      
      
      
    </div>

    </div>
    </div>
  )
}

export default SideMenu