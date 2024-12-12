import React, { useState } from 'react';
import styles from "./AddUserByAdmin.module.css"
import { Button, message } from 'antd';
import { userAddByAdmin } from '../../services/api';

export const AddUserByAdmin = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        role_type: 'lender',
        first_name: '',
        last_name: '',
      });
    const[loader,setLoader]=useState(false)
      // Handle input changes
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
    
      // Handle form submission
      const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        setLoader(true)
        try {
          const res = await userAddByAdmin(formData);
          message.success("User added")
          console.log('API Response:', res);
        } catch (error) {
          message.error(error.response.data.username[0])
          console.error('Error submitting form:', error);
        }finally{
          setLoader(false)
        }
      };
    
      const isFormValid = () => {
        return Object.values(formData).every((field) => field.trim() !== '');
      };
      return (
        <div  className={styles.main}>
            <div className={styles.registerDiv}>
                <h2 className={styles.heading}>User Registration</h2>
                <form className={styles.formDiv} onSubmit={handleSubmit}>
                    <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={styles.inputTag}
                        required
                    />
                    </div>
    
                    <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={styles.inputTag}
                        required
                    />
                    </div>
    
                    <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={styles.inputTag}
                        required
                    />
                    </div>
    
                    <div style={{display:"flex",gap:"0.5rem"}}>
                    <label>Role Type:</label>
                    <select 
                        name="role_type"
                        value={formData.role_type}
                        onChange={handleChange}
                        className={styles.selectTag}
                    >
                        <option value="lender">Lender</option>
                        <option value="borrower">Borrower</option>
                        <option value="inspector">Servicer</option>
                    </select>
                    </div>
    
                    <div>
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                    </div>
    
                    <div>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                    </div>
    
                    <Button 
                    loading={loader}
                    className={styles.btn} 
                    onClick={handleSubmit}
                    disabled={!isFormValid()} 
                    >Register</Button>
                </form>
            </div>
         
        </div>
      );
    };
    