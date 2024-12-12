import { Button, message, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { getHistoryDrawTracking, postDrawapproval, putDrawRequest } from '../../../services/api';
import styles from "./drawRequestSubmitModal.module.css"

import tickIcon from "../../../assets/sidebar/tick.svg"; 
import editIcon from "../../../assets/sidebar/edit.svg";

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';



export const DrawRequestSubmitModal =({loanId,isModalVisibleDetails,setIsModalVisibleDetails,drawRequestData,setDrawRequestData}) => {
  
    
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
        const [editIndex, setEditIndex] = useState(null);
        const [editValue, setEditValue] = useState('');
        const [editField, setEditField] = useState('');
        const [createDrawLoader, setCreateDrawLoader] = useState(false);
        const [submitLoader, setSubmitLoader] = useState(false);
        const [historyData, setHistoryData] = useState([]);
        const getHistoryDrawRequest = async () => {
          try {
            const response = await getHistoryDrawTracking(loanId);
            setHistoryData(response.data); 
          } catch (err) {
            console.log(err);
          }
        };
      
        useEffect(() => {
          getHistoryDrawRequest();
        }, [loanId]);
        // Function to create a project and fetch table data
       
      
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
         
          const updatedData = [...drawRequestData];
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
              getHistoryDrawRequest()
            }
            
          } catch (error) {
            console.log(error);
          }
      
          // Update the state and reset the editing index
          setDrawRequestData(updatedData);
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
      
          const drawRequests = drawRequestData.map((row) => ({
            draw_request: row.draw_request,
          }));
      
          try {
            setSubmitLoader(true); // Show loader
            const response = await postDrawapproval(loanId, drawRequests);
            
            if (response.status === 200) {
              message.success("Submit Successful");
             
            } else {
              message.error("Submission Failed");
            }
            setIsModalVisibleDetails(false)
          } catch (error) {
            console.error(error);
            message.error("An error occurred");
          } finally {
            setSubmitLoader(false); // Hide loader
            setIsModalVisibleDetails(false)
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
  
        const handleModalClose = () => {
          setIsModalVisibleDetails(false);
       
        };
  
        const role = localStorage.getItem('RoleType');
      console.log('Token :', role);
  
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
    <Modal
    title="Draw Details" 
    visible={isModalVisibleDetails}
    onCancel={handleModalClose}
    footer={null}
    // className={styles.customModal}
    width={1350}
    centered
    >
        <div>
            
        <div className={styles.tableDiv}>
              <div className={styles.tableContainer}>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable" direction="horizontal">
                {(provided) => (
                <table className={styles.table}  ref={provided.innerRef} {...provided.droppableProps}>
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
                          {[ 'draw_amount'].includes(column.key) && (
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
                    {drawRequestData?.map((data, index) => (
                      <tr key={index}>
                        {columns.map((column) => (
                          <td className={styles.td} key={column.key}>
                            {editIndex === index && editField === column.dataIndex ? (
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
                              <span onClick={() => handleEditClick(index, column.dataIndex, data[column.dataIndex])}>
                                {column.dataIndex === "requested_date"
                        ? formatDateTime(data[column.dataIndex])
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

{/* {tableData.length > 0 && ( */}
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
      {/* )} */}
        </div>
       

      {/* Submit Button */}
     
    </Modal>
  )
}
