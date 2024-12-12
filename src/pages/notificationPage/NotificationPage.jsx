import React, { useEffect, useState } from 'react';
import { Modal, Button, Table } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import stylesD from './NotificationPage.module.css';
import { getNotification, postNotification } from '../../services/api';
import { Loader } from '../../components/loader/Loder';

export const NotificationPage = ({ setTotalNotifications,setActiveTab }) => {
  const [notifications, setNotifications] = useState([]);
  const[notificationData,setNotificationData]=useState({})
  const [selectedId, setSelectedId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); 

  // Pagination state
  const [paginationConfig, setPaginationConfig] = useState({
    current: 1,
    pageSize: 5,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20', '50'],
    total: 0,
  });

  const handleNotification = async (page = 1, pageSize = 5) => {
    setIsLoading(true)
    try {
      const response = await getNotification(page, pageSize);
      
      
      setTotalNotifications(response.data.total_notifications);
      setNotifications(response.data.notifications); 
      setPaginationConfig((prev) => ({
        ...prev,
        current: page,
        pageSize: pageSize,
        total: response.data.total_notifications,
      }));
    } catch (err) {
      console.log(err);
    }finally{
      setIsLoading(false)
    }
  };

  useEffect(() => {
    handleNotification();
  }, []);

  const handleRowClick = (notification) => {
    console.log(notification, "noti");
    setNotificationData(notification)
    localStorage.setItem("projectNameStore",notification?.projectname)
    setSelectedId(notification.id)
    setIsModalVisible(true);
  };
  
// console.log(notificationData,"notidata");

  const handleOk = async () => {
    setLoader(true);
    try {
      
      const response = await postNotification(selectedId);
      handleNotification(paginationConfig.current, paginationConfig.pageSize); // Refresh the notifications
      console.log(response);
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
    setIsModalVisible(false); // Close the modal
  };

  const handlNavigate = () => {
    const loanId = notificationData.loan;
     if (notificationData.title === "Draw Application") {
      setActiveTab("drawSummary");
      navigate(`/loan-details/${loanId}`); 
    } else if (notificationData.title === "Loan Application") {
      setActiveTab("overview");
      navigate(`/loan-details/${loanId}`); 
    } else if (notificationData.title === "Document Management") {
      setActiveTab("docUpload");
      navigate(`/loan-details/${loanId}`);
    }

   
  };

  const handleCancel =() =>{
    setIsModalVisible(false); 
  }
  // Handle pagination, sorting, filtering
  const handleTableChange = (pagination) => {
    handleNotification(pagination.current, pagination.pageSize);
  };

  // Define the columns for the Ant Design Table
  const columns = [
    // {
    //   title: '',
    //   dataIndex: 'select',
    //   render: (_, notification) => (
    //     <input
    //       type="radio"
    //       name="selectNotification"
    //       checked={selectedId === notification.id}
    //       onChange={() => setSelectedId(notification.id)}
    //     />
    //   ),
    //   width: 70,
    //   fixed: 'left',
    // },
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: 150,
    },
    {
      title: 'Message',
      dataIndex: 'message',
      ellipsis: true,
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      render: (text) => new Date(text).toLocaleString(),
      width: 180,
    },
    {
      title: 'Read Status',
      dataIndex: 'is_read',
      render: (isRead) => (
        <p className={isRead ? stylesD.read : stylesD.unRead}>
          {isRead ? 'Read' : 'Unread'}
        </p>
      ),
      width: 100,
    },
  ];

  // Transform notifications data for Ant Design Table
  const dataSource = notifications.map((notification) => ({
    key: notification.id, // Ant Design requires a unique key for each row
    ...notification,
  }));
  const getStatusClass = (status) => {
    if (status === "Pending") return stylesD.pending;
    if (status === "Not Uploaded" || status === "Rejected") return stylesD.notUploaded;
    if (status === "In Review" || status === "Pending Lender") return stylesD.pending;
    if (status === "Approved" || status === "In Approval") return stylesD.approve;
    if (status === "Reject") return stylesD.notUploaded;
    return stylesD.uploaded;
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const dark = JSON.parse(localStorage.getItem('darkTheme'));
  return (
    <div className={stylesD.main}
    style={{
      backgroundColor: dark ? '#084c61' : 'white',         // Change text color based on the theme
    }}
    >
    {isLoading ? (
      <div className={stylesD.loaderDiv}>
         <Loader />
      </div>
     
    ) : (
    <div className={stylesD.main}
    style={{
      backgroundColor: dark ? '#084c61' : 'white',         // Change text color based on the theme
    }}
    >
      <div className={stylesD.headingDiv}>
        <h2 className={stylesD.heading}>Notifications</h2>
      </div>

      {notifications.length > 0 ? (
        <div className={stylesD.tableDiv}>
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={paginationConfig}
            onChange={handleTableChange}
            scroll={{ x: 1000, y: 400 }}
            className={stylesD.tableAtnd}
            onRow={(record) => ({
              onClick: () => handleRowClick(record), // Handle row click
            })}
          />
        </div>
      ) : (
        <div className={stylesD.headingDiv}>
          <h2 className={stylesD.heading}>No notifications available :(</h2>
        </div>
      )}

      <Modal
        title="Details"
        open={isModalVisible}
        centered
        onOk={handleOk}
        onCancel={handleCancel}
        width={900}
        footer={[
          <Button key="back" className={stylesD.filledBtn} onClick={handlNavigate}>
            More details
          </Button>,
          <Button
            key="submit"
            type="primary"
            className={stylesD.filledBtn}
            onClick={handleOk}
            loading={loader}
          >
            Mark as read 
          </Button>,
        ]}
      >
          <div className={stylesD.restDetails}>
          <div className={stylesD.details}>
            <h2 className={stylesD.heading}>Loan Type:</h2>
            <span className={stylesD.headingText}>{notificationData?.loantype}</span>
          </div>
          <div className={stylesD.details}>
            <h2 className={stylesD.heading}>Start Date:</h2>
            <span className={stylesD.headingText}>{formatDate(notificationData?.start_date)}</span>
          </div>
         
          <div className={stylesD.details}>
            <h2 className={stylesD.heading}>Duration (In Months):</h2>
            <span className={stylesD.headingText}>{notificationData?.duration}</span>
          </div>
          <div className={stylesD.details}>
            <h2 className={stylesD.heading}>Loan Description:</h2>
            <span className={stylesD.headingText}>{notificationData?.loandescription}</span>
          </div>
          <div className={stylesD.details}>
            <h2 className={stylesD.heading}>Status:</h2>
            <span className={`${stylesD.headingTextStatus} ${getStatusClass(notificationData?.status)}`}>
              {notificationData?.status}
            </span>
          </div>
          <div className={stylesD.details}>
            <h2 className={stylesD.heading}>Borrower Name:</h2>
            <span className={stylesD.headingText}>{notificationData?.borrower_name}</span>
          </div>

          <div className={stylesD.details}>
            <h2 className={stylesD.heading}>Lender Name:</h2>
            <span className={stylesD.headingText}>{notificationData?.lender_name}</span>
          </div>

          <div className={stylesD.details}>
            <h2 className={stylesD.heading}>Servicer Name:</h2>
            <span className={stylesD.headingText}>{notificationData?.inspector_name}</span>
          </div>
        </div>
      </Modal>
    </div>
    
  )}
  </div>
  );
};
