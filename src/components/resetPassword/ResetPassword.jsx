import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, message } from 'antd';
import { resetPasswordAPI } from '../../services/api';
import styles from "./ResetPassword.module.css"

export const ResetPassword = ({actualToken, prefix, token }) => { // Accept prefix as prop
    console.log('Received Prefix:', prefix); // You can log or use the prefix as needed
    console.log('Received Token:', actualToken);
    console.log('Token:', token);
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const[loader,setLoader]=useState(false)
    const navigate = useNavigate();

    const handlePasswordReset = async () => {
        if (newPassword !== confirmPassword) {
            message.error('Passwords do not match');
            return;
        }
        setLoader(true)
        try {
            const response = await resetPasswordAPI(newPassword, token); // Call API with token and new password
            if (response.status === 200) {
                message.success('Password reset successfully');
                navigate('/login'); // Redirect to login page after successful reset
            } else {
                message.error('Failed to reset password');
            }
        } catch (error) {
            console.error(error);
            message.error('An error occurred. Please try again.');
        }finally{
            setLoader(false)
        }
    };

    return (
        <div className={styles.main} >
            <div className={styles.formDiv}>
            <h2 className={styles.heading}>Reset Password</h2>
            <Input.Password
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ marginBottom: '1rem' }}
            />
            <Input.Password
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ marginBottom: '1rem' }}
            />
            <Button type="primary" className={styles.btn}
            loading={loader}
            onClick={handlePasswordReset}>
                Reset Password
            </Button>
            </div>

        </div>
    );
};
