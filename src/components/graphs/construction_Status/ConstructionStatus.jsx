import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Modal } from 'antd';
import expanIcon from '../../../assets/sidebar/expandIcon.svg';

export const ConstructionStatus = ({ project, loanId, constructionData, handleConstructionStatus }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    handleConstructionStatus();
  }, [handleConstructionStatus]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ width: '100%', height: 230, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0.2rem" }}>
      <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
        <h5 style={{ paddingBottom: '0rem', fontSize: '18px', paddingTop: '0.2rem', color: "white" }}>Construction Progress</h5>
        {/* <div style={{ cursor: "pointer", paddingBottom: "5px" }}> */}
          <img style={{ height: "17%", width: "17%" }} src={expanIcon} alt="Expand" onClick={showModal} />
        {/* </div> */}
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={constructionData}
          margin={{
            top: 20,
            right: 30,
            bottom: 5,
            left: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="milestone" />
          <Tooltip />
          <Legend />
          <Bar dataKey="percentage_completion" fill="#30bfe3" />
        </BarChart>
      </ResponsiveContainer>

      <Modal
        title="Construction Progress Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
      >
        <div style={{ height: '300px' }}> {/* Optional height for consistency */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={constructionData}
              margin={{
                top: 20,
                right: 30,
                bottom: 5,
                left: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="milestone" />
              <Tooltip />
              <Legend />
              <Bar dataKey="percentage_completion" fill="#30bfe3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Modal>
    </div>
  );
};
