import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import successAnimation from "../../components/successAnimation .json"
import Lottie from 'react-lottie';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { postSavePayment } from '../../services/api';
import { message } from 'antd';




export const SuccessPage = () => {
  // console.log(sessionId,"session");
  // const [sessionIdVal, setSessionIdVal] = useState(null)
  
  // const [searchParams] = useSearchParams();
  // const sessionId = searchParams.get('sessionid');
  // console.log(sessionId,"session");
  // useEffect(() => {
   
  //   setSessionIdVal(sessionId)
  // }, [searchParams]);
  
  
  const navigate = useNavigate(); 
  
  
  
    
    useEffect(() => {
      const confettiDuration = 3 * 1000;
      const animationEnd = Date.now() + confettiDuration;
      
      const confettiFrame = () => {
        // Confetti settings
        const colors = ['#bb0000', '#ffffff'];
        
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });
  
        if (Date.now() < animationEnd) {
          requestAnimationFrame(confettiFrame);
        }
      };
      
     
      confettiFrame();
      
      const redirectTimeout = setTimeout(() => {
        navigate('/dashboard');
      }, 5000);
      
      return () => clearTimeout(redirectTimeout);
    }, [navigate]);
    
    const defaultOptions = {
      loop: false,
      autoplay: true, 
      animationData: successAnimation, // JSON data for the success animation
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };
    
    const handleSavePayment =async()=>{
      try{
        const sessionId = localStorage.getItem('sessionId');
        console.log(sessionId,"sese");
        
        await postSavePayment(sessionId)
        }
        catch(err){
          // message.error("Something Went Wrong")
          console.log(err);
          
        }
      }

      useEffect(()=>{
        handleSavePayment()
      },[])
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        
      <h1>Success!</h1>
      <h3 style={{paddingBottom:"2rem"}}>Congratulations, your payment was successful.</h3>

      <Lottie options={defaultOptions} height={200} width={200} />
    </div>
  );
};
