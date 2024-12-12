import React, { useState } from 'react'
import styles from "./EnhancementByAdmin.module.css"
import { EditUsesByAdmin } from '../../components/editUsesByAdmin/EditUsesByAdmin';
import { EditSubscriptionPlan } from '../../components/editSubscriptionPlan/EditSubscriptionPlan';

export const EnhancementByAdmin = () => {
  const [activeTab, setActiveTab] = useState('editUses');
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  // Handle input changes
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  
  const dark = JSON.parse(localStorage.getItem('darkTheme'));
  return (
    <div  className={styles.main}
    style={{
      backgroundColor: dark ? '#084c61' : 'white',         // Change text color based on the theme
    }}
    >
         <div className={styles.tabs}>
          <div>
            <button style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}
              onClick={() => handleTabClick('editUses')}
              className={`${styles.tabButton} ${activeTab === 'editUses' ? styles.activeTab : styles.inactiveTab}`}
            >
              <span style={{ fontSize: "15px", color: "white" }}>Uses Modification</span>
            </button>
            <button  style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
              onClick={() => handleTabClick('subPlan')}
              className={`${styles.tabButton} ${activeTab === 'subPlan' ? styles.activeTab : styles.inactiveTab}`}
            >
              <span style={{ fontSize: "15px", color: "white" }}>Modification Subscription Plan</span>
            </button>
          </div>
            

        </div>
        <div style={{ paddingTop: "0rem" }}>
          {activeTab === 'editUses' && (
            <div>
              <EditUsesByAdmin data={data} setData={setData} sortedData={sortedData} setSortedData={setSortedData} />
            </div>
          )}
        </div>
        <div style={{ paddingTop: "0rem" }}>
          {activeTab === 'subPlan' && (
            <div>
              <EditSubscriptionPlan />
            </div>
          )}
        </div>
    </div>
  )
}
