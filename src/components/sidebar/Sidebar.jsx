import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import stylesSidebar from './Sidebar.module.css';
import dashboardIcon from '../../assets/sidebar/dashboard.png';
import uploadIcon from '../../assets/sidebar/upload-big-arrow.png';
import formIcon from '../../assets/sidebar/form.svg';
import rightArrow from '../../assets/sidebar/right-arrow-svgrepo-com.svg';
import notificationIcon from '../../assets/navbar/notification.svg';
import adminIcon from "../../assets/sidebar/adminIcon.svg"
import editAdimn from "../../assets/sidebar/settingadmin.svg"
import docMangerIcon from "../../assets/sidebar/Document Management.svg"

export const SideBar = () => {
  const navigate = useNavigate();
  const [expand, setExpand] = useState(false);
  const [activeItem, setActiveItem] = useState(''); // State to track the active sidebar item

  // Function to handle navigation and set active item
  const handleNavigation = (path, item) => {
    navigate(path);
    setActiveItem(item); // Set the active item
  };

  const role = localStorage.getItem('RoleType');
  return (
    <div
      className={stylesSidebar.main}
      style={{ width: expand ? '215px' : '40px' }}
    >
      <div className={stylesSidebar.divArrow} onClick={() => setExpand(!expand)}>
        <img
          className={stylesSidebar.imgRightArrow}
          src={rightArrow}
          alt="Toggle Sidebar"
          style={{
            transform: expand ? 'rotate(180deg)' : 'rotate(0deg)', // Arrow rotation
            transition: 'transform 0.3s ease',
          }}
        />
        {expand && <span className={stylesSidebar.info}></span>}
      </div>

      {/* Dashboard */}
      <div 
        className={`${stylesSidebar.divs} ${activeItem === 'dashboard' ? stylesSidebar.active : ''}`}
        onClick={() => handleNavigation('/dashboard', 'dashboard')}>
        <img
          className={stylesSidebar.imgRightArrow}
          src={dashboardIcon}
          alt="Dashboard"
        />
        {expand && <span className={stylesSidebar.info}>Dashboard</span>}
      </div>

      {/* Doc Upload and AI */}
      <div 
        className={`${stylesSidebar.divs} ${activeItem === 'genAI' ? stylesSidebar.active : ''}`}
        onClick={() => handleNavigation('/genAI', 'genAI')}>
        <img
          className={stylesSidebar.imgRightArrow}
          src={uploadIcon}
          alt="Doc Upload and AI"
        />
        {expand && <span className={stylesSidebar.info}>Doc Upload and AI</span>}
      </div>

      {/* Loan Application Form */}
      <div 
        className={`${stylesSidebar.divs} ${activeItem === 'loanApplication' ? stylesSidebar.active : ''}`}
        onClick={() => handleNavigation('/loan-application-form', 'loanApplication')}>
        <img
          className={stylesSidebar.imgRightArrow}
          src={formIcon}
          alt="Loan Application Form"
        />
        {expand && <span className={stylesSidebar.info}>Loan Application Form</span>}
      </div>

      {/* Notifications */}
      <div 
        className={`${stylesSidebar.divs} ${activeItem === 'notifications' ? stylesSidebar.active : ''}`}
        onClick={() => handleNavigation('/notifications', 'notifications')}>
        <img
          className={stylesSidebar.imgRightArrow}
          src={notificationIcon}
          alt="Notification"
        />
        {expand && <span className={stylesSidebar.info}>Notification</span>}
      </div>
        

      <div 
        className={`${stylesSidebar.divs} ${activeItem === 'documentMananger' ? stylesSidebar.active : ''}`}
        onClick={() => handleNavigation('/documentMananger', 'documentMananger')}>
        <img
          className={stylesSidebar.imgRightArrow}
          src={docMangerIcon}
          alt="documentMananger"
        />
        {expand && <span className={stylesSidebar.info}>Document Manager</span>}
      </div>
      {/* Admin section (visible only if role is admin) */}



      {role === "admin" && (
        <>
        <div 
          className={`${stylesSidebar.divs} ${activeItem === 'userAdmin' ? stylesSidebar.active : ''}`}
          onClick={() => handleNavigation('/userAdmin', 'userAdmin')}>
          <img
            className={stylesSidebar.imgRightArrow}
            src={adminIcon}
            alt="User Admin"
          />
          {expand && <span className={stylesSidebar.info}>User Admin</span>}
        </div>
        <div 
          className={`${stylesSidebar.divs} ${activeItem === 'enhancementByAdmin' ? stylesSidebar.active : ''}`}
          onClick={() => handleNavigation('/enhancementByAdmin', 'usenhancementByAdminerAdmin')}>
          <img
            className={stylesSidebar.imgRightArrow}
            src={editAdimn}
            alt="Enhancement By Admin"
          />
          {expand && <span className={stylesSidebar.info}>Modification Tables</span>}
        </div>
        </>
        
      )}
    </div>
  );
};
