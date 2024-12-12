import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

import expanIcon from '../../../assets/sidebar/expandIcon.svg';
import styleHeat from "./HeatMapNew.module.css"
import { Modal } from 'antd';
// Function to generate random data for the heatmap
const generateData = (count, { min, max }) => {
  return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};

export const HeatMapNew = () => {
    const [tableData, setTableData] = useState([
        { name: 'Jan', data: generateData(20, { min: -30, max: 55 }) },
        { name: 'Feb', data: generateData(20, { min: -30, max: 55 }) },
        { name: 'Mar', data: generateData(20, { min: -30, max: 55 }) },
        { name: 'Apr', data: generateData(20, { min: -30, max: 55 }) },
        { name: 'May', data: generateData(20, { min: -30, max: 55 }) },
        { name: 'Jun', data: generateData(20, { min: -30, max: 55 }) },
        { name: 'Jul', data: generateData(20, { min: -30, max: 55 }) },
        { name: 'Aug', data: generateData(20, { min: -30, max: 55 }) },
        { name: 'Sep', data: generateData(20, { min: -30, max: 55 }) },
      ]);
    
      const options = {
        chart: {
          height: 350,
          type: 'heatmap',
        },
        plotOptions: {
          heatmap: {
            shadeIntensity: 0.5,
            radius: 0,
            useFillColorAsStroke: true,
            colorScale: {
              ranges: [
                { from: -30, to: 5, name: 'low', color: '#00A100' },
                { from: 6, to: 20, name: 'medium', color: '#128FD9' },
                { from: 21, to: 45, name: 'high', color: '#FFB200' },
                { from: 46, to: 55, name: 'extreme', color: '#FF0000' },
              ],
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 1,
        },
      };
    
      function generateData(count, yrange) {
        return Array.from({ length: count }, () => Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min);
      }
    
      const handleTableInputChange = (monthIndex, dayIndex, value) => {
        const updatedData = [...tableData];
        updatedData[monthIndex].data[dayIndex] = Number(value);
        setTableData(updatedData);
      };
        const [isHeatMapModal, setIsHeatMapModal] = useState(false);

        const handleOpenModal = () => {
            setIsHeatMapModal(true);
        };

        const handleCloseModal = () => {
            setIsHeatMapModal(false);
        };


  return (
    <div>
         <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems:"center" }}>
        <div style={{ display: "flex", width: "60%", justifyContent: "end" }}>
          <h5 style={{ fontSize: '18px', margin: '0.5rem', color:"white" }}>Heatmap</h5>
        </div>
        <div style={{ display: "flex", width: "40%", justifyContent: "end", cursor:"pointer", paddingBottom:"5px" }}>
          <img  className={styleHeat.imgExpand}  onClick={handleOpenModal} src={expanIcon} alt="Expand" />
        </div>
      </div>
      <div id="chart">
        <ReactApexChart options={options} series={tableData} type="heatmap" height={350} />
      </div>
      {/* <div id="html-dist"></div> */}
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
            <thead>
              <tr>
                <th>Month</th>
                {tableData[0].data.map((_, dayIndex) => (
                  <th key={dayIndex}>Day {dayIndex + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((month, monthIndex) => (
                <tr key={month.name}>
                  <td>{month.name}</td>
                  {month.data.map((value, dayIndex) => (
                    <td key={dayIndex}>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => handleTableInputChange(monthIndex, dayIndex, e.target.value)}
                        style={{ width: "60px",color:"black" }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
         
        </div>
        <div id="chart">
            <ReactApexChart options={options} series={tableData} type="heatmap" height={450} width={650} />
          </div>
      </div>
    </Modal>

    </div>
  );
};
