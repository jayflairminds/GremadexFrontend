import React, { useEffect, useState } from 'react';
import { applyCoupon, getPaymentOptions, postCheckOutSession } from '../../services/api';
import styles from "./PlanSelectionPage.module.css";
import { Navbar } from '../../components/navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Divider, Input, message, Modal } from 'antd';
import { Loader } from '../../components/loader/Loder';
import Title from 'antd/es/skeleton/Title';

export const PlanSelectionPage = ({ setSessionId }) => {
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingBtnId, setLoadingBtnId] = useState(null); // Tracks the loading state for the clicked button
  const[openCouponModal,setOpenCouponModal]= useState(false)

  const[priceId,setPriceId]=useState(null)
  const[selectedOption,setSelectedOption]=useState(null)
  const [discount, setDiscount] = useState(null);
  const [priceToPay, setPriceToPay] = useState(selectedOption?.unit_amount);
  const [inputValue, setInputValue] = useState('');
  const[loaderApply,setLoaderApply]=useState(false)
  const[submitBtnLoader,setSubmitBtnLoader]=useState(false)
  const[submitBtnLoaderNoCoupon,setSubmitBtnLoaderNoCoupon]=useState(false)
  const[disableSubmitBtn,setDisableSubmitBtn]=useState(true)
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleApplyClick = async() => {
    setDisableSubmitBtn(true)
    setDiscount(null);
        setPriceToPay(selectedOption?.unit_amount)
        setLoaderApply(true)
    try{
      const response = await applyCoupon(inputValue)
      console.log(response);
      if(response.status===200){
        setDisableSubmitBtn(false)
        message.success("Yay!!! Coupon Code Applied")
        let newPrice = selectedOption?.unit_amount;
        
        let discountAmount = 0;

        if (response.data.response.percent_off && response.data.response.amount_off === null) {
          // Apply percentage discount
          discountAmount = (newPrice * response.data.response.percent_off) /100;
          newPrice = newPrice - discountAmount;
          
        } else if (response.data.response.amount_off && response.data.response.percent_off === null) {
          // Apply fixed amount discount
          discountAmount = response.data.response.amount_off;
          newPrice = newPrice - discountAmount;
          
        }


        if (newPrice < 0) newPrice = 0; 
        setDiscount(discountAmount);
        setPriceToPay(newPrice);
      }
    }catch(err){
      console.log(err);
      message.error(err.response.data.response)
      setPriceToPay( selectedOption?.unit_amount);
      
    }finally{
      setLoaderApply(false)
    }
    console.log(inputValue); // Logs the current value of the input
  };



  const navigate = useNavigate();
  
  useEffect(() => {
    fetchPaymentOptions();
  }, []);

  const fetchPaymentOptions = async () => {
    setIsLoading(true);
    try {
      const response = await getPaymentOptions();
      console.log(response,"resresr");
      
      const optionsArray = Object.keys(response.data).map(key => response.data[key]);
      console.log(optionsArray,"options");
      
      setPaymentOptions(optionsArray);  // Set the converted array in state
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanClass = (type) => {
    switch (type) {
      case 'Basic':
        return styles.basic;   // CSS class for Basic plan
      case 'Platinum':
        return styles.standard; // CSS class for Standard plan
      case 'Premium':
        return styles.premium;
      case 'Trial':
        return styles.free;     // CSS class for Free plan
      default:
        // Generate a random color if no specific plan type matches
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        return { backgroundColor: randomColor, ...styles.planCard }; // Add styles.planCard for general styling
    }
  };

  const handleSUbmitCoupon =async()=>{
    setDiscount(null);
    setPriceToPay(selectedOption?.unit_amount)
    setInputValue("")
    setSubmitBtnLoader(true)
    
    try {
      const response = await postCheckOutSession(priceId,inputValue);
      setSessionId(response.data.sessionId);
      const sessionId = response.data.sessionId;
      
      // Store the session ID in local storage
      localStorage.setItem('sessionId', sessionId);
      
      if (response.status === 200) {
        if (response?.data) {
          window.location.href = response?.data?.session?.url;
          
        }
      }
      
    } catch (error) {
      console.error('Error:', error);
      message.error(error.response.data.response)
    } finally {
      setLoadingBtnId(null); 
      setSubmitBtnLoader(false)
    }
  }

  const handleNavigate =  (priceIdarg, optionIdarg,option) => {
    console.log(option,"dse");
    setSelectedOption(option)
    setPriceId(priceIdarg)
    setOpenCouponModal(true)
    setPriceToPay( option?.unit_amount);
    
  };
    // Function to format number with commas
  const formatNumberWithCommas = (number) => {
    if (number == null) return ""; // Return an empty string if number is null or undefined
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  // This currencySymbols maintains a static object with predefined symbols
  const currencySymbols = { USD: "$", EUR: "€", GBP: "£", INR: "₹"};
  


  const handleCancel=()=>{
    setOpenCouponModal(false)
    setDiscount(null);
    setPriceToPay(selectedOption?.unit_amount)
    setInputValue("")
    setDisableSubmitBtn(true)
  }

  const handleWithoutCoupon =async()=>{
    setDiscount(null);
    setPriceToPay(selectedOption?.unit_amount)
    setInputValue("")
    setSubmitBtnLoaderNoCoupon(true)
    
    try {
      const response = await postCheckOutSession(priceId);
      setSessionId(response.data.sessionId);
      const sessionId = response.data.sessionId;
      
      // Store the session ID in local storage
      localStorage.setItem('sessionId', sessionId);
      
      if (response.status === 200) {
        if (response?.data) {
          window.location.href = response?.data?.session?.url;
          
        }
      }
      
    } catch (error) {
      console.error('Error:', error);
      message.error(error.response.data.response)
    } finally {
      setLoadingBtnId(null); 
      setSubmitBtnLoaderNoCoupon(false)
    }
  }
  return (
    <div className={styles.main}>
      <Navbar />
      <h1>Select Your Plan</h1>
      <div className={styles.plansContainer}>
        {isLoading ? <Loader /> :
         <>
         {Array.isArray(paymentOptions) && paymentOptions.length > 0 ? (
           paymentOptions[1]
             .slice() // Create a shallow copy to avoid mutating the original array
             .sort((a, b) => a.unit_amount - b.unit_amount) // Sort by unit_amount in ascending order
             .map((option) => (
               <div key={option.id} className={styles.planCard}>
                 <h2 className={getPlanClass(option.name)}>{option.name}</h2>
                 <p>Type: {option.type}</p>
                 <p>Price: {currencySymbols[option.currency.toUpperCase()]}{formatNumberWithCommas(option.unit_amount)}</p>
                 <p>Currency: {option.currency}</p>
                 <p className={styles.desTag}>Description: {option.description}</p>
                 
                 <Button 
                   loading={loadingBtnId === option.id} 
                   onClick={() => handleNavigate(option.default_price, option.id,option)} 
                   className={styles.selectBtn}
                 >
                   Select
                 </Button>
               </div>
             ))
         ) : (
           <p>No payment options available.</p>
         )}
       </>
       
        }
      </div>
      <Modal
        open={openCouponModal}
        title="Apply Coupon code"
        onCancel={handleCancel}
        footer={[
          <Button  key=""
          loading={submitBtnLoaderNoCoupon} 
          onClick={handleWithoutCoupon}>
            Go without coupon 
          </Button>,
          <Button key="submit"
          
          className={styles.selectBtn}
          loading={submitBtnLoader}
          onClick={handleSUbmitCoupon}
          disabled={disableSubmitBtn}>
            
            Submit
          </Button>,
        ]}
      >
        <div className={styles.inputDiv}>
        <Input 
        value={inputValue} 
        onChange={handleInputChange} 
        placeholder="Enter something"
        style={{color:"black"}} 
      />
      
      <Button type="primary" loading={loaderApply} className={styles.selectBtn}
     
      onClick={handleApplyClick}>
        Apply
      </Button>
        </div>
       <div>
       <Card style={{ marginTop: "20px", textAlign: "left" }} bordered={true}>
        <Title level={4}>Order Summary</Title>
        <div style={{ marginBottom: "10px" }}>
          <p>Original Price:</p>
          <p  style={{ float: "right" }}>
            ${((selectedOption?.unit_amount) )}
          </p>
        </div>
        <Divider style={{ margin: "10px 0" }} />
        <div style={{ marginBottom: "10px" }}>
          <p>Discount:</p>
          <p type="danger" style={{ float: "right" }}>
            - ${discount ? (discount ) : "0.00"}
          </p>
        </div>
        <Divider style={{ margin: "10px 0" }} />
        <div>
          <p>Total to Pay:</p>
          <p  style={{ float: "right", color: "green" }}>
            ${priceToPay }
          </p>
        </div>
      </Card>
       </div>
        
      </Modal>
    </div>
  );
};
