import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styleLoan from './LoadDetailsPage.module.css';
import { Overview } from '../../components/overview/Overview';
import { DrawRequestComponenet } from '../../components/drawRequestComponenet/DrawRequestComponenet';
import { Budgeting } from '../../components/budgeting/Budgeting';
import {DocUpload} from "../../components/docUpload/DocUpload"
import { GraphComponenet } from '../../components/graphComponenet/GraphComponenet';
import { LoanSummary } from '../../components/loanSummary/LoanSummary';
import { DocumentChecklist } from '../documentChecklist/DocumentChecklist';
import { Popover, Switch } from 'antd';

export const LoadDetailsPage = ({selectedProjectName,activeTab, setActiveTab,metrics,isSummaryModal,setIsSummaryModal}) => {
    
 
    const { loanId } = useParams();
  
    const location = useLocation();
    const loanDetailsId = location.state?.loan; 
   
  
    const handleTabClick = (tab) => {
      setActiveTab(tab);
    };

    const projectNameStore = localStorage.getItem('projectNameStore')
    const dark = JSON.parse(localStorage.getItem('darkTheme'));
    console.log(metrics,"mememe");
    
  // console.log(dark,"darkinload");
  // const onChange = (checked) => {
  //   setDark(checked)
  // };
    return (
      <div  className={styleLoan.main}
      style={{
        backgroundColor: dark ? '#084c61' : 'white',         // Change text color based on the theme
      }}
      >
        <div className={styleLoan.tabs}>
          <div>
            <button style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' ,
             }}
              onClick={() => handleTabClick('overview')}
              className={`${styleLoan.tabButton} ${activeTab === 'overview' ? styleLoan.activeTab : styleLoan.inactiveTab}`}
            >
              <span style={{ fontSize: "15px", color: "white" }}>Overview</span>
            </button>
            {metrics === false ? (
              <Popover content="For this feature, please upgrade your plan." trigger="hover">
                <button
                  className={`${styleLoan.tabButton} ${activeTab === 'graph' ? styleLoan.activeTab : styleLoan.inactiveTab}`}
                >
                  <span style={{ fontSize: "15px", color: "white" }}>Metrics</span>
                </button>
              </Popover>
            ) : (
              <button
                onClick={() => handleTabClick('graph')}
                className={`${styleLoan.tabButton} ${activeTab === 'graph' ? styleLoan.activeTab : styleLoan.inactiveTab}`}
              >
                <span style={{ fontSize: "15px", color: "white" }}>Metrics</span>
              </button>
            )}


          

            
            <button
              onClick={() => handleTabClick('budgeting')}
              className={`${styleLoan.tabButton} ${activeTab === 'budgeting' ? styleLoan.activeTab : styleLoan.inactiveTab}`}
            > 
              <span style={{ fontSize: "15px", color: "white" }}>Budgeting</span>
            </button>
            {/* {role=== "borrower" && ( */}
              <button
              onClick={() => handleTabClick('drawSummary')}
              className={`${styleLoan.tabButton} ${activeTab === 'drawSummary' ? styleLoan.activeTab : styleLoan.inactiveTab}`}
            >
              <span style={{ fontSize: "15px", color: "white" }}>Draw Request</span>
            </button>
            {/* )} */}
            
  
            <button
              onClick={() => handleTabClick('docUpload')}
              className={`${styleLoan.tabButton} ${activeTab === 'docUpload' ? styleLoan.activeTab : styleLoan.inactiveTab}`}
            >
              <span style={{ fontSize: "15px", color: "white" }}>Document Checklist</span>
            </button>
  
          
  
            <button style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
              onClick={() => handleTabClick('Summary')}
              className={`${styleLoan.tabButton} ${activeTab === 'Summary' ? styleLoan.activeTab : styleLoan.inactiveTab}`}
            >
              <span style={{ fontSize: "15px", color: "white" }}>Loan Summary</span>
            </button>
          </div>
          {activeTab !== "overview" &&(
            <div className={styleLoan.cardMainDiv}>
              <div className={styleLoan.card}> 
                  <span className={styleLoan.headingProjectName}>Project Name:</span>
                  <span className={styleLoan.headingProjectName}>{projectNameStore}</span>
              </div>
              {/* <div className={styleLoan.toggleDiv}>
                <Switch 
                defaultChecked={dark}
                onChange={onChange} />

                </div> */}
                
          </div>
          )
            
          }
          
        </div>
  
        <div style={{ paddingTop: "0rem" }}>
          {activeTab === 'overview' && (
            <div>
              <Overview loanDetailsId={loanDetailsId} loanId={loanId} isSummaryModal={isSummaryModal} setIsSummaryModal={setIsSummaryModal}/>
            </div>
          )}
        </div>
        <div style={{ paddingTop: "0rem" }}>
          {activeTab === 'drawSummary' &&(
            <div>
              <DrawRequestComponenet loanDetailsId={loanDetailsId} loanId={loanId} />
            </div>
          )}
        </div>
        <div style={{ paddingTop: "0rem" }}>
          {activeTab === 'budgeting' && (
            <div>
              <Budgeting loanDetailsId={loanDetailsId} loanId={loanId} />
            </div>
          )}
        </div>
        <div style={{ paddigTop: "0rem" }}>
          {activeTab === 'docUpload' && (
            <div>
              <DocUpload loanId={loanId} />
            </div>
          )}
        </div>
        <div style={{ paddingTop: "0rem" }}>
          {activeTab === 'graph' && (
            <div>
              <GraphComponenet  loanId={loanId} />
            </div>
          )}
        </div>
        <div style={{ paddingTop: "0rem" }}>
          {activeTab === 'Summary' && (
            <div>
              <LoanSummary  loanId={loanId} />
            </div>
          )}
        </div>
  
      </div>
    );
  };
  
  