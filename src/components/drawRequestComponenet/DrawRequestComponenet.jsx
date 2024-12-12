import React, { useState } from 'react'
import styleBudget from "./DrawRequestComponenet.module.css"
import { DrawHistory } from '../drawHistory/DrawHistory';
import { DrawSummary } from '../drawSummary/DrawSummary';
export const DrawRequestComponenet = ({loanId ,loanDetailsId}) => {
    const [activeTab, setActiveTab] = useState('drawHistory');
    const [isModalVisibleDetails, setIsModalVisibleDetails] = useState(false);
    const role = localStorage.getItem('RoleType');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
    <div className={styleBudget.tabs}>
      { role ==="borrower" && (
          <button
          onClick={() => handleTabClick('drawRequest')}
          className={`${styleBudget.tabButtonOne} ${activeTab === 'drawRequest' ? styleBudget.activeTab : styleBudget.inactiveTab}`}
        >
          <span style={{ fontSize: "15px", color:"white" }}>Create Draw Request</span>
        </button>
      )

      }
      
      <button
        onClick={() => handleTabClick('drawHistory')}
        className={`${styleBudget.tabButtonTow} ${activeTab === 'drawHistory' ? styleBudget.activeTab : styleBudget.inactiveTab}`}
      >
        <span style={{ fontSize: "15px",  color:"white" }}>Draw History</span>
      </button>
      
    </div>

    <div style={{ paddingTop: "0rem" }}>
      {activeTab === 'drawRequest' && role === "borrower" &&(
        <div>
          <DrawSummary
           isModalVisibleDetails={isModalVisibleDetails} 
           setIsModalVisibleDetails={setIsModalVisibleDetails} 
           setActiveTab={setActiveTab} 
           loanId={loanId}
           loanDetailsId={loanDetailsId} /> 
        </div>
      )}
    </div>
    <div style={{ paddingTop: "0rem" }}>
      {activeTab === 'drawHistory' && (
        <div>
            <DrawHistory isModalVisibleDetails={isModalVisibleDetails} setIsModalVisibleDetails={setIsModalVisibleDetails} loanId={loanId} />
          {/* <DrawSummary isUser={isUser} loanId={loanId} />  */}
        </div>
      )}
    </div>
  </div>
  )
}
