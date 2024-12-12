import { Button, message, Modal, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from "./SummaryModal.module.css"
import { applicationStatus, postSubmitSummary, putLoanApproval } from '../../../services/api';

const { Option } = Select; // Destructure Option from Select
export const SummaryModal = ({isSummaryModal,setIsSummaryModal,summary,loanId,loanDetailsId}) => {
    
    const [approvalOptions, setApprovalOptions] = useState([]);
    const [selectedApproval, setSelectedApproval] = useState('');
    const[loader,setLoader]=useState(false)
  
    const usesTypeMapping = {
      hard_cost: "Hard Cost",
      acquisition_cost: "Acquisition Cost",
      soft_cost: "Soft Cost"
    };
  
   
  
    const getApprovalList = async () => {
      try {
        const response = await applicationStatus("loan-approval");
        console.log(response.data);
        setApprovalOptions(response.data); // Assuming response.data contains the options like ['Approve', 'Reject']
      } catch (err) {
        console.log(err);
      }
    };
  
    useEffect(() => {
      getApprovalList();
    }, [loanId]);
  
    const summaryColumns = [
      { title: 'Uses Type', key: 'uses_type' },
      { title: 'Total Original Loan Budget', key: 'total_original_loan_budget' },
      { title: 'Total Adjustments', key: 'total_adjustments' },
      { title: 'Total Revised Budget', key: 'total_revised_budget' },
      { title: 'Total Equity Budget', key: 'total_equity_budget' },
      { title: 'Total Loan Budget', key: 'total_loan_budget' },
      { title: "Total Funded Percentage", dataIndex: "total_funded_percentage", key: "total_funded_percentage" },
      { title: "Total Remaining To Fund", dataIndex: "total_remaining_to_fund", key: "total_remaining_to_fund" },

      
    ];
  
    const handleSubmitSummary = async () => {
      setLoader(true)
      try {
        const response = await postSubmitSummary(loanId);
        message.success("Submitted");
        setIsSummaryModal(false)
        console.log(response);

      } catch (err) {
        console.log(err);
        message.error("loan can only be submitted when status is Pending or Rejected");
        setIsSummaryModal(false)
      }finally{
        setLoader(false)
      }
    };
  
    const UserRole = localStorage.getItem('RoleType');
    console.log(UserRole, "RoleType");
  
    const handleApprovalChange = async(value) => {
      setSelectedApproval(value);
      console.log(value); 
      try{
        const response = await putLoanApproval(value,loanId)
        console.log(response);
        message.success("Updated Status")
        setIsSummaryModal(false)
        
      }
      catch(err){
        console.log(err);
        message.error("The loan status is already being processed")
        setIsSummaryModal(false)
        
      }
      // Log the selected value (Approve or Reject)
    };

    const handleCancel =() =>{
        setIsSummaryModal(false)
    }
    const formatNumberWithCommas = (number) => {
      if (number == null) return ""; // Return an empty string if number is null or undefined
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
  return (
    <Modal
    title="Summary"
    open={isSummaryModal}
    onCancel={handleCancel}
    footer={
      null 
    }
    width={1000}
    centered
    >
       <div className={styles.main}>
      <div className={styles.tableDiv}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.stickyHeader}>
              <tr className={styles.headRow}>
                {summaryColumns.map((column, index) => (
                  <th className={styles.th} key={index}>{column.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summary?.map((item, rowIndex) => (
                <tr key={rowIndex}>
                {summaryColumns.map((column, colIndex) => (
                  <td className={styles.td} key={colIndex}>
                    {column.key === "uses_type"
                      ? usesTypeMapping[item[column.key]] || item[column.key]
                      : ['loan_budget', 'revised_budget', 'remaining_to_fund'].includes(column.key)
                        ? formatNumberWithCommas(item[column.key])
                        : formatNumberWithCommas(item[column.key])}
                  </td>
                ))}
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render button if user is borrower */}
      {UserRole === "borrower" && loanDetailsId?.status==="Pending"&&(
        <div className={styles.ButtonContainer}>
          <Button loading={loader}
           onClick={handleSubmitSummary} className={styles.btn}>Submit</Button>
        </div>
      )}

      {/* Render dropdown if user is not borrower */}
      {UserRole !== "borrower" && (
        <div className={styles.ButtonContainer}>
          <p className={styles.pTag}> Update Status:</p>
          <Select
            value={selectedApproval}
            onChange={handleApprovalChange}
            placeholder="Select Action"
            className={styles.dropdown}
            style={{ width: 200 }}
          >
            {approvalOptions.map((option, index) => (
              <Option key={index} value={option}>{option}</Option>
            ))}
          </Select>
        </div>
      )}
    </div>
    </Modal>
  )
}
