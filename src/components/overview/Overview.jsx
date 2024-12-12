import React, { useEffect, useState } from 'react'
import stylesOverview from "./Overview.module.css";
import { SummaryModal } from '../modal/summaryModal/SummaryModal';
import { budget_summary, getOverviewData } from '../../services/api';

export const Overview = ({loanDetailsId,loanId,isSummaryModal,setIsSummaryModal}) => {
  
  useEffect(()=>{
    console.log(loanDetailsId);
    
  },[loanDetailsId])


  const [summary, setSummary] = useState([]);
  const[overviewData,setOverviewData] = useState([])
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const getStatusClass = (status) => {
    if (status === "Pending") return stylesOverview.pending;
    if (status === "Not Uploaded" || status === "Rejected") return stylesOverview.notUploaded;
    if (status === "In Review" || status === "Pending Lender") return stylesOverview.pending;
    if (status === "Approved" || status === "In Approval") return stylesOverview.approve;
    if (status === "Reject") return stylesOverview.notUploaded;
    return stylesOverview.uploaded;
};
  const handleSummary =async()=>{
    setIsSummaryModal(true)
    const response = await budget_summary(loanId)
    setSummary(response.data)
    
  }

  const dark = JSON.parse(localStorage.getItem('darkTheme'));
  console.log(dark,"darkover");
  
  useEffect(()=>{
    const handleOverviewData =async() =>{
      try{
        const response = await getOverviewData(loanId)
        // console.log(response,"overviewDatra");
        setOverviewData(response.data)
      }
      catch(err){
        console.log(err);
        
      }
    }
    handleOverviewData()
  },[])
const formatNumberWithCommas = (number) => {
  if (number == null) return ""; // Return an empty string if number is null or undefined
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
  return (
<div className={stylesOverview.main}
style={{
  backgroundColor: dark ? '#084c61' : 'white',         // Change text color based on the theme
}}
>
      <div className={stylesOverview.detailsDiv}
      style={{
        backgroundColor: dark ? '#084c61' : 'white',         // Change text color based on the theme
      }}>
        <div className={stylesOverview.cardsDetails}>
          <div className={stylesOverview.nameDiv}>
            Project Name: {overviewData?.projectname}
          </div>
          <div className={stylesOverview.nameDiv}>
            Loan Amount: {formatNumberWithCommas(overviewData?.amount)}
          </div>
          <div className={stylesOverview.nameDiv} onClick={handleSummary} style={{cursor:"pointer"}}>
            View Summary
          </div>
        </div>
            <div className={stylesOverview.restDetails}>
          <div className={stylesOverview.details}>
            <h2 className={stylesOverview.heading}>Loan Type:</h2>
            <span className={stylesOverview.headingText}>{overviewData?.loantype}</span>
          </div>
          <div className={stylesOverview.details}>
            <h2 className={stylesOverview.heading}>Start Date:</h2>
            <span className={stylesOverview.headingText}>{formatDate(overviewData?.start_date)}</span>
          </div>
         
          {/* <div className={stylesOverview.details}>
            <h2 className={stylesOverview.heading}>Interest Rate:</h2>
            <span className={stylesOverview.headingText}>{loanDetailsId.interestrate}</span>
          </div> */}
          <div className={stylesOverview.details}>
            <h2 className={stylesOverview.heading}>Duration (In Months):</h2>
            <span className={stylesOverview.headingText}>{overviewData?.duration}</span>
          </div>
          <div className={stylesOverview.details}>
            <h2 className={stylesOverview.heading}>Loan Description:</h2>
            <span className={stylesOverview.headingText}>{overviewData?.loandescription}</span>
          </div>
          <div className={stylesOverview.details}>
            <h2 className={stylesOverview.heading}>Status:</h2>
            <span className={`${stylesOverview.headingTextStatus} ${getStatusClass(overviewData?.status)}`}>
              {overviewData?.status}
            </span>
          </div>
          <div className={stylesOverview.details}>
            <h2 className={stylesOverview.heading}>Borrower Name:</h2>
            <span className={stylesOverview.headingText}>{overviewData?.borrower_name}</span>
          </div>

          <div className={stylesOverview.details}>
            <h2 className={stylesOverview.heading}>Lender Name:</h2>
            <span className={stylesOverview.headingText}>{overviewData?.lender_name}</span>
          </div>

          <div className={stylesOverview.details}>
            <h2 className={stylesOverview.heading}>Servicer Name:</h2>
          <span className={stylesOverview.headingText}>
            {overviewData?.inspector_name }
          </span>

          </div>
        </div>
      </div>
      <SummaryModal isSummaryModal ={isSummaryModal} setIsSummaryModal={setIsSummaryModal} summary={summary} loanId={loanId} loanDetailsId={loanDetailsId}/>
    </div>
  )
}
