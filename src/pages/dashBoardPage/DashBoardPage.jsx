import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, Input } from 'antd'; // Import Ant Design's Select and Input components
import classNames from 'classnames';
import { getAssestList } from '../../services/api';
import styles from "./DashboardPage.module.css";
import { Switch } from 'antd';
import { Loader } from '../../components/loader/Loder';

const { Option } = Select;

export const DashboardPage = ({ setSelectedProjectName, dark, setDark,setActiveTab }) => {
    const [loanData, setLoanData] = useState([]);
    const [filteredLoanData, setFilteredLoanData] = useState([]);
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState(''); // New state for search term
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    
  
    useEffect(() => {
        const fetchAssestList = async () => {
            setIsLoading(true)
            try {
                const response = await getAssestList();
                setLoanData(response.data);
                setFilteredLoanData(response.data);
            } catch (error) {
                console.error(error);
            }finally{
                setIsLoading(false)
            }
        };

        fetchAssestList();
        setActiveTab("overview")
    }, []);

    useEffect(() => {
        let filteredData = loanData;

        // Filter by status
        if (statusFilter !== 'All') {
            filteredData = filteredData.filter(loan => loan.status === statusFilter);
        }

        // Filter by project name search term (real-time)
        if (searchTerm) {
            filteredData = filteredData.filter(loan => 
                loan.projectname.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredLoanData(filteredData);
    }, [statusFilter, searchTerm, loanData]);

    const handleCardClick = (loan) => {
        localStorage.setItem("projectNameStore",loan?.projectname)
        setSelectedProjectName(loan?.projectname);
        console.log("hi");
        
        navigate(`/loan-details/${loan.loanid}`, { state: { loan } });
    };

    const handleDocAI = () => {
        navigate('/genAI');
    };

    const handleStartNewApp = () => {
        navigate('/loan-application-form');
    };

    const handleStatusChange = (value) => {
        setStatusFilter(value);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value); // Update the search term as the user types
    };

    const getStatusClass = (status) => {
        if (status === "Pending") return styles.pending;
        if (status === "Not Uploaded" || status === "Rejected") return styles.notUploaded;
        if (status === "In Review" || status === "Pending Lender") return styles.pending;
        if (status === "Approved" || status === "In Approval") return styles.approve;
        if (status === "Reject") return styles.notUploaded;
        return styles.uploaded;
    };

    const onChange = (checked) => {
        setDark(checked)
      };

// const dark = localStorage.getItem('darkTheme')
// console.log(dark,"localDashboard");
console.log(filteredLoanData.length,"le");

    return (
        <div className={styles.main}
        
        style={{
            backgroundColor: dark ? '#084c61' : 'white',         // Change text color based on the theme
          }}
        >
            <div className={styles.toggleDiv}>
            <Switch 
            defaultChecked={dark}
            onChange={onChange} />

            </div>

            <div className={styles.filterDiv}>
                <label className={styles.pTagOne}
                 style={{
                    color: dark ? 'white' : 'black',         // Change text color based on the theme
                  }}
                >Search by Project Name: </label>
                <Input
                    placeholder="Enter project name"
                    allowClear
                    onChange={handleSearch} // Listen for input changes and update the search term
                    style={{ width: 300, marginRight: '20px' }}
                />

                <label className={styles.pTagOne}
                 style={{
                    color: dark ? 'white' : 'black',         // Change text color based on the theme
                  }}>Filter by Status: </label>
                <Select
                    id="statusFilter"
                    defaultValue="All"
                    style={{ width: 200 }}
                    onChange={handleStatusChange}
                    className={styles.selectTag}
                >
                    <Option value="All">All</Option>
                    <Option value="Pending">Pending</Option>
                    <Option value="Approved">Approved</Option>
                    <Option value="In Review">In Review</Option>
                </Select>
            </div>
            <>
      {isLoading ? (
        <div className={styles.loaderDiv}>
           <Loader />
        </div>
       
      ) : (
            <div className={styles.cardsBtnDivMain}>
            {filteredLoanData.length<1 &&(
                // <div className={styles.noProjectDiv}>
                <h3 className={styles.headingP}>No Projects available :( Please create one.</h3>
                // {/* </div> */}
                    
            )}
                <div className={styles.cardsDiv}>
                    <div className={styles.innerDiv}>
                            {filteredLoanData?.map((loan) => (
                                <div key={loan.loanid} className={styles.card} onClick={() => handleCardClick(loan)}>
                                    <h3 className={styles.heading}>{loan.projectname}</h3>
                                    <div className={styles.parentCardDiv}>
                                        <div>
                                        <p className={styles.pTag}>
                                        <strong>Address:</strong> 
                                        {loan.address.length > 10 
                                            ? loan.address.slice(0, 10) + '...' 
                                            : loan.address}
                                        </p>


                                            <p className={styles.pTag}><strong>Loan Type:</strong> {loan.loantype}</p>
                                            <p className={styles.pTag}><strong>Amount:</strong> ${loan.amount.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            {/* <p className={styles.pTag}><strong>Interest Rate:</strong> {loan.interestrate}%</p> */}
                                            <p className={styles.pTag}><strong>Duration:</strong> {loan.duration} months</p>
                                            <p className={classNames(styles.statusBtn, getStatusClass(loan.status))}><strong>Status:</strong> {loan.status}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                    
                </div>

                <div className={styles.DocUploadDiv}>
                    <div className={styles.cardsDiv1}>
                        <div className={styles.cardDoc}>
                            <h3 className={styles.heading}>AI Document Upload & Parsing</h3>
                            <p className={styles.pTag}>Upload and automatically parse project-related documents to streamline your workflow.</p>
                            <button onClick={handleDocAI} className={styles.btn}>Document upload and AI</button>
                        </div>
                        <div className={styles.cardDoc}>
                            <h3 className={styles.heading}>Loan & Draw Applications</h3>
                            <p className={styles.pTag}>Submit, review, and manage loan and draw applications for your projects.</p>
                            <button onClick={handleStartNewApp} className={styles.btn}>Start New Application</button>
                        </div>
                    </div>
                </div>
            </div>
            )}
    </>
        </div>
    );
};
