import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
  Label,
} from 'recharts';
import { Button, Modal } from 'antd';
import expanIcon from '../../../assets/sidebar/expandIcon.svg';

export const ScheduleStatus = ({ scheduleData, project, loanId, handleScheduleStatus }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    handleScheduleStatus();
  }, [handleScheduleStatus]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ width: '100%', height: 230, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0.2rem" }}>
      <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", justifyContent: "end" }}>
          <h5 style={{ paddingBottom: '0rem', fontSize: '18px', paddingTop: '0.2rem', color: "white" }}>Schedule Status</h5>
        </div>
        {/* <div style={{ display: "flex", width: "40%", justifyContent: "end", cursor: "pointer", paddingBottom: "5px" }}> */}
        <img style={{height:"17%",width:"17%"}} src={expanIcon} alt="Expand" onClick={showModal} />
        {/* </div> */}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={scheduleData}
          margin={{
            top: 5,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="review_months">
            <Label value="Review Months" offset={-5} position="insideBottom" />
          </XAxis>
          <YAxis label={{ value: 'Deviation (weeks)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <ReferenceLine y={0} stroke="#000" />
          <Bar dataKey="deviation_from_schedule_weeks">
            {scheduleData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.deviation_from_schedule_weeks >= 0 ? 'green' : 'red'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <Modal
        title="Schedule Status Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
        ]}
        width={"100%"}
      >
        <div style={{ height: '300px' }}> {/* Optional height for consistency */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={scheduleData}
              margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 5,
              }}
              width={'100%'}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="review_months">
                <Label value="Review Months" offset={-5} position="insideBottom" />
              </XAxis>
              <YAxis label={{ value: 'Deviation (weeks)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <ReferenceLine y={0} stroke="#000" />
              <Bar dataKey="deviation_from_schedule_weeks">
                {scheduleData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.deviation_from_schedule_weeks >= 0 ? 'green' : 'red'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Modal>
    </div>
  );
};
