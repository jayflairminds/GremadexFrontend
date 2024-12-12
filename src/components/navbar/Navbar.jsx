import React, { useEffect, useState } from 'react';
import stylesNav from "./Navbar.module.css";
import logo from "../../assets/loginPage/grameLogoNew-removebg-preview.png";
import { Avatar, Badge, Button, Modal, Popover } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import NotificationIcon from "../../assets/navbar/Window_Collapse.svg";
import { useNavigate } from 'react-router-dom';
import { getNotification, postLogout } from '../../services/api';

export const Navbar = ({ totalNotifications, setTotalNotifications,setActiveTab }) => {
  const [open, setOpen] = useState(false); // State for total notifications
  const [notifications, setNotifications] = useState([]); // State for notification list
  const [notificationData, setNotificationData] = useState({});
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleRefresh = () => {
    localStorage.removeItem('projectNameStore');
    localStorage.removeItem('tokennn');
    localStorage.removeItem('RoleType');
    localStorage.removeItem('FirstName');
    navigate('/login');
  };

  const handleNotification = async () => {
    try {
      const response = await getNotification("1");
      console.log(response);
      
      setTotalNotifications(response.data.total_notifications); 
      setNotifications(response.data.notifications); 
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleNotification();
  }, []);

  const firstName = localStorage.getItem("FirstName");

  const handleNotificationClick = (id,loantype,start_date,duration,loandescription,status,borrower_name,lender_name,inspector_name,message) => {
    console.log(`Notification ID: ${id}`);
    setNotificationData({
      id,
      loantype,
      start_date,
      duration,
      loandescription,
      status,
      borrower_name,
      lender_name,
      inspector_name,message
    });
    setIsModalVisible(true);
    // Additional actions can go here, e.g., navigating to a specific notification page.
  };

  const truncateMessage = (message) => {
    const words = message.split(" ");
    return words.length > 3 ? words.slice(0, 3).join(" ") + "..." : message;
  };

  // Content for the Popover: Mapping notifications to display titles
  const notificationContent = (
    <div>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div 
            key={notification.id} 
            onClick={() => handleNotificationClick(notification.id,notification.loantype,notification.start_date,notification.duration,notification.loandescription,notification.status,notification.borrower_name
              ,notification.lender_name,notification.inspector_name,notification.message
            )} 
            style={{ display: "flex", paddingBottom: '8px', cursor: 'pointer' }}
          >
            <p className={stylesNav.nameTag}></p>
            {notification.title}: {truncateMessage(notification.message)}
          </div>
        ))
      ) : (
        <p>No notifications</p>
      )}
    </div>
  );

  const handleOk = () => {
    // setLoader(true);
    // Perform actions for marking as read or any other logic
    // After completion
    // setLoader(false);
    setIsModalVisible(false); // Close modal after action
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  

  const getStatusClass = (status) => {
    if (status === "Pending") return stylesNav.pending;
    if (status === "Not Uploaded" || status === "Rejected") return stylesNav.notUploaded;
    if (status === "In Review" || status === "Pending Lender") return stylesNav.pending;
    if (status === "Approved" || status === "In Approval") return stylesNav.approve;
    if (status === "Reject") return stylesNav.notUploaded;
    return stylesNav.uploaded;
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


  return (
    <div className={stylesNav.main}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img className={stylesNav.img} style={{ height: "10%", width: "10%" }} src={logo} alt="Logo" />
        <h3 style={{ color: "white", paddingLeft: "0.7rem" }}>RESTatX</h3>
      </div>
      <div style={{ color: "white", marginRight: "2rem", display: "flex", alignItems: "center", gap: "10px", textAlign: "center" }}>
        {/* Notification Icon with Popover and Badge */}
        <div style={{ marginRight: "1rem", padding: "0.4rem" }}>
          <Popover content={notificationContent} title="Notifications" trigger="hover">
            <Badge count={totalNotifications} offset={[]}>
              <img src={NotificationIcon} alt="Notifications" style={{ cursor: 'pointer' }} />
            </Badge>
          </Popover>
        </div>

        {/* User Info and Logout Button */}
        <div style={{ cursor: "pointer" }}>
          <Popover
            content={
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex" }}>
                  <div style={{ display: "flex", paddingLeft: "0.2rem" }}>
                    <p className={stylesNav.nameTag}>First Name:</p>
                    {firstName}
                  </div>
                </div>
                <div onClick={handleRefresh} className={stylesNav.btnDiv} style={{ paddingTop: "1rem" }}>
                  <button className={stylesNav.logoutBtn}>Logout</button>
                </div>
              </div>
            }
            title=""
            trigger="hover"
            open={open}
            onOpenChange={handleOpenChange}
          >
            <div className={stylesNav.buttonNav} type="primary">
              <Avatar size="small" icon={<UserOutlined />} />
            </div>
          </Popover>
        </div>
      </div>

      <Modal
        title="Details"
        open={isModalVisible}
        centered
        onOk={handleOk}
        onCancel={handleCancel}
        width={900}
        footer={[
          // <Button key="back" className={stylesNav.filledBtn}  onClick={handlNavigate}>
          //   More details
          // </Button>,
          // <Button
          //   key="submit"
          //   type="primary"
          //   className={stylesNav.filledBtn}
          //   onClick={handleOk}
          //   // loading={loader}
          // >
          //   Mark as read 
          // </Button>,
        ]}
      >
          <div className={stylesNav.restDetails}>
          <div className={stylesNav.details}>
            <h2 className={stylesNav.heading}>Loan Type:</h2>
            <span className={stylesNav.headingText}>{notificationData?.loantype}</span>
          </div>
          <div className={stylesNav.details}>
            <h2 className={stylesNav.heading}>Start Date:</h2>
            <span className={stylesNav.headingText}>{formatDate(notificationData?.start_date)}</span>
          </div>
         
          <div className={stylesNav.details}>
            <h2 className={stylesNav.heading}>Duration (In Months):</h2>
            <span className={stylesNav.headingText}>{notificationData?.duration}</span>
          </div>
          <div className={stylesNav.details}>
            <h2 className={stylesNav.heading}>Loan Description:</h2>
            <span className={stylesNav.headingText}>{notificationData?.loandescription}</span>
          </div>
          <div className={stylesNav.details}>
            <h2 className={stylesNav.heading}>Status:</h2>
            <span className={`${stylesNav.headingTextStatus} ${getStatusClass(notificationData?.status)}`}>
              {notificationData?.status}
            </span>
          </div>
          <div className={stylesNav.details}>
            <h2 className={stylesNav.heading}>Borrower Name:</h2>
            <span className={stylesNav.headingText}>{notificationData?.borrower_name}</span>
          </div>

          <div className={stylesNav.details}>
            <h2 className={stylesNav.heading}>Lender Name:</h2>
            <span className={stylesNav.headingText}>{notificationData?.lender_name}</span>
          </div>

          <div className={stylesNav.details}>
            <h2 className={stylesNav.heading}>Servicer Name:</h2>
            <span className={stylesNav.headingText}>{notificationData?.inspector_name}</span>
          </div>
          <div className={stylesNav.details}>
            <h2 className={stylesNav.heading}>Message:</h2>
            <span className={stylesNav.headingText}>{notificationData?.message}</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};
