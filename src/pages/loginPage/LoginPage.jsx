import React, { useEffect, useState } from 'react';
import stylesLogin from './LoginPage.module.css';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/loginPage/RestatxLogo.svg';
import { Button, Input, message, Modal } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'; // Import Ant Design icons
import { loginPost, passWordReset } from '../../services/api';

export const LoginPage = ({ isAuthenticated, setIsAuthenticated ,setTime,setMetrics,setNavigationPage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loader, setLoader] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [isOpenForgotPasswordModal, setIsOpenForgotPasswordModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState(''); // State for modal email input

    const navigate = useNavigate();
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                handleLogin(e); // Call handleLogin when Enter is pressed
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown); // Cleanup listener on component unmount
        };
    }, [email, password]); // Dependencies on email and password

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoader(true);
        try {
            const response = await loginPost(email, password);
            console.log(response, 'response');
            if (response.status === 200) {
                setIsAuthenticated(true);
                setMetrics(response?.data?.risk_metrics)
                const loginDateTime = new Date();
                setTime(loginDateTime.getTime())
                const tokenId = response.data.token;
                localStorage.setItem('tokennn', tokenId);
                console.log('Token stored:', localStorage.getItem('tokennn'));
                const role = response.data.role_type;
                localStorage.setItem('RoleType', role);
                const firstName = response.data.user_data.first_name;
                localStorage.setItem('FirstName', firstName);
                const subscription_status = response.data.subscription_status
                localStorage.setItem('SubscriptionStatus', subscription_status);
                if(subscription_status ==="active" 
                    || subscription_status==="trialing"
                ){
                    navigate('/dashboard');
                    setNavigationPage("/dashboard")
                }
                else{
                    navigate("/plan-selection")
                    
                }
                message.success('You have logged in');
            } else {
                setError('Invalid login credentials');
                message.error('Something went wrong');
            }
        } catch (error) {
            console.log(error,"erererer");
            // message.error(error.response.data.non_field_errors[0])
            setError('Login failed. Please try again.');
            message.error('Something went wrong');
        } finally {
            setLoader(false); // Hide loader regardless of outcome
        }
    };

    // Function to toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Handle forgot password (open modal)
    const handleForgotPassword = () => {
        handleModalSubmit()
        // setIsOpenForgotPasswordModal(true);
    };

    // Handle modal close
    const handleCancel = () => {
        setIsOpenForgotPasswordModal(false);
    };

    // Handle modal submit (log email)
    const handleModalSubmit = async() => {
        console.log('Forgot Email:', email);
        try{
            const response = await passWordReset(email)
            console.log(response);
            if(response.status===200){
                message.success(`Password reset link sent to: ${response.data.Email}`);
            }
            if(response.status ===404){
                message.error("User with this email does not exist")
            }
            
        }
        catch(err){
            console.log(err);
            message.error("Something went wrong");
            
        }
       
      
        setIsOpenForgotPasswordModal(false); // Close modal after submission
    };

    return (
        <div className={stylesLogin.main}>

            
            <div className={stylesLogin.logoDiv}>
                <iframe
                    src="https://landgorilla.com/animations/homepage-svg/HERO%20ANIMATE_NEW.html"
                    title="Animation"
                    width="100%"
                    height="500px"
                    style={{ border: 'none' }}
                ></iframe>
            </div>
            <div className={stylesLogin.loginDiv}>
                <div className={stylesLogin.formDivMain}>
                    <div className={stylesLogin.heading}>
                        <img
                            style={{ height: '50%', width: '20%' }}
                            src={logo}
                            alt="Logo"
                        />
                        <h1 style={{ color: '#177e89' }}>RESTatX</h1>
                    </div>
                    <div className={stylesLogin.form}>
                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <label style={{ color: 'black' }}>User Name:</label>
                            <input
                                style={{
                                    marginLeft: '0px',
                                    width: '220px',
                                    border: 'none',
                                    outline: 'none',
                                    color: 'black',
                                    borderBottom: '1px solid black',
                                }}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <label style={{ color: 'black' }}>Password:</label>
                            <div style={{ display: 'flex', alignItems: 'center', borderRadius: '8px' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'} // Toggle input type based on state
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{
                                        marginLeft: '11px',
                                        border: 'none',
                                        outline: 'none',
                                        color: 'black',
                                        borderBottom: '1px solid black',
                                    }}
                                />
                                <Button style={{marginLeft:"5px"}}
                                    icon={showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                    onClick={togglePasswordVisibility} // Toggle password visibility
                                />
                            </div>
                        </div>
                    </div>
                    {error && (
                        <>
                            <p className={stylesLogin.error}>{error}</p>
                            <Button type="link" onClick={handleForgotPassword}>
                                Forgot Password?
                            </Button>
                        </>
                    )}
                    <div className={stylesLogin.btnDiv} style={{ paddingTop: '1rem', width: '100%' }}>
                        <Button
                            className={stylesLogin.filledBtn}
                            onClick={handleLogin}
                            key="submit"
                            type="primary"
                            style={{ backgroundColor: '#0EB198' }}
                            loading={loader} // Display loader while loading is true
                        >
                            Login
                        </Button>
                    </div>
                    <label style={{ cursor: "pointer" }}
                    onClick={()=>navigate("/register")}
                    className={stylesLogin.heading}>Don't have an account? Sign up</label>
                </div>
            </div>

            <Modal
                open={isOpenForgotPasswordModal}
                title="Forgot Password"
                onCancel={handleCancel}
                footer={[
                    <Button key="submit" className={stylesLogin.filledBtn} onClick={handleModalSubmit}>
                        Submit
                    </Button>,
                ]}
            >
                <div className={stylesLogin.modalDiv}>
                    <p>Email:</p>
                    <Input
                        placeholder="Enter Email Id"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)} // Update modal email state
                        style={{color:"black"}}
                    />
                </div>
            </Modal>
        </div>
    );
};
