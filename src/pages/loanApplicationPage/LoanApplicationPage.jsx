import React, { useState, useEffect } from 'react';
import { Button, DatePicker, message, Select } from 'antd';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import stylesLoan from "./LoanApplicationPage.module.css";
import { CheckListModal } from '../../components/modal/checkListModal/CheckListModal';
import { getcheckList, getInspectorRoleType, getLenderRoleType, postLoan } from '../../services/api';

export const LoanApplicationPage = () => {
  const [loandescription, setLoanDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  // const [endDate, setEndDate] = useState('');
  // const [interestRate, setInterestRate] = useState('');
  const [duration, setDuration] = useState('');
  const [lender, setLender] = useState('');
  const [inspector, setInspector] = useState('');
  const [inspectors, setInspectors] = useState([]);
  const [lenders, setLenders] = useState([]);
  const [loadId,setLoadId]= useState()
  const [isCheckListModal,setIsCheckListModal]=useState(false)
  const [checkList,setCheckList]=useState([])
  const [loader,setLoader]=useState(false)
  
  const navigate = useNavigate();
  
  const { id } = useParams();

  useEffect(() => {
    const fetchInspectors = async () => {
      try {
        const res = await getInspectorRoleType();
        setInspectors(res.data);
      } catch (error) {
        console.error('Failed to fetch inspectors:', error);
      }
    };

    fetchInspectors();
  }, []);

  useEffect(() => {
    const fetchLenders = async () => {
      try {
        const res = await getLenderRoleType();
        setLenders(res.data);
      } catch (error) {
        console.error('Failed to fetch lenders:', error);
      }
    };

    fetchLenders();
  }, []);


  const handleCheckList =async (id)=>{
    const res = await getcheckList(id)
    console.log(res);
    setCheckList(res.data.response)
  }




  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validation: Check if all required fields are filled
    if (!loandescription || !amount || !startDate || !duration || !lender || !inspector) {
      message.error('Please fill in all required fields.');
      return; // Stop submission if validation fails
    }
  
    setLoader(true);
  
    const payload = {
      loandescription,
      amount: parseFloat(amount),
      start_date: new Date(startDate).toISOString(),
      duration,
      lender: parseInt(lender),
      inspector: parseInt(inspector),
      project: parseInt(id),
    };
  
    try {
      const res = await postLoan(payload);
      console.log(res, "res");
  
      setLoadId(res.data.loanid);
      setIsCheckListModal(true);
      if (res.status === 201) {
        handleCheckList(res.data.loanid);
      }
    } catch (err) {
      message.error(err.response.data.response)
      if (err.status === 409) {
        console.log(err);
        message.error(err.response.data.detail);
        navigate('/loan-application-form');
      }
    } finally {
      setLoader(false);
    }
  };
  
 
  

  const handleInspectorChange = (value) => {
    setInspector(value);
    console.log('Selected Inspector ID:', value);
  };

  const handleLenderChange = (value) => {
    setLender(value);
    console.log('Selected Lender ID:', value);
  };
  const dark = JSON.parse(localStorage.getItem('darkTheme'));
  return (
    <div className={stylesLoan.formContainer}
    style={{
      backgroundColor: dark ? '#084c61' : 'white',  
      // paddingTop:"1rem"       // Change text color based on the theme
    }}>
      <form className={stylesLoan.formDiv} onSubmit={handleSubmit}>
        <div>
              <label>Loan Description:</label>
                <input 
                  type="text" 
                  value={loandescription} 
                  onChange={(e) => setLoanDescription(e.target.value)} 
                  required 
                />
        </div>
        <div className={stylesLoan.AmountRateDIv}>
                  {/* <div>
                  <label>Interest Rate (%):</label>
                  <input 
                    type="number" 
                    value={interestRate} 
                    onChange={(e) => setInterestRate(e.target.value)} 
                    required 
                  />
                </div> */}
              <div>
                  <label>Duration (months):</label>
                    <input 
                      type="number" 
                      value={duration} 
                      onChange={(e) => setDuration(e.target.value)} 
                      required 
                    />
                </div>
                <div>
                     <label>Amount:</label>
                      <input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                        required 
                      />
                </div>
        </div>

        <div className={stylesLoan.dateDiv}>
              <label>Start Date:</label>
              <DatePicker onChange={(date, dateString) => setStartDate(dateString)}
             
               />
           
            
        </div>

        <div className={stylesLoan.selectDiv}>
            <div className={stylesLoan.inspectorDiv}>
              <label>Select Servicer:</label>
              <Select
                style={{ width: '100%' }}
                placeholder="Select Servicer"
                onChange={handleInspectorChange}
              >
                {inspectors.map((inspector) => (
                  <Select.Option key={inspector.user} value={inspector.user}>
                       {inspector.user_name}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className={stylesLoan.inspectorDiv}>
              <label>Select Lender:</label>
              <Select
                style={{ width: '100%' }}
                placeholder="Select Lender"
                onChange={handleLenderChange}
              >
                {lenders.map((lender) => (
                  <Select.Option key={lender.user} value={lender.user}>
                    {lender.user_name}
                  </Select.Option>
                ))}
              </Select>
            </div>
        </div>
        <div className={stylesLoan.btnDiv}>
          <Button className={stylesLoan.btn} onClick={handleSubmit}  loading={loader} >Save & Next</Button>
        </div>
        <CheckListModal isCheckListModal={isCheckListModal} setIsCheckListModal={setIsCheckListModal} checkList={checkList} loadId={loadId}/>
      </form>
    </div>
  );
};
