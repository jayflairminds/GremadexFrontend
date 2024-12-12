import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LoginPage } from './pages/loginPage/LoginPage';
import { PageLayout } from './layout/PageLayout';
import { DashboardPage } from './pages/dashBoardPage/DashBoardPage';
import {LoadDetailsPage} from "./pages/loanDetailsPage/LoadDetailsPage"
import { GenAI } from './pages/genAI/GenAI';
import { LoanAppCom } from './pages/loanAppComp/LoanAppComp';
import { LoanApplicationPage } from './pages/loanApplicationPage/LoanApplicationPage';
import { Budgeting } from './components/budgeting/Budgeting';
import { NotificationPage } from './pages/notificationPage/NotificationPage';
import { UserAdminPage } from './pages/userAdminPage/UserAdminPage';
import { ResetPassword } from './components/resetPassword/ResetPassword';
import { PlanSelectionPage } from './pages/planSelectionPage/PlanSelectionPage';
import { SuccessPage } from './pages/successPage/SuccessPage';
import { CancelPage } from './pages/cancelPage/CancelPage';
import { RegisterPage } from './pages/registerPage/RegisterPage';
import { Delete } from './services/delete/Delete';
import { EnhancementByAdmin } from './pages/enhancementByAdmin/EnhancementByAdmin';
import { DocumentMananger } from './pages/documentMananger/DocumentMananger';

const DynamicResetPasswordRoute = () => {
  const location = useLocation();
  const token = location.pathname.split('/reset-password/')[1];  
  
  
  const tokenParts = token.split('/'); 
  console.log("in dynamic",tokenParts)
  
  const prefix = tokenParts[0]; 
  const actualToken = tokenParts.slice(1).join('/'); 

  
  return <ResetPassword actualToken={actualToken} prefix={prefix} token={token}/>;
};

export const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [selectedProjectName, setSelectedProjectName] = useState('');
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const[sessionId,setSessionId]=useState("")
  const[dark,setDark]=useState(true)

  const [isSummaryModal,setIsSummaryModal] =useState(false)

  const [selectedFile, setSelectedFile] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [promptInput, setPromptInput] = useState("");
  const [loading, setLoading] = useState({ fileUpload: false, summary: false, prompt: false });
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const[isFileNameShow,setIsFileNameShow]=useState(false)
  const[isFileUploaded,setIsFileUploaded]=useState(false)
  const [time,setTime]=useState(null)
  const[metrics,setMetrics]=useState(false)
  const[navigationPage,setNavigationPage]=useState(null)
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('tokennn');
    if (token) {
      setIsAuthenticated(true);
      navigate(navigationPage)
    }
  }, []);
  console.log(isAuthenticated);
  

  useEffect(() => {
    localStorage.setItem('darkTheme', dark);
  }, [dark]);
  
  useEffect(() => {
    const handlePopState = () => {
            console.log('Back button clicked in React');
            const storedLoginTime = new Date(); // Assuming login time is saved in localStorage as timestamp
            const storedLoginTimeInMinutes = storedLoginTime.getTime(); // Convert it to milliseconds
            console.log(storedLoginTimeInMinutes,"storedLoginTimeInMinutes");
          
            // Calculate the difference in minutes
            const diffInMinutes = (storedLoginTimeInMinutes-time ) 
            console.log(diffInMinutes, "time difference");

            // Redirect based on time difference
            if (diffInMinutes < 900000) {
                navigate('/dashboard'); // Redirect to the dashboard if less than 15 minutes
            } else if(diffInMinutes>900000 && navigationPage==="dashboard")  {
                navigate('/login');
                // localStorage.clear()
            }
                // Custom behavior for back navigation
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
        window.removeEventListener('popstate', handlePopState);
    };
}, [time]); 

  return (
    // <Router>
      <Routes>
        
        <Route path="/login" element={<LoginPage setNavigationPage={setNavigationPage} setTime={setTime} setMetrics={setMetrics} setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated}/>} />
        <Route path="/" element={<LoginPage setNavigationPage={setNavigationPage} setTime={setTime}  setMetrics={setMetrics} setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated}/>} />
        <Route path="/reset-password/*" element={<DynamicResetPasswordRoute />} />
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/Delete' element={<Delete/>}/>
        {isAuthenticated ? (
          <>
          <Route path='/plan-selection' element={<PlanSelectionPage setSessionId={setSessionId}/>}/>
            <Route path= '/success' element={<SuccessPage sessionId={sessionId}/>}/>
            <Route path='/cancel' element={<CancelPage/>}/>
            <Route path="/" element={<PageLayout 
              totalNotifications={totalNotifications} 
              setActiveTab={setActiveTab}
              setTotalNotifications={setTotalNotifications}/>}>

              <Route path="/dashboard" element={<DashboardPage  
              setActiveTab={setActiveTab}
              setSelectedLoanId={setSelectedLoanId} 
              selectedLoanId={selectedLoanId}  
              dark={dark} 
              setDark={setDark} 
              setSelectedProjectName ={setSelectedProjectName}/>}
               />
              <Route path="/loan-details/:loanId" element={<LoadDetailsPage 
               isSummaryModal={isSummaryModal}
               setIsSummaryModal={setIsSummaryModal}
              metrics={metrics}
              selectedProjectName={selectedProjectName} 
              selectedLoanId={selectedLoanId}  
              setActiveTab={setActiveTab} 
              dark={dark} 
              setDark={setDark} 
              activeTab={activeTab} />} 
              />
              <Route path="/loan-application-form" element={<LoanAppCom 
              selectedProjectName={selectedProjectName}/>} 
              />
              <Route path="/loan-application-form/:id" element={<LoanApplicationPage />} />
              <Route path="/budgeting" element={<Budgeting  selectedProjectName={selectedProjectName}/>} />
              <Route 
                path="/genAI" 
                element={
                  <GenAI
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                    conversationHistory={conversationHistory}
                    setConversationHistory={setConversationHistory}
                    promptInput={promptInput}
                    setPromptInput={setPromptInput}
                    loading={loading}
                    setLoading={setLoading}
                    isDragActive={isDragActive}
                    setIsDragActive={setIsDragActive}
                    fileInputRef={fileInputRef}
                    isFileNameShow={isFileNameShow}
                    setIsFileNameShow={setIsFileNameShow}
                    isFileUploaded={isFileUploaded}
                    setIsFileUploaded={setIsFileUploaded}
                  />
                }
              />

              <Route 
                path="/notifications" 
                element={<NotificationPage 
                  setTotalNotifications={setTotalNotifications} 
                  setActiveTab={setActiveTab}
                />} 
              />

              <Route path="/userAdmin" element={<UserAdminPage />} />
              <Route path="/enhancementByAdmin" element={<EnhancementByAdmin />} />
              <Route path="/documentMananger" element={<DocumentMananger   isSummaryModal={isSummaryModal}
               setIsSummaryModal={setIsSummaryModal}/>} />
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" />} />

          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
      
    // </Router>
  );
};
