import React, { useEffect, useState } from 'react';
import styles from './Summary.module.css';
import { Button, message, Select } from 'antd'; // Import Ant Design's Select component
import { applicationStatus, budget_summary, exportBudget, postSubmitSummary, putLoanApproval } from '../../services/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'; // Import html2canvas
import * as XLSX from 'xlsx';

const { Option } = Select;

export const Summary = ({ loanId, loanDetailsId }) => {
  const [summary, setSummary] = useState([]);
  const [approvalOptions, setApprovalOptions] = useState([]);
  const [selectedApproval, setSelectedApproval] = useState('');
  const [loader, setLoader] = useState(false);

  const usesTypeMapping = {
    hard_cost: 'Hard Cost',
    acquisition_cost: 'Acquisition Cost',
    soft_cost: 'Soft Cost',
  };

  const getSummary = async () => {
    try {
      const res = await budget_summary(loanId);
      setSummary(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getApprovalList = async () => {
    try {
      const response = await applicationStatus('loan-approval');
      setApprovalOptions(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSummary();
    getApprovalList();
  }, [loanId]);

  const summaryColumns = [
    { title: 'Uses Type', key: 'uses_type' },
    { title: 'Total Original Loan Budget', key: 'total_original_loan_budget' },
    { title: 'Total Adjustments', key: 'total_adjustments' },
    { title: 'Total Revised Budget', key: 'total_revised_budget' },
    { title: 'Total Equity Budget', key: 'total_equity_budget' },
    { title: 'Total Loan Budget', key: 'total_loan_budget' },
    
    { title: "Total Funded Percentage", dataIndex: "total_funded_percentage", key: "total_funded_percentage" },
    { title: "Total Remaining To Fund", dataIndex: "total_remaining_to_fund", key: "total_remaining_to_fund" },
  ];

  const handleSubmitSummary = async () => {
    setLoader(true);
    try {
      const response = await postSubmitSummary(loanId);
      message.success('Submitted');
      console.log(response);
    } catch (err) {
      console.log(err);
      message.error('Loan can only be submitted when status is Pending or Rejected');
    } finally {
      setLoader(false);
    }
  };

  const UserRole = localStorage.getItem('RoleType');
  console.log(UserRole, 'RoleType');

  const handleApprovalChange = async (value) => {
    setSelectedApproval(value);
    try {
      const response = await putLoanApproval(value, loanId);
      console.log(response);
      message.success('Updated Status');
    } catch (err) {
      console.log(err);
      message.error('The loan status is already being processed.');
    }
  };

  // Function to export the summary as a PDF in black and white
  const handleExportPDF = () => {
    message.success("PDF Generated");
    const input = document.getElementById('summary-table'); // Get the table div

    // Apply a grayscale filter before capturing
    html2canvas(input).then((canvas) => {
      const ctx = canvas.getContext('2d');
      const imgData = canvas.toDataURL('image/png');

      // Convert image to grayscale manually by updating canvas pixels
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const imageData = ctx.getImageData(0, 0, imgWidth, imgHeight);
      const pixels = imageData.data;

      // Loop through all pixels and convert them to grayscale
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        // Convert to grayscale using luminance formula
        const grayscale = r * 0.3 + g * 0.59 + b * 0.11;
        pixels[i] = pixels[i + 1] = pixels[i + 2] = grayscale; // Set R, G, B to the grayscale value
      }

      // Put the grayscale data back to canvas
      ctx.putImageData(imageData, 0, 0);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(canvas.toDataURL('image/png'));
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('summary.pdf');
    });
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(summary); // Convert summary data to a worksheet
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Summary'); // Append the worksheet to the workbook
  
    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, 'summary.xlsx');
  };

  const handleExportChange = (value) => {
    switch (value) {
      case 'pdf':
        handleExportPDF();
        break;
      case 'excel':
        handleExportExcel();
        break;
      default:
        break;
    }
  };
  const downloadFile = (response, fileName) => {
    // Define the MIME type for Excel
    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url); // Clean up the URL
    document.body.removeChild(a);
};

  
  const handleExport = async (value) => {
    const fileMap = {
      pdf: 'Budget.pdf',
      excel: 'Budget.xlsx',
      csv: 'Budget.csv',
    };
  
    if (fileMap[value]) {
      const response = await exportBudget(value, loanId);
      if (response.status === 200) {
        message.success(`${fileMap[value].split('.').pop().toUpperCase()} File Downloaded`);
        downloadFile(response.data, fileMap[value]);
      }
    }
  };
  const formatNumberWithCommas = (number) => {
    if (number == null) return ""; // Return an empty string if number is null or undefined
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  return (
    <div className={styles.main}>
      <div className={styles.btnDiv}>
      <Select
          placeholder="Export Options"
          onChange={handleExport}
          options={[
            { value: 'pdf', label: 'Export to PDF' },
            { value: 'excel', label: 'Export to Excel' },
            { value:'csv', label:'Export to CSV'}
          ]}
        />
      </div>
      <div className={styles.tableDiv}>
        <div className={styles.tableContainer} id="summary-table">
          {/* Add id to the div to capture this content for PDF */}
          <table className={styles.table}>
            <thead className={styles.stickyHeader}>
              <tr className={styles.headRow}>
                {summaryColumns.map((column, index) => (
                  <th className={styles.th} key={index}>
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summary.map((item, rowIndex) => (
                 <tr key={rowIndex}>
                 {summaryColumns.map((column, colIndex) => (
                   <td className={styles.td} key={colIndex}>
                     {column.key === 'uses_type'
                       ? usesTypeMapping[item[column.key]] || item[column.key]
                       : column.key === 'loan_budget' || column.key === 'revised_budget' || column.key === 'remaining_to_fund'
                       ? formatNumberWithCommas(item[column.key])
                       : formatNumberWithCommas(item[column.key])}
                   </td>
                 ))}
               </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {UserRole === 'borrower' && loanDetailsId?.status === 'Pending' && (
        <div className={styles.ButtonContainer}>
          <Button loading={loader} onClick={handleSubmitSummary} className={styles.btn}>
            Submit
          </Button>
        </div>
      )}

      {  UserRole=== "inspector" && loanDetailsId?.status ==="In Review" &&(
              <div className={styles.ButtonContainer}>
                <p className={styles.pTag}>Update Status:</p>
                <Select
                  value={selectedApproval}
                  onChange={handleApprovalChange}
                  placeholder="Select Action"
                  className={styles.dropdown}
                  style={{ width: 200 }}
                >
                  {approvalOptions.map((option, index) => (
                    <Option key={index} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </div>
            )}

      {UserRole === 'lender'  && loanDetailsId?.status ==="In Approval" &&(
        <div className={styles.ButtonContainer}>
          <p className={styles.pTag}>Update Status:</p>
          <Select
            value={selectedApproval}
            onChange={handleApprovalChange}
            placeholder="Select Action"
            className={styles.dropdown}
            style={{ width: 200 }}
          >
            {approvalOptions.map((option, index) => (
              <Option key={index} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </div>
      )}

    </div>
  );
};
