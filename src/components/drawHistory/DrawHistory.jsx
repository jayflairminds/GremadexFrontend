import React, { useEffect, useState } from 'react';
import { Modal, Button, Select, message } from 'antd';
import styles from './DrawHistory.module.css';
import { deleteDrawTracking, getDrawRequestBorrower, getHistoryDrawTracking, putDrawApproval, statusDraw } from '../../services/api';
import { DrawRequestModal } from '../modal/drawRequestModal/DrawRequestModal';
import { Loader } from '../loader/Loder';
import { ViewUploadFileModal } from '../modal/viewUploadFileModal/ViewUploadFileModal';

const { Option } = Select;

// Function to get CSS class based on status
const getStatusClass = (status) => {
  if (status === "Pending") return styles.pending;
  if (status === "Not Uploaded" || status === "Rejected") return styles.notUploaded;
  if (status === "In Review" || status === "Pending Lender") return styles.pending;
  if (status === "Approved" || status === "Approve" || status === "In Approval") return styles.approve;
  if (status === "Reject") return styles.notUploaded;
  return styles.uploaded;
};

export const DrawHistory = ({ loanId ,isModalVisibleDetails, setIsModalVisibleDetails}) => {
  const [historyData, setHistoryData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [statusOptions, setStatusOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const[loader,setLoader]=useState(false)
  const[drawRequestData,setDrawRequestData]=useState([])
  const [isLoading, setIsLoading] = useState(false);
  const[isViewDocModal,setIsViewDocModal]=useState(false)
  const [selectedItem, setSelectedItem] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState({});
  
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

  const role = localStorage.getItem('RoleType');

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

  // Handle row click to open general modal
  const handleRowClick = (item) => {
    setSelectedRowData(item);
    setIsModalVisible(true);
  };

  // Handle status click to open status-specific modal
  const handleStatusClick = async(item, e) => {
    e.stopPropagation(); // Prevent row click event from firing
    setSelectedRowData(item);
    console.log(item,"ttt");
    
    if (role === "borrower") {
      try{
        const response = await getDrawRequestBorrower(loanId,item.draw_request)
  
        setDrawRequestData(response.data)
      }
      catch(err){
        console.log(err);
        
      }
      setIsModalVisibleDetails(true);
        // handleRowClickDetails()
      } else {
        setIsStatusModalVisible(true);
        handleOptions(); 
      }
    handleOptions()
  };

  
  const handleModalClose = () => {
    setIsModalVisible(true);
    setIsModalVisible(false)
    setIsStatusModalVisible(false)
  };

  const handleOptions =async() =>{
    try{
        const res = await statusDraw("draw-approval");
        setStatusOptions(res.data)
    }
    catch(err){
        console.log(err);
        
    }
  }

  const handleStatusChange = (value) => {
    setSelectedStatus(value); // Update the selected status in state
  };

  const handleSubmit = async() => {
    setLoader(true)
    console.log("ID:", selectedRowData.id);
    console.log("Selected Status:", selectedStatus);
    try{    
        const response = await putDrawApproval( selectedRowData.id,selectedStatus)
        console.log(response);
        getHistoryDrawRequest()
        message.success("Status Update")
        setIsStatusModalVisible(false)
    }catch(err){
        console.log(err);
        message.error("Request is in still pending status")
    }finally{
        setLoader(false)
        setIsStatusModalVisible(false)
    }
    
  };
  const handleRowClickDetails = async(item) => {
    setIsLoading(true)
    try{
      const response = await getDrawRequestBorrower(loanId,item.draw_request)

      setDrawRequestData(response.data)
    }
    catch(err){
      console.log(err);
      
    }finally{
      setIsLoading(false)
    }
    setIsModalVisibleDetails(true);
  };
  const handleOpenDocModal = (item) => {
    setSelectedItem(item)
    console.log(item,"item");
    setIsViewDocModal(true);
  };

  const formatNumberWithCommas = (number) => {
    if (number == null) return ""; // Return an empty string if number is null or undefined
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleDeleteRequest =async(item) =>{
    setLoadingDelete(prev => ({ ...prev, [item.id]: true }));
    try{
      const response = await deleteDrawTracking(item.id)
      console.log(response);
      if(response.status===204){
        message.success("File Deleted")
        setHistoryData((prevData) =>
          prevData.filter((dataItem) => dataItem.id !== item.id)
        );
      }
      
    }
    catch(err){
      console.log(err);
      message.error("Something went wrong")
      
    }finally{
      setLoadingDelete(prev => ({ ...prev, [item.id]: false }));
    }
  }

  return (
    <div className={styles.main}>
      {isLoading ? (
        <div className={styles.loaderDiv}>
           <Loader />
        </div>
       
      ) : (
      <div className={styles.tableDiv}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.stickyHeader}>
            <tr className={styles.headRow}>
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
              <th className={styles.th}>View Summary</th>
              <th className={styles.th}>View/Upload Documents</th>
              <th className={styles.th}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {historyData.length > 0 ? (
              historyData.map((item) => (
                <tr key={item.id} className={styles.row} onClick={() => handleRowClickDetails(item)}>
                  <td className={styles.td}>{item.id}</td>
                  <td className={styles.td}>{formatNumberWithCommas(item.draw_request)}</td>
                  <td className={styles.td}>{formatNumberWithCommas(item.total_released_amount)}</td>
                  <td className={styles.td}>{formatNumberWithCommas(item.total_budget_amount)}</td>
                  <td className={styles.td}>{formatNumberWithCommas(item.total_funded_amount)}</td>
                  <td
                    className={`${styles.td} ${getStatusClass(item.draw_status)}`}
                    onClick={(e) => handleStatusClick(item, e)}
                  >
                    {item.draw_status}
                  </td>
                  <td className={styles.td}>{item.draw_date}</td>
                  <td className={styles.td}>{item.comments}</td>
                  <td className={styles.td}>{item.disbursement_date}</td>
                  <td className={styles.td}>{formatNumberWithCommas(item.total_balance_amount)}</td>
                   <td className={styles.td}>{formatNumberWithCommas(item.total_draw_amount)}</td>
                  <td className={styles.td}>
                    <button
                      className={styles.btnSummary}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents row click when "View Summary" is clicked
                        handleRowClick(item);
                      }}
                    >
                      View Summary
                    </button>
                  </td>
                  <td className={styles.td}>
                    <button className={styles.btnSummary}
                    onClick={(e)=>{
                      e.stopPropagation();
                      handleOpenDocModal(item)}}
                    >
                      View/Upload Documents
                    </button>
                  </td>
                  <td className={styles.td}>
                    <Button
                      className={styles.deleteBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRequest(item);
                      }}
                      disabled={item.draw_status !== "In Review" && item.draw_status !=="Pending"}
                      loading={loadingDelete[item.id] || false}
                    >
                      Delete
                    </Button>
                  </td>
                      
                </tr>
              ))
            ) : (
              <tr>
                <td style={{color:"white"}}colSpan="12" className={styles.noData}>
                  No Draw History
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <DrawRequestModal
          drawRequestData={drawRequestData}
          setDrawRequestData={setDrawRequestData}
          loanId={loanId}
          isModalVisibleDetails={isModalVisibleDetails}
          setIsModalVisibleDetails={setIsModalVisibleDetails}
        />
        <ViewUploadFileModal
        isViewDocModal={isViewDocModal} setIsViewDocModal={setIsViewDocModal} selectedItem={selectedItem}
        />
      </div>
      </div>

)}
      {/* General Modal for row click */}
      <Modal
        title="Draw Details"
        visible={isModalVisible}
        onCancel={handleModalClose}
        centered
        footer={null}
        className={styles.customModal}
        width={500}
      >
        {selectedRowData && (
          <div className={styles.drawDetailsDiv}>
            <p><strong>ID:</strong> {selectedRowData.id}</p>
            <p><strong>Draw Request:</strong> {formatNumberWithCommas(selectedRowData.draw_request)}</p>
            <p><strong>Total Released Amount:</strong> {formatNumberWithCommas(selectedRowData.total_released_amount)}</p>
            <p><strong>Total Budget Amount:</strong> {formatNumberWithCommas(selectedRowData.total_budget_amount)}</p>
            <p><strong>Total Funded Amount:</strong> {formatNumberWithCommas(selectedRowData.total_funded_amount)}</p>
            <p >
            <strong>Draw Status:</strong> 
            <span className={getStatusClass(selectedRowData.draw_status)} style={{borderRadius:"8px"}}>
                {selectedRowData.draw_status}
            </span>
            </p>
            <p><strong>Draw Date:</strong> {selectedRowData.draw_date}</p>
            <p><strong>Comments:</strong> {selectedRowData.comments}</p>
            <p><strong>Disbursement Date:</strong> {selectedRowData.disbursement_date}</p>
            <p><strong>Total Balance Amount:</strong> {formatNumberWithCommas(selectedRowData.total_balance_amount)}</p>
            <p><strong>Total Draw Amount:</strong> {formatNumberWithCommas(selectedRowData.total_draw_amount)}</p>

          </div>
        )}
      </Modal>

      {/* Status Modal for status column click */}
      <Modal
        title="Status Details"
        visible={isStatusModalVisible}
        onCancel={handleModalClose}
        centered
        footer={[
            <>
                <Button key="close" className={styles.modalCloseBtn} onClick={handleModalClose}>
                Close
            </Button>
            <Button onClick={handleSubmit} loading={loader}
             className={styles.btn}>
                Submit
            </Button>
            </>
          
        ]}
        className={styles.customModal}
      >
        {selectedRowData  && (
          <div className={styles.statusDetails}>
            <p><strong>ID:</strong> {selectedRowData.id}</p>
            <p><strong>Draw Status:</strong> {selectedRowData.draw_status}</p>
            <p>
              <strong>Update Status:</strong>
              <Select value={selectedStatus} onChange={handleStatusChange} style={{ width: 200 }}>
                    {statusOptions.map((option) => (
                    <Option key={option} value={option}>
                        {option}
                    </Option>
                    ))}
                </Select>
            </p>
            <p><strong>Draw Request:</strong>  {formatNumberWithCommas(selectedRowData.draw_request)}</p>
            <p><strong>Total Released Amount:</strong> {formatNumberWithCommas(selectedRowData.total_released_amount)}</p>
            <p><strong>Total Budget Amount:</strong> {formatNumberWithCommas(selectedRowData.total_budget_amount)}</p>
            <p><strong>Total Funded Amount:</strong> {formatNumberWithCommas(selectedRowData.total_funded_amount)}</p>
            <p><strong>Draw Date:</strong> {selectedRowData.draw_date}</p>
            <p><strong>Comments:</strong> {selectedRowData.comments}</p>
            <p><strong>Disbursement Date:</strong> {selectedRowData.disbursement_date}</p>
            <p><strong>Total Balance Amount:</strong> {formatNumberWithCommas(selectedRowData.total_balance_amount)}</p>
            <p><strong>Total Draw Amount:</strong> {formatNumberWithCommas(selectedRowData.total_draw_amount)}</p>
          </div>
        )}
      </Modal>

      {/* <Modal
    title="Draw Request Details"
    open={isModalVisibleDetails}
    onOk={handleRowClickDetails}
    onCancel={handleModalCloseDetails}
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
                            {column.dataIndex}
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
  );
};
