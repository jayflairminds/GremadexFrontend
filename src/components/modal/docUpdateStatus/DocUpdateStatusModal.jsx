import { Button, Modal, Select, Input, message } from 'antd';
import React, { useState, useEffect } from 'react';
import styles from './DocUpdateStatusModal.module.css';
import { applicationStatus, updateStatus } from '../../../services/api';

export const DocUpdateStatusModal = ({
  docUploadStatusModal,
  setDocUploadStatusModal,
  selectedData,
  getFileList
}) => {
  const [statusOptions, setStatusOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [comment, setComment] = useState('');
  const[loader,setLoader]=useState(false)
  const role = localStorage.getItem('RoleType');
  const handleCancel = () => {
    setDocUploadStatusModal(false);
  };

  const handleUpdateStatus = async () => {
    const statusUpdate = {
      status_action: selectedStatus,
      document_id: selectedData?.id,
      document_comment: comment,
    };
    setLoader(true)
    try {
      const response = await updateStatus(statusUpdate);
      console.log(response);
      if (response.status === 200) {
        getFileList();
        message.success("Status changed");
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }finally{
        setLoader(false)
    }
    setDocUploadStatusModal(false);
  };

  const getFileListSelect = async () => {
    try {
      const response = await applicationStatus("document-upload");
      if (Array.isArray(response.data)) {
        setStatusOptions(response.data);
      } else {
        console.error('Expected an array but got:', response);
        setStatusOptions([]); // Set to an empty array in case of an unexpected response
      }
    } catch (error) {
      console.error('Failed to fetch status options:', error);
      setStatusOptions([]);
    }
  };

  useEffect(() => {
    if (role !== 'borrower') {
      getFileListSelect();
    }
  }, [role]);

  return (
    <Modal
      title="Update Document Status"
      open={docUploadStatusModal}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          className={styles.submitBtn}
          onClick={handleUpdateStatus}
          disabled={role === 'borrower' || !selectedStatus} 
          loading={loader}// Disable if no status is selected or user is borrower
        >
          Submit
        </Button>
      ]}
      centered
      width={600}
    >
      <div className={styles.modalContent}>
        <div className={styles.infoRow}>
          <span className={styles.label}>Document Type:</span>
          <span className={styles.value}>{selectedData?.document_type}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Document Name:</span>
          <span className={styles.value}>{selectedData?.document_name}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Status:</span>
          <span className={styles.value}>{selectedData?.status}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Uploaded At:</span>
          <span className={styles.value}>{selectedData?.uploaded_at}</span>
        </div>

        {/* Conditionally render the Select tag */}
        {role !== 'borrower' && (
          <div className={styles.infoRow}>
            <span className={styles.label}>Update Status:</span>
            <Select
              className={styles.statusSelect}
              placeholder="Select status"
              onChange={value => setSelectedStatus(value)}
              style={{ width: '80%' }}
            >
              {statusOptions.length > 0 ? (
                statusOptions.map(option => (
                  <Select.Option key={option} value={option}>
                    {option}
                  </Select.Option>
                ))
              ) : (
                <Select.Option disabled>No options available</Select.Option>
              )}
            </Select>
          </div>
        )}
        <div className={styles.infoRow}>
          <span className={styles.label}>Comment:</span>
          <Input.TextArea
            className={styles.commentInput}
            placeholder="Add a comment"
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </Modal>
  );
};
