import React, { useEffect, useState } from 'react';
import styles from './DrawSummary.module.css';
import { Button, message, Modal } from 'antd';
import tickIcon from "../../assets/sidebar/tick.svg"; 
import editIcon from "../../assets/sidebar/edit.svg";
import { getDrawRequestBorrower, getHistoryDrawTracking, postCreateProject, postDrawapproval, putDrawRequest } from '../../services/api';
import { DrawRequestModal } from '../modal/drawRequestModal/DrawRequestModal';
import { DrawRequestSubmitModal } from '../modal/drawRequestSubmitModal/DrawRequestSubmitModal';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Loader } from '../loader/Loder';


export const DrawSummary = ({ loanId,setActiveTab ,isModalVisibleDetails, setIsModalVisibleDetails,loanDetailsId}) => {

  const dataSourceColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Uses", dataIndex: "uses", key: "uses" },
    { title: "Uses Type", dataIndex: "uses_type", key: "uses_type" },
    { title: "Draw Request", dataIndex: "draw_request", key: "draw_request" },
    { title: "Released Amount", dataIndex: "released_amount", key: "released_amount" },
    { title: "Budget Amount", dataIndex: "budget_amount", key: "budget_amount" },
    { title: "Funded Amount", dataIndex: "funded_amount", key: "funded_amount" },
    { title: "Balance Amount", dataIndex: "balance_amount", key: "balance_amount" },
    { title: "Draw Amount", dataIndex: "draw_amount", key: "draw_amount" },
    { title: "Requested Date", dataIndex: "requested_date", key: "requested_date" },
  ];
  const [columns, setColumns] = useState(dataSourceColumns);
  const [tableData, setTableData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editField, setEditField] = useState('');
  const [createDrawLoader, setCreateDrawLoader] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const[drawRequestData,setDrawRequestData]=useState([])
  const [isLoading, setIsLoading] = useState(false);

  const getHistoryDrawRequest = async () => {
    setIsLoading(true)
    try {
      const response = await getHistoryDrawTracking(loanId);
      setHistoryData(response.data); 
    } catch (err) {
      console.log(err);
    }finally{
      setIsLoading(false)
    }
  };

  useEffect(() => {
    getHistoryDrawRequest();
  }, [loanId]);
  // Function to create a project and fetch table data
  const createProject = async () => {
    setCreateDrawLoader(true);
    try {
      const response = await postCreateProject(loanId);
      setTableData(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setCreateDrawLoader(false);
    }
  };

  // Function to handle edit click
  const handleEditClick = (index, field, currentValue) => {
    setEditIndex(index);
    setEditField(field);
    setEditValue(currentValue); // Set the current value to edit
  };

  // Handle change in input for the edited value
  const handleInputChange = (e) => {
    setEditValue(e.target.value);
  };
  const handleKeyDown = (event, index, field) => {
  if (event.key === "Enter") {
    handleConfirmEdit(index, field); // Call confirm edit on Enter
  }
};

  // Confirm and update the edited value in the table
  const handleConfirmEdit = async (index, field) => {
    const updatedData = [...tableData];
    const currentRow = updatedData[index]; // Get the current row of data

    // Update the specific field value
    currentRow[field] = parseFloat(editValue);

    // Log the data you want (id, draw_amount, description, funded_amount)
    const logData = {
      id: currentRow.id,                       // ID of the row
      draw_amount: currentRow.draw_amount,     // Updated draw amount
      description: currentRow.uses,            // Assuming 'uses' is your description field
      funded_amount: currentRow.funded_amount, // Funded amount field
    };
    console.log(logData); // Log the data object

    try {
      const response = await putDrawRequest(logData);
      if (response.status === 200) {
        message.success("Data Updated");
      }
      
    } catch (error) {
      console.log(error);
    }

    // Update the state and reset the editing index
    setTableData(updatedData);
    setEditIndex(null);
    setEditField(null); // Reset the field being edited
    setEditValue('');   // Clear the input value
  };

  // Function to handle submit and log loanId and draw_request
  const handleSubmit = async () => {
    if (!loanId) {
      message.error("Loan ID is missing");
      return;
    }

    const drawRequests = tableData.map((row) => ({
      draw_request: row.draw_request,
    }));

    try {
      setSubmitLoader(true); // Show loader
      const response = await postDrawapproval(loanId, drawRequests);
      
      if (response.status === 200) {
        message.success("Submit Successful");
        getHistoryDrawRequest()
        setActiveTab("drawHistory")
      } else {
        message.error("Submission Failed");
      }
    } catch (error) {
      console.error(error);
      message.error("An error occurred");
    } finally {
      setSubmitLoader(false); // Hide loader
    }
  };

  const getStatusClass = (status) => {
    if (status === "Pending") return styles.pending;
    if (status === "Not Uploaded" || status === "Rejected") return styles.notUploaded;
    if (status === "In Review" || status === "Pending Lender") return styles.pending;
    if (status === "Approved" || status === "Approve" || status === "In Approval") return styles.approve;
    if (status === "Reject") return styles.notUploaded;
    return styles.uploaded;
  };

  const handleRowClick = async(item) => {
    setIsLoading(true)
    console.log(item,"rohit");
    try{
      const response = await getDrawRequestBorrower(loanId,item.draw_request)
      setDrawRequestData(response.data)
    }
    catch(err){
      console.log(err);
      
    }
    finally{
      setIsLoading(false)
    }
    setIsModalVisibleDetails(true); // Open modal when row is clicked
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
  
    // Get day, month, year, hours, minutes, and seconds
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    // Format the string as DD/MM/YYYY HH:MM:SS
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return; // dropped outside the list
    const newColumns = Array.from(columns);
    const [removed] = newColumns.splice(result.source.index, 1);
    newColumns.splice(result.destination.index, 0, removed);
    setColumns(newColumns);
  };

  const formatNumberWithCommas = (number) => {
    if (number == null) return ""; // Return an empty string if number is null or undefined
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
    {isLoading ? (
      <div className={styles.loaderDiv}>
         <Loader />
      </div>
     
    ) : (
    <div className={styles.main}>
      <div className={styles.createDraw}>
        <Button  className={styles.btn} onClick={createProject} loading={createDrawLoader}>Create New Draw Request</Button>

      </div>

      {tableData.length > 0 && (
        <div className={styles.tableDiv}>
          <div className={styles.tableContainer}>
          <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable" direction="horizontal">
                {(provided) => (
                <table className={styles.table} ref={provided.innerRef} {...provided.droppableProps}>
                  <thead className={styles.stickyHeader}>
                <tr className={styles.headRow}>
                  {columns.map((column, index) => (
                     <Draggable key={column.key} draggableId={column.key} index={index}>
                     {(provided) => (
                       <th 
                         ref={provided.innerRef}
                         {...provided.draggableProps}
                         {...provided.dragHandleProps}
                         className={styles.th}
                       >
                      {column.title}
                      {['draw_amount'].includes(column.key) && (
                        <img
                          src={editIcon}
                          alt="Edit Icon"
                          style={{ marginLeft: '8px', width: '16px', height: '16px' }}
                        />
                      )}
                    </th>
                        )}
                      </Draggable>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((data, index) => (
                  <tr key={index}>
                  {columns.map((column) => (
                    <td className={styles.td} key={column.key}>
                      {/* Only allow inline edit for the 'draw_amount' column */}
                      {column.key === 'draw_amount' && editIndex === index && editField === column.dataIndex ? (
                        <div className={styles.inlineEdit}>
                          <input
                            style={{
                              border: "none",
                              padding: "12px",
                              outline: "none",
                              width: "100%",
                              backgroundColor: "#EEF6FC",
                              color: "black",
                            }}
                            value={editValue}
                            onChange={handleInputChange}
                            onKeyDown={(event) => handleKeyDown(event, index, column.dataIndex)} 
                            autoFocus
                          />
                          <img
                            src={tickIcon}
                            alt="Confirm Edit"
                            onClick={() => handleConfirmEdit(index, column.dataIndex)}
                            style={{ cursor: 'pointer', marginLeft: '5px' }}
                          />
                        </div>
                      ) : (
                        <span onClick={() => column.key === 'draw_amount' && handleEditClick(index, column.dataIndex, data[column.dataIndex])}>
                          {column.dataIndex === "requested_date"
                            ? formatDateTime(data[column.dataIndex])
                            : column.key === "draw_amount"
                            ? formatNumberWithCommas(data[column.dataIndex])
                            : formatNumberWithCommas(data[column.dataIndex])}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
                
                ))}
              </tbody>
            </table>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      )}


      {/* Submit Button */}
      {tableData.length > 0 && (
        <div className={styles.createDraw} >
          <Button 
            className={styles.btn}
            type="primary"
            onClick={handleSubmit}
            loading={submitLoader}
          >
            Submit
          </Button>
        </div>
      )}
  <div className={styles.inReview}>
    <span >Pending Draw Request </span>
  </div>
  <div className={styles.tableDiv}>
  <div className={styles.tableContainer1}>
    <table className={styles.table}>
      <thead className={styles.stickyHeader}>
        <tr>
          <th className={styles.th}>ID</th>
          <th className={styles.th}>Draw Request</th>
          <th className={styles.th}>Total Released Amount</th>
          <th className={styles.th}>Total Budget Amount</th>
          <th className={styles.th}>Total Funded Amount</th>
          <th className={styles.th}>Draw Status</th>
          <th className={styles.th}>Draw Date</th>
          <th className={styles.th}>Comments</th>
          <th className={styles.th}>Disbursement Date</th>
          <th className={styles.th}>Total Balance Amount</th>
          <th className={styles.th}>Total Draw Amount</th>
        </tr>
      </thead>
      <tbody>
        {historyData.filter((item) => item.draw_status === 'Pending').length > 0 ? (
          historyData
            .filter((item) => item.draw_status === 'Pending')
            .map((item) => (
              <tr
                  key={item.id}
                  className={styles.row}
                  onClick={() => handleRowClick(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <td className={styles.td}>{item.id}</td>
                  <td className={styles.td}>{item.draw_request}</td>
                  <td className={styles.td}>{formatNumberWithCommas(item.total_released_amount)}</td>
                  <td className={styles.td}>{formatNumberWithCommas(item.total_budget_amount)}</td>
                  <td className={styles.td}>{formatNumberWithCommas(item.total_funded_amount)}</td>
                  <td className={`${styles.td} ${getStatusClass(item.draw_status)}`}>
                    {item.draw_status}
                  </td>
                  <td className={styles.td}>{item.draw_date}</td>
                  <td className={styles.td}>{item.comments}</td>
                  <td className={styles.td}>{item.disbursement_date}</td>
                  <td className={styles.td}>{formatNumberWithCommas(item.total_balance_amount)}</td>
                  <td className={styles.td}>{formatNumberWithCommas(item.total_draw_amount)}</td>
                </tr>
                
                ))
            ) : (
              <tr>
                <td colSpan="11" className={styles.noDataMessage}>
                  No pending request
                </td>
           </tr>
        )}
      </tbody>
    </table>
  </div>

    <DrawRequestSubmitModal drawRequestData={drawRequestData} loanId={loanId} isModalVisibleDetails={isModalVisibleDetails} setIsModalVisibleDetails={setIsModalVisibleDetails} getHistoryDrawRequest={getHistoryDrawRequest}
    setDrawRequestData={setDrawRequestData}/>
    {/* <DrawRequestModal drawRequestData={drawRequestData} loanId={loanId} isModalVisibleDetails={isModalVisibleDetails} setIsModalVisibleDetails={setIsModalVisibleDetails} getHistoryDrawRequest={getHistoryDrawRequest}/> */}
       
  </div>
  {/* <Modal
  title="Draw Request Details"
  open={isModalVisible}
  onOk={handleModalClose}
  onCancel={handleModalClose}
>
    {drawRequestData.length > 0 && (
            <div className={styles.tableDiv}>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead className={styles.stickyHeader}>
                    <tr className={styles.headRow}>
                      {dataSourceColumns.map((column, index) => (
                        <th className={styles.th} key={index}>
                          {column.title}
                          
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {drawRequestData.map((data, index) => (
                      <tr key={index}>
                        {dataSourceColumns.map((column) => (
                          <td className={styles.td} key={column.key}>
                            {editIndex === index && editField === column.dataIndex ? (
                              <div className={styles.inlineEdit}>
                              </div>
                            ) : (
                              <span onClick={() => handleEditClick(index, column.dataIndex, data[column.dataIndex])}>
                                {data[column.dataIndex]}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
    </Modal> */}
    </div>
    )}
    </>
  );
};
