import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styleHeat from './HeatMap.module.css';
import expanIcon from '../../../assets/sidebar/expandIcon.svg';

const initialData = [
  { category: 'Enterprise', description: 'Enterprise Risks', impact: 1.0, probability: 1.0, velocity: 3.0, preparedness: 3.0, x: 3, y: 3 },
  { category: 'Market Risk', description: 'Value-At-Risk', impact: 3.0, probability: 1.0, velocity: 4.0, preparedness: 3.0, x: 12, y: 3 },
  { category: 'Market Risk', description: 'Stress Testing Result', impact: 3.0, probability: 3.0, velocity: 1.0, preparedness: 4.0, x: 3, y: 12 },
  { category: 'Market Risk', description: 'Sensitivity Analysis', impact: 3.0, probability: 3.0, velocity: 2.0, preparedness: 2.0, x: 6, y: 6 },
  { category: 'Credit Risk Indicators', description: 'Credit Spread', impact: 3.0, probability: 4.0, velocity: 3.0, preparedness: 2.0, x: 9, y: 8 },
  { category: 'Credit Risk Indicators', description: 'Default Rates', impact: 4.0, probability: 2.0, velocity: 3.0, preparedness: 2.0, x: 12, y: 4 },
  { category: 'Credit Risk Indicators', description: 'Credit Rating Changes', impact: 2.0, probability: 1.0, velocity: 4.0, preparedness: 4.0, x: 2, y: 4 },
  { category: 'Liquidity Risk', description: 'Liquidity Coverage Ratio', impact: 3.0, probability: 1.0, velocity: 1.0, preparedness: 3.0, x: 3, y: 3 },
  { category: 'Operational Risk', description: 'Compliance Breaches', impact: 3.0, probability: 2.0, velocity: 2.0, preparedness: 4.0, x: 6, y: 8 },
  { category: 'Performance Risk', description: 'Performance Deviation', impact: 4.0, probability: 3.0, velocity: 3.0, preparedness: 3.0, x: 12, y: 9 },
  { category: 'Counterparty Risk', description: 'Counterparty Exposure', impact: 3.0, probability: 1.0, velocity: 3.0, preparedness: 2.0, x: 9, y: 2 },
  { category: 'Strategic Risk', description: 'Strategic Alignment', impact: 2.0, probability: 1.0, velocity: 4.0, preparedness: 4.0, x: 8, y: 4 },
  { category: 'Reputational Risk', description: 'Reputational Events', impact: 4.0, probability: 2.0, velocity: 2.0, preparedness: 2.0, x: 1, y: 4 },
  { category: 'Regulatory Risk', description: 'Regulatory Changes', impact: 1.0, probability: 1.0, velocity: 4.0, preparedness: 1.0, x: 4, y: 1 },
  { category: 'Compliance Risk', description: 'Audit Findings', impact: 4.0, probability: 3.0, velocity: 3.0, preparedness: 2.0, x: 12, y: 6 },
  { category: 'ESG Risk', description: 'ESG Scores', impact: 4.0, probability: 4.0, velocity: 4.0, preparedness: 3.0, x: 16, y: 12 },
];

export const HeatMapGraph = () => {
  const [data, setData] = useState(initialData);
  const [isHeatMapModal, setIsHeatMapModal] = useState(false);

  const handleOpenModal = () => {
    setIsHeatMapModal(true);
  };

  const handleCloseModal = () => {
    setIsHeatMapModal(false);
  };

  const handleChange = (description, key, value) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.description === description
          ? {
              ...item,
              [key]: parseFloat(value),
              x: item.probability * item.velocity,
              y: item.impact * item.preparedness,
            }
          : item
      )
    );
  };

  // Determine color based on position
  const getColor = (x, y) => {
    const distanceToCenter = Math.sqrt(Math.pow(x - 8, 2) + Math.pow(y - 8, 2));
    if (distanceToCenter < 4) return 'green';  // Center points close to green
    if (x <= 8 && y >= 8) return 'red';  // Top left corner - red
    if (x >= 8 && y <= 8) return 'red';  // Top right corner - red
    return '#8884d8';  // Default color for other points
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.2rem' }}>
      <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems:"center" }}>
        <div style={{ display: "flex", width: "60%", justifyContent: "end" }}>
          <h5 style={{ fontSize: '18px', margin: '0.5rem', color:"white" }}>Heatmap</h5>
        </div>
        <div style={{ display: "flex", width: "40%", justifyContent: "end", cursor:"pointer", paddingBottom:"5px" }}>
          <img className={styleHeat.imgExpand} onClick={handleOpenModal} src={expanIcon} alt="Expand" />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis type="number" dataKey="x" name="Probability" />
          <YAxis type="number" dataKey="y" name="Impact" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter
            name="Risks"
            data={data}
            fill="#8884d8"
            shape={({ cx, cy, payload }) => (
              <circle cx={cx} cy={cy} r={5} fill={getColor(payload.x, payload.y)} />
            )}
          />
        </ScatterChart>
      </ResponsiveContainer>

      <Modal
        open={isHeatMapModal}
        title={<div className={styleHeat.titleDiv}><span className={styleHeat.titleHeading}>Heat Map</span></div>}
        onOk={handleCloseModal}
        centered
        onCancel={handleCloseModal}
        width={'100%'}
        closable
        footer={null}
      >
        <div style={{ display: "flex" }}>
          <div className={styleHeat.tableContainer}>
            <table className={styleHeat.table}>
              <thead className={styleHeat.stickyHeader}>
                <tr className={styleHeat.headRow}>
                  {['Risk Category', 'Risk Description', 'Impact', 'Probability', 'Velocity', 'Preparedness'].map((header, index) => (
                    <th className={styleHeat.th} key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex === data.length - 1 ? styleHeat.lastRow : ''}>
                    {['category', 'description', 'impact', 'probability', 'velocity', 'preparedness'].map((key, cellIndex) => (
                      <td className={styleHeat.td} key={cellIndex}>
                        {cellIndex >= 2 ? (
                          <input
                            type="number"
                            style={{color:"black"}}
                            value={row[key]}
                            onChange={(e) => handleChange(row.description, key, e.target.value)}
                            step="0.1"
                            min="0"
                            max="4"
                          />
                        ) : (
                          row[key]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ResponsiveContainer width="50%" height={400}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="Probability" />
              <YAxis type="number" dataKey="y" name="Impact" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter
                name="Risks"
                data={data}
                fill="#8884d8"
                shape={({ cx, cy, payload }) => (
                  <circle cx={cx} cy={cy} r={5} fill={getColor(payload.x, payload.y)} />
                )}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </Modal>
    </div>
  );
};
