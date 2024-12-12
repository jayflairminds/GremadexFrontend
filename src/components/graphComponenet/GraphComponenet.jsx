import React, { useEffect, useState } from 'react'
import styleDash from "./GraphComponenet.module.css"
import { Select } from 'antd';
import { getContingencyStatus, getExpenditureGraph } from '../../services/api';
import { ContingencyStatus } from '../graphs/contingency_Status/ContingencyStatus';
import { DisbursementSchedule } from '../graphs/disbursementSchedule/DisbursementSchedule';
import { ScheduleStatus } from '../graphs/schedule_Status/ScheduleStatus';
import { ConstructionStatus } from '../graphs/construction_Status/ConstructionStatus';
import { ProgressMonth } from '../graphs/progressMonth/ProgressMonth';
import { ExpenditureGraph } from '../graphs/expenditureGraph/ExpenditureGraph';
import { HeatMapGraph } from '../graphs/heatMap/HeatMapGraph';
import { HeatMapNew } from '../graphs/heatMap02/HeatMapNew';

const { Option } = Select;

export const GraphComponenet = ({loanId}) => {
  const [project, setProject] = useState('');
  const [projectNames, setProjectNames] = useState([]);
  const [loanData, setLoanData] = useState([]);
  const [data, setData] = useState([]);
  const[contingencyData,setContingencyData]=useState([])
  const [disData, setDisData] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [constructionData, setConstructionData] = useState([]);
  const[expenditureGraphData,setExpenditureGraphData]=useState([])
  const[cardColor, setCardColor] = useState('#084c61'); // Default card background color
console.log(contingencyData,"contingencyData");

  const handleContingencyStatus = async (graphName, loanId) => {
    try {
      const res = await getContingencyStatus(graphName, loanId);
      console.log(res.data,"conres");
      
      setContingencyData(res.data.Response)
      setData(res.data);
    } catch (err) {
      // console.log(err);
    }
  };

  const handleDisbursementSchedule = async (graphName, loanId) => {
    try {
      const res = await getContingencyStatus(graphName, loanId);
      setDisData(res.data);
    } catch (err) {
      // console.log(err);
    }
  };

  const handleScheduleStatus = async (graphName, loanId) => {
    try {
      const res = await getContingencyStatus(graphName, loanId);
      setScheduleData(res.data);
    } catch (err) {
      // console.log(err);
    }
  };

  const handleConstructionStatus = async (graphName, loanId) => {
    try {
      const res = await getContingencyStatus(graphName, loanId);
      setConstructionData(res.data);
    } catch (err) {
      // console.log(err);
    }
  };

  const handleExpenditureGraph = async (graphName, loanId) => {
    const response = await getExpenditureGraph(graphName, loanId);
    console.log(response,"handleExpenditureGraph");
    setExpenditureGraphData(response.data)
  };

  useEffect(() => {
    handleDisbursementSchedule('disbursement_schedule_graph', loanId);
    handleContingencyStatus('contingency_status_graph', loanId);
    handleScheduleStatus('schedule_status_graph', loanId);
    handleConstructionStatus('construction_status_graph', loanId);
    handleExpenditureGraph('construction_expenditure_graph',loanId)
  }, [loanId]);

  const handleColorChange = (value) => {
    setCardColor(value);
  };
  const dark = JSON.parse(localStorage.getItem('darkTheme'));
  console.log(expenditureGraphData,"uses");
  
  return (
    <div className={styleDash.main}
    style={{
      backgroundColor: dark ? '#084c61' : 'white',  
      color: dark ? "white" :"black"     
    }}
    >
      <div className={styleDash.selectDiv}>
        <span style={{ color: 'White' }}>Select Card Background Color:</span>
        <Select
          showSearch
          style={{ width: 200, marginBottom: '1rem' }}
          placeholder="Select a color"
          optionFilterProp="children"
          onChange={handleColorChange}
          defaultValue={cardColor}
        >
          <Option value="#084c61">Teal Blue</Option>
          <Option value="#177e89">Dark Cyan</Option>
          <Option value="#00FFFF">Aqua</Option>
          <Option value="#40B5AD">Verdigris</Option>
          {/* <Option value="#f0ad4e">Orange</Option> */}
          <Option value="#fff">White</Option>
          <Option value = '#000000'>Black</Option>
          {/* <Option value="#084c61">Base Color</Option> */}
        </Select>
      </div>

      <div className={styleDash.cardsDiv}>
        <div className={styleDash.card} style={{ backgroundColor: cardColor }}>
          <ContingencyStatus project={project} loanId={loanId} contingencyData={contingencyData} handleContingencyStatus={handleContingencyStatus} />
        </div>
        <div className={styleDash.card} style={{ backgroundColor: cardColor }}>
          <DisbursementSchedule project={project} loanId={loanId} disData={disData} handleDisbursementSchedule={handleDisbursementSchedule} />
        </div>
        <div className={styleDash.card} style={{ backgroundColor: cardColor }}>
          <ScheduleStatus project={project} loanId={loanId} scheduleData={scheduleData} handleScheduleStatus={handleScheduleStatus} />
        </div>
        <div className={styleDash.card} style={{ backgroundColor: cardColor }}>
          <ConstructionStatus project={project} loanId={loanId} constructionData={constructionData} handleConstructionStatus={handleConstructionStatus} />
        </div>
        <div className={styleDash.card} style={{ backgroundColor: cardColor }}>
          <ProgressMonth />
        </div>
        <div className={styleDash.card} style={{ backgroundColor: cardColor }}>
          <ExpenditureGraph expenditureGraphData={expenditureGraphData} />
        </div>
      </div>
      <div className={styleDash.cardHeat} style={{ backgroundColor: cardColor }}>
        <HeatMapGraph />
      </div>
      <div className={styleDash.cardHeat} style={{ backgroundColor: cardColor }}>
        <HeatMapNew />
      </div>
      
    </div>
  );
};

