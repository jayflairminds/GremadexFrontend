import React, { useEffect, useState, useRef } from 'react';
import styles from './DocumentCheclist.module.css';
import { docTypeLoad, getDocumentRetrive } from '../../services/api';
import { Button, Select } from 'antd'; // Import Select from Ant Design
import deleteIcon from "../../assets/navbar/delete.svg";

const { Option } = Select; // Ant Design Select Option

export const DocumentChecklist = ({ loanId }) => {
  const [docTypes, setDocTypes] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(null); // Track selected document ID
  const [fileName, setFileName] = useState('');
  const [fileUpload, setFileUpload] = useState(null);
  const [dragActive, setDragActive] = useState(false); // For drag-and-drop state
  const [data, setData] = useState([]); // Data from API
  const [dropdownOptions, setDropdownOptions] = useState([]); // To store options for the dropdown
  const fileInputRef = useRef(null); // Ref to reset file input

  const getDocTypeLoad = async () => {
    const response = await getDocumentRetrive(loanId);
    setData(response.data); // Set API response data
    const dataObject = Object.keys(response.data.output); // Extract keys from the API response
    setDocTypes(dataObject); // Set document types based on API data
  };

  console.log(docTypes, "doc");
  console.log(data, "Data from API");

  // Handle radio button change
  const handleRadioChange = async (docType) => {
    setSelectedDocId(docType);

    // Find the relevant categories based on the selected document type
    if (data.output && data.output[docType]) {
      const relevantCategories = Object.keys(data.output[docType]); // Get keys for relevant categories
      setDropdownOptions(relevantCategories); // Set the dropdown options
    } else {
      setDropdownOptions([]); // Clear dropdown if no categories found
    }
    // Add similar logic for other document types (e.g., project-related)
  };

  // Handle file upload
  const handleFileUpload = (file) => {
    if (file) {
      setFileUpload(file);
      setFileName(file.name);
      getDocTypeLoad(); // Load document types after file upload
    }
  };

  // Handle file input change (regular upload)
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    handleFileUpload(file);
  };

  // Handle drag-and-drop events
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true); // Add class for visual feedback
  };

  const handleDragLeave = () => {
    setDragActive(false); // Remove drag class when leaving drop area
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files[0];
    handleFileUpload(file);
  };

  // Handle file deletion
  const handleDeleteFile = () => {
    setFileName(''); // Clear the file name
    setFileUpload(null); // Reset file upload state
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input field
    }
  };
console.log(dropdownOptions,"drop");

  return (
    <div className={styles.main}>
      <div
        className={`${styles.uploadDiv} ${dragActive ? styles.active : ''}`} 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {fileName ? ( 
          <div className={styles.fileNameDiv}>
            <h3 className={styles.message}>Uploaded: {fileName}</h3>
            <img src={deleteIcon} className={styles.img} onClick={handleDeleteFile}/>
            <Button className={styles.filledBtn}>Generate Summary</Button>
          </div>
        ) : (
          <label htmlFor="fileUpload">
            <>
              <h1 className={styles.message}>Hello, User</h1>
              <h1 className={styles.message}>Please select File</h1>
              <p className={styles.message}>or drag & drop file here</p>
            </>
          </label>
        )}
        
        <input
          type="file"
          id="fileUpload"
          ref={fileInputRef} // Attach ref to input element
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
        />
      </div>
        
      {fileName && (
        <div className={styles.labelDivMain}>
          <p className={styles.pTagName}>Please Select: </p>
          <div className={styles.labelDiv}>
            {docTypes.map((docType, index) => (
              <div className={styles.labelDiv} key={index}>
                <label>
                  <input
                    type="radio"
                    value={docType}
                    checked={selectedDocId === docType}
                    onChange={() => handleRadioChange(docType)}
                  />
                  <p className={styles.pTag}>{docType}</p>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedDocId === "bank-related" && (
        <div className={styles.dropdownDiv}>
          <Select
           showSearch
            placeholder="Select a category"
            style={{ width: 200 }}
            optionFilterProp="children" // The property to filter the options
            filterSort={(optionA, optionB) =>
              optionA.children.localeCompare(optionB.children) // Sort options alphabetically
            }
          >
            {dropdownOptions && dropdownOptions.length > 0 ? (
              dropdownOptions.map((option, index) => (
                <Option key={index} value={option}>
                  {option}
                </Option>
              ))
            ) : (
              <Option disabled>No options available</Option>
            )}
          </Select>
        </div>
      )}
    </div>
  );
};
