import React, { useState, useEffect } from 'react';
import styles from './BudgetingUseCase.module.css';
import searchIcon from "../../assets/sidebar/SearchIcon.svg";
import tickIcon from "../../assets/sidebar/tick.svg";
import editIcon from "../../assets/sidebar/edit.svg"
import { Button, message, Select } from 'antd';
import { AddRowTableModal } from '../modal/addRowTableModal/AddRowTableModal';
import { DeleteRowModal } from '../modal/deleteRowModal/DeleteRowModal';
import { budgetMaster, exportBudget, save_budgetMaster } from '../../services/api';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { Loader } from '../loader/Loder';

export const BudgetingUseCase = ({loanId,usesType}) => {

    
const dataSourceColumns = [
    { title: "Uses", dataIndex: "uses", key: "uses" },
    { title: "ID", dataIndex: "id", key: "id" },
    // { title: "Loan ID", dataIndex: "loan_id", key: "loan_id" },
    { title: "Original Loan Budget", dataIndex: "original_loan_budget", key: "original_loan_budget" },
    { title: "Loan Budget", dataIndex: "loan_budget", key: "loan_budget" },
    { title: "Adjustments", dataIndex: "adjustments", key: "adjustments" },
    { title: "Equity Budget", dataIndex: "equity_budget", key: "equity_budget" },
    { title: "Revised Budget", dataIndex: "revised_budget", key: "revised_budget" },
    { title: "Total Funded Percentage", dataIndex: "total_funded_percentage", key: "total_funded_percentage" },
    { title: " Remaining To Fund", dataIndex: "remaining_to_fund", key: "remaining_to_fund" },
    { title: "Action", dataIndex: "Action", key: "Action" },
   
  ];
  
  const [dataSource, setDataSource] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editField, setEditField] = useState('');
  const [editValues, setEditValues] = useState({});
  const[isAddRowModal,setIsAddRowModal]=useState(false)
  const[isDeleteModal,setIsDeleteModal]=useState(false)
  const [selectedRowId, setSelectedRowId] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const BudgetLoadTable = async () => {
    setIsLoading(true)
    try {
      const res = await budgetMaster(loanId,usesType);
      setDataSource(res.data);
    } catch (err) {
      console.log(err);
    }finally{
      setIsLoading(false)
    }
  };

  useEffect(() => {
    BudgetLoadTable();
  },  [loanId, usesType]);

  const handleInputChange = (index, field, value) => {
    setEditValues(prev => ({
      ...prev,
      [`${index}-${field}`]: value,
    }));
  };

  const handleEditClick = (index, field, currentValue) => {
    setEditIndex(index);
    setEditField(field);
    setEditValues(prev => ({
      ...prev,
      [`${index}-${field}`]: currentValue,
    }));
  };

  const handleKeyDown = (event, index, field) => {
    if (event.key === "Enter") {
      handleConfirmEdit(index, field); // Pass index and field to confirm edit
    }
  };
  

  const handleConfirmEdit = async (index, field) => {
    const updatedValue = editValues[`${index}-${field}`];
  
    try {
      await saveValue(dataSource[index].id, { [field]: updatedValue });
      setDataSource(prev => 
        prev.map((item, i) => 
          i === index ? { ...item, [field]: updatedValue } : item // Marked change
        )
      );
      setEditIndex(null);
      setEditField('');
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  


  const saveValue = async (id, data) => {
    try {
      const res =await save_budgetMaster(id, data);
      console.log(res,"resbudget");
      if(res.status===200){
        message.success("Data Updated")
        BudgetLoadTable()
      }
      console.log("Data saved successfully");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const addRow = async()=>{
    setIsAddRowModal(true)
    // const res = await addRowPost()
    // console.log(res);
    
  }


  const openDeleteModal = (id)=>{
    setSelectedRowId(id)
    setIsDeleteModal(true)
  }

  const downloadFile = (response, fileName) => {
    // Define the MIME type for Excel
    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url); // Clean up the URL
    document.body.removeChild(a);
};

  
  const handleExport = async (value) => {
    const fileMap = {
      pdf: 'Budget.pdf',
      excel: 'Budget.xlsx',
      csv: 'Budget.csv',
    };
  
    if (fileMap[value]) {
      const response = await exportBudget(value, loanId);
      if (response.status === 200) {
        message.success(`${fileMap[value].split('.').pop().toUpperCase()} File Downloaded`);
        downloadFile(response.data, fileMap[value]);
      }
    }
  };

  // Function to format number with commas
  const formatNumberWithCommas = (number) => {
    if (number == null) return ""; // Return an empty string if number is null or undefined
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  
  return (  <>
    {isLoading ? (
      <div className={styles.loaderDiv}>
         <Loader />
      </div>
     
    ) : (
    <div style={{ padding: "1rem" }}>
      <div className={styles.AddBtnDiv}>
        <Button className={styles.addBtn} onClick={addRow}>Add row</Button>
        <Select
          placeholder="Export Options"
          onChange={handleExport}
          options={[
            { value: 'pdf', label: 'Export to PDF' },
            { value: 'excel', label: 'Export to Excel' },
            { value:'csv', label:'Export to CSV'}
          ]}
        />
      </div>
      <AddRowTableModal setIsAddRowModal={setIsAddRowModal} isAddRowModal={isAddRowModal} loanId={loanId} usesType={usesType} BudgetLoadTable={BudgetLoadTable}/>
      <div className={styles.tableDiv}>
        <div className={styles.tableContainer} id="budgeting-table">
          <table className={styles.table}>
            <thead className={styles.stickyHeader}>
              <tr className={styles.headRow}>
                {dataSourceColumns.map((column, index) => (
                  <th className={styles.th} key={index}>{column.title}
                  {['original_loan_budget', 'adjustments', 'equity_budget'].includes(column.key) && (
                      <img
                        src={editIcon}
                        alt="Edit Icon"
                        style={{ marginLeft: '8px', width: '16px', height: '16px' }}
                      />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataSource.map((data, index) => (
                <tr key={index}>
                  <td className={styles.td}>{data.uses}</td>
                  <td className={styles.td}>{data.id}</td>
                  {/* <td className={styles.td}>{data.loan_id}</td> */}
                  <td className={styles.td}>
                    {editIndex === index && editField === 'original_loan_budget' ? (
                      <div className={styles.inlineEdit}>
                        <input
                          style={{ border: "none", padding: "12px", outline: "none", width: "100%", backgroundColor: "#EEF6FC", color:"black" }}
                          value={editValues[`${index}-original_loan_budget`]}
                          onChange={e => handleInputChange(index, 'original_loan_budget', e.target.value)}
                          autoFocus
                          onKeyDown={(e) => handleKeyDown(e, index, 'original_loan_budget')}
                        />
                        <img 
                          src={tickIcon} 
                          alt="Confirm Edit" 
                          onClick={() => handleConfirmEdit(index, 'original_loan_budget')} 
                          style={{ cursor: 'pointer', marginLeft: '5px' }}
                        />
                      </div>
                    ) : (
                      <span onClick={() => handleEditClick(index, 'original_loan_budget', data.original_loan_budget)}>
                      {formatNumberWithCommas(data.original_loan_budget)}
                    </span>
                    
                    )}
                  </td>
                  <td className={styles.td}>
                    {editField === 'loan_budget' ? (
                      <span onClick={() => handleEditClick(index, 'loan_budget', data.loan_budget)}>
                        {formatNumberWithCommas(data.loan_budget)}
                      </span>
                    ) : (
                      formatNumberWithCommas(data.loan_budget)
                    )}
                  </td>

                  <td className={styles.td}>
                    {editIndex === index && editField === 'adjustments' ? (
                      <div className={styles.inlineEdit}>
                        <input
                          style={{ border: "none", padding: "12px", outline: "none", width: "100%", backgroundColor: "#EEF6FC", color:"black" }}
                          value={editValues[`${index}-adjustments`]}
                          onChange={e => handleInputChange(index, 'adjustments', e.target.value)}
                          autoFocus
                          onKeyDown={(e) => handleKeyDown(e, index, 'original_loan_budget')}
                        />
                        <img 
                          src={tickIcon} 
                          alt="Confirm Edit" 
                          onClick={() => handleConfirmEdit(index, 'adjustments')} 
                          style={{ cursor: 'pointer', marginLeft: '5px' }}
                        />
                      </div>
                    ) : (
                      <span onClick={() => handleEditClick(index, 'adjustments', data.adjustments)}>
                         {formatNumberWithCommas(data.adjustments)}
                      </span>
                    )}
                  </td>
                  <td className={styles.td}>
                    {editIndex === index && editField === 'equity_budget' ? (
                      <div className={styles.inlineEdit}>
                        <input
                          style={{ border: "none", padding: "12px", outline: "none", width: "100%", backgroundColor: "#EEF6FC" , color:"black"}}
                          value={editValues[`${index}-equity_budget`]}
                          onChange={e => handleInputChange(index, 'equity_budget', e.target.value)}
                          autoFocus
                          onKeyDown={(e) => handleKeyDown(e, index, 'original_loan_budget')}
                        />
                        <img 
                          src={tickIcon} 
                          alt="Confirm Edit" 
                          onClick={() => handleConfirmEdit(index, 'equity_budget')} 
                          style={{ cursor: 'pointer', marginLeft: '5px' }}
                        />
                      </div>
                    ) : (
                      <span onClick={() => handleEditClick(index, 'equity_budget', data.equity_budget)}>
                        {formatNumberWithCommas(data.equity_budget)}
                      </span>
                    )}
                  </td>

                  <td className={styles.td}>
                    {editIndex === index && editField === 'revised_budget' ? (
                      <span onClick={() => handleEditClick(index, 'revised_budget', data.equity_budget)}>
                        {formatNumberWithCommas(data.revised_budget)}
                      </span>
                    ) : (
                      formatNumberWithCommas(data.revised_budget)
                    )}
                  </td>

                  <td className={styles.td}>
                    {editIndex === index && editField === 'total_funded_percentage' ? (
                     <span onClick={() => handleEditClick(index, 'total_funded_percentage', data.total_funded_percentage)}>
                     {formatNumberWithCommas(data?.total_funded_percentage)}
                   </span>
                    ) : (
                      formatNumberWithCommas(data?.total_funded_percentage)
                    )}
                  </td>

                  <td className={styles.td}>
                    {editIndex === index && editField === 'remaining_to_fund' ? (
                      <span onClick={() => handleEditClick(index, 'remaining_to_fund', data.remaining_to_fund)}>
                        {formatNumberWithCommas(data.remaining_to_fund)}
                      </span>
                    ) : (
                      formatNumberWithCommas(data.remaining_to_fund)
                    )}
                  </td>
                  <td className={styles.td}>
                    <button className={styles.deleteBtn} onClick={()=>openDeleteModal(data.id)}>Delete</button>
                       
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <DeleteRowModal isDeleteModal={isDeleteModal} setIsDeleteModal={setIsDeleteModal} selectedRowId={selectedRowId} BudgetLoadTable={BudgetLoadTable}/>
      </div>
    </div>
     )}
    </>
  )
}
