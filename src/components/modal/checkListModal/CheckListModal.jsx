import React, { useState, useEffect } from 'react';
import { Modal, Checkbox, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import stylesModal from './CheckListModal.module.css';
import { insertUsers, uploadBudget } from '../../../services/api';
import AddIcon from "../../../assets/navbar/add.svg"
import SampleFile from "../../../assets/templateFile/budget.xlsx"

export const CheckListModal = ({ isCheckListModal, setIsCheckListModal, checkList, loadId }) => {
  const [checkedItems, setCheckedItems] = useState({});
  const [selectAll, setSelectAll] = useState({});
  const [loader, setLoader] = useState(false);
  const [uploadOption, setUploadOption] = useState(''); // State to manage the upload option
  const [fileUpload, setFileUpload] = useState(null);   // State for the uploaded file
  const [fileName, setFileName] = useState('');         // State for the uploaded file name
  const navigate = useNavigate();
  
  // Initialize state with all checkboxes set to false
  useEffect(() => {
    if (!checkList) return; // Guard against undefined checkList
  
    const initialCheckedState = {};
    const initialSelectAllState = {};
  
    Object.entries(checkList).forEach(([category, items]) => {
      items.forEach((item) => {
        initialCheckedState[`${category}_${item.use}`] = false; // Use a composite key for uniqueness
      });
      initialSelectAllState[category] = false; // Initialize selectAll for each category
    });
  
    setCheckedItems(initialCheckedState);
    setSelectAll(initialSelectAllState);
  }, [checkList]);

  // Handle individual checkbox change
  const handleCheckboxChange = (category, item) => {
    const key = `${category}_${item.use}`;
    setCheckedItems((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  // Handle "Select All" checkbox change
  const handleSelectAllChange = (category) => {
    const newSelectAllState = !selectAll[category];
    const updatedCheckedState = { ...checkedItems };
  
    checkList[category].forEach((item) => {
      const key = `${category}_${item.use}`;
      updatedCheckedState[key] = newSelectAllState;
    });
  
    setCheckedItems(updatedCheckedState);
    setSelectAll((prevState) => ({
      ...prevState,
      [category]: newSelectAllState,
    }));
  };
  

  // Function to format the selected items into the desired structure
  const formatCheckedItems = () => {
    const formattedData = {
      loan_id: loadId, // Include the loadId in the formatted data
      Uses: {}
    };

    Object.entries(checkList).forEach(([category, items]) => {
      // Filter items where the checkbox is checked
      const selectedItems = items.filter((item) => {
        const key = `${category}_${item.use}`;
        return checkedItems[key] || item.is_locked;
      });// Construct composite key and check state
  
      // Add the category to the result only if there are selected items
      if (selectedItems.length > 0) {
        formattedData.Uses[category] = selectedItems.map((item) => item.use); // Only include the `use` property
      }
    });

    return formattedData;
  };

  // Function to handle OK button click
  const handleOk = async () => {
    if (uploadOption === 'checklist') {
      const formattedData = formatCheckedItems();
      console.log('Formatted Data:', formattedData);
      setLoader(true);
      try {
        const res = await insertUsers(formattedData);
        if (res.status === 201) {
          navigate('/dashboard');
        }
        console.log(res);
      } catch (err) {
        console.log(err);
      } finally {
        setLoader(false);
        setUploadOption("")
      }
    } else {
      try{
        const response = await uploadBudget(fileUpload, loadId);
        console.log(response);
        if (response.status === 201) {
          navigate('/dashboard');
        }
      }
      catch(err){
        console.log(err);
      }
      console.log("File uploaded successfully");
      setUploadOption("");
    }

    setIsCheckListModal(false);
  };

  // Function to handle Cancel button click
  const handleCancel = () => {
    setIsCheckListModal(false);
    setUploadOption("");
  };

  // Function to handle file upload and set the file name
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Uploaded file:", file);
      message.success("File Uploaded");
      setFileUpload(file);
      setFileName(file.name); // Set the file name
    }
  };

  return (
    <div>
      <Modal
        title="Checklist Modal"
        open={isCheckListModal}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Close
          </Button>,
          <Button key="submit" className={stylesModal.filledIn} onClick={handleOk} loading={loader}>
            Apply
          </Button>
        ]}
      >
        <div>
          <div className={stylesModal.radioDiv}>
            <label style={{color:"black", cursor:"pointer"}}>
              <input
                type="radio"
                value="checklist"
                checked={uploadOption === 'checklist'}
                onChange={() => setUploadOption('checklist')}
                style={{cursor:"pointer"}}
              />
              <p className={stylesModal.pTagOne}>Use Checklist</p>
              {/* Use Checklist */}
            </label>
            <label style={{color:"black"}}>
              <input
                type="radio"
                value="upload"
                checked={uploadOption === 'upload'}
                onChange={() => setUploadOption('upload')}
                style={{cursor:"pointer"}}
              />
              <p className={stylesModal.pTagOne}>Upload Excel File</p>
              
            </label>
          </div>

          {/* Render checklist if selected */}
          {uploadOption === 'checklist' && Object.entries(checkList).map(([category, items]) => (
            <div className={stylesModal.contentDiv} key={category}>
              <div className={stylesModal.checboxDiv}>
                <h3 style={{ paddingBottom: "1rem" }}>{category}</h3>
                <Checkbox
                  checked={selectAll[category]}
                  onChange={() => handleSelectAllChange(category)}
                  style={{ paddingLeft: "1.2rem", paddingBottom: "0.3rem" }}
                >
                  <p className={stylesModal.headingP}>Select All in {category}</p>
                </Checkbox>
              </div>
              {items.map((item, idx) => (
                <div className={stylesModal.checboxDiv} key={`${category}_${idx}`} style={{ marginLeft: '20px', marginBottom: '10px' }}>
                  <Checkbox
                    checked={checkedItems[`${category}_${item.use}`] || item.is_locked} 
                    onChange={() => handleCheckboxChange(category, item)}
                    disabled={item.is_locked}
                  >
                    <span className={stylesModal.spanTag}>{item.use}</span>
                  </Checkbox>
                </div>
              ))}
            </div>
          ))}

          {/* Render file upload option if selected */}
          {uploadOption === 'upload' && (
            <div>
              <div style={{padding:"1rem 0 1rem 0"}}>
              <a className={stylesModal.herfTag} href={SampleFile} rel="noopener noreferrer" download="budget.xlsx">Refer to the sample file to see an example of the format required</a>

              </div>
   
              <label htmlFor="fileUpload">
              <div className={stylesModal.uploadDiv}>
                <img src={AddIcon} className={stylesModal.addImg} />
                <p className={stylesModal.pTag}>
                  {fileName ? `Uploaded: ${fileName}` : 'Upload Only Excel File'}
                </p>
                <input
                  type="file"
                  id="fileUpload"
                  accept=".xlsx, .xls"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
              </div>
            </label>
            </div>
            
          )}
        </div>
      </Modal>
    </div>
  );
};

