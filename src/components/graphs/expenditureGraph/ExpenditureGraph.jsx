import React, { useState } from 'react';
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

// ExpenditureGraph component
export const ExpenditureGraph = ({ expenditureGraphData }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ width: '100%', height: 230, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0.2rem" }}>
      <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
        <h5 style={{ paddingBottom: "0rem", fontSize: "18px", paddingTop: "0.2rem", color: "white" }}>Expenditure Graph</h5>
          <img style={{ height: "17%", width: "17%" }} src={expanIcon} alt="Expand" onClick={showModal} />
      </div>

      <ResponsiveContainer>
        <BarChart
          layout="vertical"
          data={expenditureGraphData}
          margin={{
            top: 20,
            right: 30,
            bottom: 5,
            left: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="uses" width={120}  />
          <Tooltip />
          <Legend />
          <Bar dataKey="released_amount" stackId="a" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

      <Modal
        title="Expenditure Graph Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
      >
        <div style={{ height: '500px' }}> {/* Optional height for consistency */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={expenditureGraphData}
              margin={{
                top: 20,
                right: 30,
                bottom: 5,
                left: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="uses"  width={140} tick={{ fontSize: 12, angle: 0, fill: "#333" }}/>
              <Tooltip />
              <Legend />
              <Bar dataKey="released_amount" stackId="a" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Modal>
    </div>
  );
};
