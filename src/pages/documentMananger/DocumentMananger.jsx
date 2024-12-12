import React, { useState } from 'react'
import styles from "./DocumentMananger.module.css"
import { FileManagementInterface } from '../../components/fileManagementInterface/FileManagementInterface';
import { DocumentViewer } from '../../components/documentViewer/DocumentViewer';

export const DocumentMananger = ({isSummaryModal,setIsSummaryModal}) => {
    const [activeTab, setActiveTab] = useState('FileManagementInterface');
      
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
  return (
    <div  className={styles.main}>
         <div className={styles.tabs}>
          <div>
            <button style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}
              onClick={() => handleTabClick('FileManagementInterface')}
              className={`${styles.tabButton} ${activeTab === 'FileManagementInterface' ? styles.activeTab : styles.inactiveTab}`}
            >
              <span style={{ fontSize: "15px", color: "white" }}>File Management Interface</span>
            </button>
            <button  style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
              onClick={() => handleTabClick('docViewer')}
              className={`${styles.tabButton} ${activeTab === 'docViewer' ? styles.activeTab : styles.inactiveTab}`}
            >
              <span style={{ fontSize: "15px", color: "white" }}>Document Viewer</span>
            </button>
          </div>
            

        </div>
        <div style={{ paddingTop: "0rem" }}>
          {activeTab === 'FileManagementInterface' && (
            <div>
              <FileManagementInterface />
            </div>
          )}
        </div>
        <div style={{ paddingTop: "0rem" }}>
          {activeTab === 'docViewer' && (
            <div>
              <DocumentViewer  isSummaryModal={isSummaryModal}
               setIsSummaryModal={setIsSummaryModal}/>
            </div>
          )}
        </div>
    </div>
  )
}
