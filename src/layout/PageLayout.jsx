import React from 'react';
import { Outlet } from 'react-router-dom';
import stylesLayout from "./PageLayout.module.css"
import { Navbar } from '../components/navbar/Navbar';
import { SideBar } from '../components/sidebar/Sidebar';

export const PageLayout = ({totalNotifications,setTotalNotifications ,setActiveTab}) => {
  return (
    <div className={stylesLayout.main}>
      <Navbar  totalNotifications={totalNotifications} setTotalNotifications={setTotalNotifications} setActiveTab={setActiveTab}/>
      <div className={stylesLayout.divs} >
        <div className={stylesLayout.sideBar}>
          <SideBar   />
        </div>
        <div style={{ flex: 1, overflow:"auto"}}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
