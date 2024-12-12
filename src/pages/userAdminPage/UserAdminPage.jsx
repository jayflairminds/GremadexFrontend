import React, { useState } from 'react';
import styles from "./UserAdminPage.module.css"
import { AddUserByAdmin } from '../../components/addUserByAdmin/AddUserByAdmin';
import { ListOfUser } from '../../components/listOfUser/ListOfUser';

export const UserAdminPage = () => {
  const [activeTab, setActiveTab] = useState('listOfUsers');
  // Handle input changes
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const dark = JSON.parse(localStorage.getItem('darkTheme'));
  return (
    <div  className={styles.main}
    style={{
      backgroundColor: dark ? '#084c61' : 'white',         // Change text color based on the theme
    }}>
         <div className={styles.tabs}>
          <div>
            <button style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}
              onClick={() => handleTabClick('listOfUsers')}
              className={`${styles.tabButton} ${activeTab === 'listOfUsers' ? styles.activeTab : styles.inactiveTab}`}
            >
              <span style={{ fontSize: "15px", color: "white" }}>List Of Users</span>
            </button>
            <button  style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
              onClick={() => handleTabClick('adUser')}
              className={`${styles.tabButton} ${activeTab === 'adUser' ? styles.activeTab : styles.inactiveTab}`}
            >
              <span style={{ fontSize: "15px", color: "white" }}>Add Users</span>
            </button>
          </div>
            

        </div>
        <div style={{ paddingTop: "0rem" }}>
          {activeTab === 'listOfUsers' && (
            <div>
              <ListOfUser />
            </div>
          )}
        </div>
        <div style={{ paddingTop: "0rem" }}>
          {activeTab === 'adUser' && (
            <div>
              <AddUserByAdmin />
            </div>
          )}
        </div>
    </div>
  );
};
