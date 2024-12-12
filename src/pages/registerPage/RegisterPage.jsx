import React, { useState } from 'react';
import styles from "./RegisterPage.module.css";
import { Button, message, Select } from 'antd';
import { userAddByAdmin } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        role_type: '',
        first_name: '',
        last_name: '',
    });
    const [loader, setLoader] = useState(false);

    // Check if all fields are filled
    const isFormValid = Object.values(formData).every(field => field !== '');

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
        setLoader(true);
        try {
            console.log(formData, 'Form Data before submission');
            const res = await userAddByAdmin(formData); // Send formData to API
            if (res.status === 200) {
                navigate("/login");
            }
            console.log('API Response:', res);
        } catch (error) {
            message.error("A user with that username already exists");
            console.error('Error submitting form:', error);
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className={styles.main}>
            <div className={styles.iframeDiv}>
                <iframe
                    style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        filter: "blur(7px)"
                    }}
                    src="https://landgorilla.com/animations/homepage-svg/HERO%20ANIMATE_NEW.html"
                    title="Animation"
                    className={styles.iframe}
                ></iframe>
            </div>
            <div className={styles.formContainer}>
                <div className={styles.registerDiv}>
                    <h2 className={styles.heading}>User Registration</h2>
                    <form className={styles.formDiv} onSubmit={handleSubmit}>
                        <div>
                            <label className={styles.heading}>Username:</label>
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
                            <label className={styles.heading}>Password:</label>
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
                            <label className={styles.heading}>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={styles.inputTag}
                                required
                            />
                        </div>

                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <label className={styles.heading}>Role Type:</label>
                            <select
                                name="role_type"
                                value={formData.role_type}
                                onChange={handleChange}
                                className={styles.selectTag}
                            >
                                <option value="">Select Role</option>
                                <option value="lender">Lender</option>
                                <option value="borrower">Borrower</option>
                                <option value="inspector">Servicer</option>
                            </select>
                        </div>

                        <div>
                            <label className={styles.heading}>First Name:</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className={styles.heading}>Last Name:</label>
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
                            disabled={!isFormValid} // Disable if form is not valid
                        >
                            Register
                        </Button>

                        <label
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/login")}
                            className={styles.heading}
                        >
                            Have an account? Log in
                        </label>
                    </form>
                </div>
            </div>
        </div>
    );
};
