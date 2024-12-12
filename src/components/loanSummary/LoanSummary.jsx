import React, { useEffect, useState } from 'react';
import styles from "./LoanSummary.module.css";
import { budget_summary, listOFDocLoan } from '../../services/api';
import { Loader } from '../loader/Loder';

export const LoanSummary = ({ loanId }) => {
    const [summary, setSummary] = useState([]);
    const [documents, setDocuments] = useState({});
    const [collapsedCategories, setCollapsedCategories] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const toggleCollapse = (category) => {
        setCollapsedCategories(prevState => ({
            ...prevState,
            [category]: !prevState[category], // Toggle the collapse state
        }));
    };
    const getSummary = async () => {
        setIsLoading(true)
        try {
            const res = await budget_summary(loanId);
            setSummary(res.data);
        } catch (err) {
            console.log(err);
        }finally{
            setIsLoading(false)
        }
    };

    const getListOfDoc = async () => {
        setIsLoading(true)
        try {
            const res = await listOFDocLoan(loanId);
            setDocuments(res.data); // Store the document list in state
        } catch (err) {
            console.log(err);
        }finally{
            setIsLoading(false)
        }
    };

    useEffect(() => {
        getSummary();
        getListOfDoc();
    }, [loanId]);

    const getStatusClass = (status) => {
        if (status === "Pending") return styles.pending;
        if (status === "Not Uploaded" || status === "Rejected") return styles.notUploaded;
        if (status === "In Review" || status === "Pending Lender") return styles.pending;
        if (status === "Approved" || status === "In Approval") return styles.approve;
        if (status === "Reject") return styles.notUploaded;
        return styles.uploaded;
    };

    const summaryColumns = [
        { title: 'Uses Type', key: 'uses_type' },
        // { title: 'Total Project Total', key: 'total_project_total' },
        { title: 'Total Loan Budget', key: 'total_loan_budget' },

        { title: 'Total Original Loan Budget', key: 'total_original_loan_budget' },
        { title: 'Total Adjustments', key: 'total_adjustments' },
        { title: 'Total Revised Budget', key: 'total_revised_budget' },
        { title: 'Total Equity Budget', key: 'total_equity_budget' },


    ];

    const dark = JSON.parse(localStorage.getItem('darkTheme'));
    const formatNumberWithCommas = (number) => {
        if (number == null) return ""; // Return an empty string if number is null or undefined
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      };
    return (
        <>
        {isLoading ? (
          <div className={styles.loaderDiv}>
             <Loader />
          </div>
         
        ) : (
        <div className={styles.main}
        style={{
            backgroundColor: dark ? '#084c61' : 'white',         // Change text color based on the theme
          }}
        >
            <div className={styles.tableDiv}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead className={styles.stickyHeader}>
                            <tr className={styles.headRow}>
                                {summaryColumns.map((column, index) => (
                                    <th className={styles.th} key={index}>{column.title}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {summary.map((item, rowIndex) => (
                                <tr key={rowIndex}>
                                {summaryColumns.map((column, colIndex) => (
                                  <td className={styles.td} key={colIndex}>
                                    {formatNumberWithCommas(item[column.key])}
                                  </td>
                                ))}
                              </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mapping the document list in a table format */}
            <div>
                <div className={styles.docListHeading}>
                <h3 className={styles.heading}>Documents List</h3>

                </div>
                {Object.keys(documents).length > 0 ? (
    Object.keys(documents).map((category, index) => {
        // Filter documents where status is not 'Not Uploaded'
        const filteredDocuments = documents[category].filter((doc) => doc.status !== "Not Uploaded");

        // Conditionally render the table only if filteredDocuments has data
        return filteredDocuments.length > 0 ? (
            <div key={index}>
                <h4 className={styles.headingCategory} onClick={() => toggleCollapse(category)}>
                    {category} {collapsedCategories[category] ? '▼' : '▲'}
                </h4>
                {!collapsedCategories[category] && (
                    <table className={styles.table}>
                        <thead className={styles.stickyHeader}>
                            <tr className={styles.headRow}>
                                <th className={styles.th}>ID</th>
                                <th className={styles.th}>Document Name</th>
                                <th className={styles.th}>Document Type</th>
                                <th className={styles.th}>Document Comment</th>
                                <th className={styles.th}>File ID</th>
                                <th className={styles.th}>Status</th>
                                <th className={styles.th}>Loan ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDocuments.map((doc, docIndex) => (
                                <tr key={docIndex}>
                                    <td className={styles.td}>{doc.id}</td>
                                    <td className={styles.td}>{doc.document_name}</td>
                                    <td className={styles.td}>{doc.document_type}</td>
                                    <td className={styles.td}>{doc.document_comment ? doc.document_comment : 'N/A'}</td>
                                    <td className={styles.td}>{doc.file_id ? doc.file_id : 'N/A'}</td>
                                    <td className={`${styles.td} ${getStatusClass(doc.status)}`}>
                                        {doc.status}
                                    </td>
                                    <td className={styles.td}>{doc.loan}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        ) : null; // Don't render anything if there are no filtered documents
    })
) : (
    <p>No Document Checklist Available</p>
)}



            </div>

            
        </div>
        
      )}
      </>
    );
};
