import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Button, Modal } from 'antd';

import expanIcon from '../../../assets/sidebar/expandIcon.svg';

export const  DisbursementSchedule = ({ disData, project, loanId, handleDisbursementSchedule }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    handleDisbursementSchedule();
  }, [handleDisbursementSchedule]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ width: '100%', height: 300, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0.2rem" }}>
      
      <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex",justifyContent: "end" }}>
        <h5 style={{ paddingBottom: "1rem", fontSize: "18px", paddingTop: "0.2rem", color: "white" }}>Disbursement Schedule</h5>
        </div>
        {/* <div style={{ display: "flex", width: "40%", justifyContent: "end", cursor: "pointer", paddingBottom: "5px" }}> */}
          <img style={{height:"17%",width:"17%"}} src={expanIcon} alt="Expand" onClick={showModal} />
        {/* </div> */}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={disData}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 35,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="review_months" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="theoretical" stroke="#8884d8" dot={false} />
          <Line type="monotone" dataKey="actual" stroke="#82ca9d" dot={false} />
        </LineChart>
      </ResponsiveContainer>

      <Modal
        title="Disbursement Schedule Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
        ]}
        width={'100%'}
      >
        <div style={{ height: '500px' }}> {/* Optional height for consistency */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={disData}
              margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="review_months" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="theoretical" stroke="#8884d8" dot={false} />
              <Line type="monotone" dataKey="actual" stroke="#82ca9d" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Modal>
    </div>
  );
};
