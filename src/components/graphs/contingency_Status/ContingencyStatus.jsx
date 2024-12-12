import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line, ComposedChart } from 'recharts';
import { getContingencyStatus } from '../../../services/api';
import style from "./ContingencyStatus.module.css";
import expanIcon from '../../../assets/sidebar/expandIcon.svg';
import { Button, Modal } from 'antd';

export const ContingencyStatus = ({ contingencyData, project, loanId, handleContingencyStatus }) => {
  const [isContingencyStatus, setContingencyStatus] = useState(false);
  console.log(contingencyData,"contingencyData");
  
  const handleOk = () => {
    setContingencyStatus(true);
  };

  const handleCancel = () => {
    setContingencyStatus(false);
  };

  useEffect(() => {
    handleContingencyStatus();
  }, [handleContingencyStatus]); // added dependency to avoid lint warning

  return (
    <div style={{ width: '100%', height: 230, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0.2rem' }}>
      <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex",justifyContent: "end" }}>
          <h5 style={{ paddingBottom: '0rem', fontSize: '18px', paddingTop: '0.2rem', color: "white" }}>Contingency Status</h5>
        </div>
        <div style={{ display: "flex", width: "40%", justifyContent: "end", cursor: "pointer", paddingBottom: "5px" }}>
          <img className={style.imgExpand} src={expanIcon} alt="Expand" onClick={handleOk} />
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        width={600}
        height={300}
        data={contingencyData}
        margin={{ top: 20, right: 30, bottom: 5, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="draw" label={{ value: 'draw', position: 'insideBottom', offset: -5 }} />
        <YAxis />
        <Tooltip />
        <Legend />

        <Bar dataKey="total-released-direct-cost-percent" stackId="a" fill="#8884d8" name="Total Released Direct Cost Percent" />
        <Line type="monotone" dataKey="contingency-percent" stroke="rgb(130, 202, 157)" name="Contingency Percent" />
      </ComposedChart>
    </ResponsiveContainer>

      <Modal
        open={isContingencyStatus}
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h5 style={{ color: "black" }}>Contingency Status</h5>
          </div>
        }
        onOk={handleCancel}
        centered
        onCancel={handleCancel}
        width={'100%'}
        closable={true}
        footer={[
        ]}
      >
        <div style={{ height: '400px' }}> {/* Specify a height for the modal content */}
        <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        width={600}
        height={300}
        data={contingencyData}
        margin={{ top: 20, right: 30, bottom: 5, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="draw" label={{ value: 'draw', position: 'insideBottom', offset: -5 }} />
        <YAxis />
        <Tooltip />
        <Legend />

        <Bar dataKey="total-released-direct-cost-percent" stackId="a" fill="#8884d8" name="Total Released Direct Cost Percent" />
        <Line type="monotone" dataKey="contingency-percent" stroke="rgb(130, 202, 157)" name="Contingency Percent" />
      </ComposedChart>
    </ResponsiveContainer>
        </div>
      </Modal>
    </div>
  );
};
