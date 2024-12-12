import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Modal, Select, Button, message } from 'antd';
import stylesManger from './FileManagementInterface.module.css';
import { getAssestList, getDocumentList, postDocManagement, uploadFileDrawHistory } from '../../services/api';

const { Option } = Select;

export const FileManagementInterface = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loanData, setLoanData] = useState([]);
  const [documentData, setDocumentData] = useState({});
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDrawRequestId, setSelectedDrawRequestId] = useState(null);
  const[selectedChecklist,setSelectedChecklist]=useState(null)
  const[documentDetailId,setDocumentDetailId]=useState(null)
  const[loader,setLoader]=useState(false)

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFiles(acceptedFiles);
    setIsModalOpen(true); // Open modal when files are selected
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ['.csv', '.xlsx', '.pdf'], // Acceptable file types
    multiple: true, // Allow multiple file selection
  });

  // Fetch loan data when the modal is opened
  useEffect(() => {
    if (isModalOpen) {
      const fetchAssestList = async () => {
        try {
          const response = await getAssestList();
          setLoanData(response.data || []);
        } catch (error) {
          console.error('Error fetching loan data:', error);
        }
      };

      fetchAssestList();
    }
  }, [isModalOpen]);

  // Handle project selection change
  const handleSelectChange = async (value) => {
    const selectedLoan = loanData.find((loan) => loan.projectname === value);
    if (selectedLoan) {
      setSelectedLoanId(selectedLoan.loanid);
      try {
        const response = await getDocumentList(selectedLoan.loanid);
        setDocumentData(response.data || {});
        setSelectedCategory(null); // Reset category on project change
      } catch (error) {
        console.error("Error fetching document data:", error);
      }
    }
  };

  // Handle document category change
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    console.log("Selected category:", value);
  };

  // Handle draw request selection
  const handleDrawRequestChange = (value) => {
    console.log(value,"valuye");
    
    setSelectedDrawRequestId(value);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedFiles([]); // Clear selected files if necessary
    setDocumentData({}); // Clear document data when closing modal
    setSelectedCategory(null); // Reset category when closing modal
    setSelectedDrawRequestId(null); // Reset draw request
  };

  // Handle file upload and form submission
  const handleSubmit = async () => {
    if (selectedFiles.length === 0 || !selectedDrawRequestId || !selectedLoanId) {
      console.error('Missing required fields!');
      return;
    }

    const formData = new FormData();
    const file = selectedFiles[0];

    formData.append('pdf_file', file);
    formData.append('doc_name', file.name);
    formData.append('loan_id', selectedLoanId);
    formData.append('draw_request', selectedDrawRequestId);
    setLoader(true)
    try {
      const response = await uploadFileDrawHistory(formData);
        
      if (response.ok) {
        const result = await response.json();
        console.log('File uploaded successfully:', result);
        handleModalClose(); // Close modal after successful upload
      } else {
        console.error('Error uploading file:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }finally{
      setLoader(false)
    }
  };

  const handleUpload = async () => {
    
    const file = selectedFiles[0]
    if (file) {
      const formData = new FormData();
      formData.append("pdf_file", file);
      formData.append("loan", selectedLoanId);
      formData.append("document_detail_id", documentDetailId);
      setLoader(true)
      try {
        await postDocManagement(formData);
        message.success("File Uploaded");
      } catch (error) {
        message.error("Something Went Wrong")
        console.error("Upload error:", error);
      }finally{
        setLoader(false)
      }
    }
  }; 
  

  return (
    <div className={stylesManger.main}>
      <div className={stylesManger.visibleMain}>
        <div className={stylesManger.visible}>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <div>
              <span>
                <b>
                  {selectedFiles.length
                    ? selectedFiles.map((file) => file.name).join(', ')
                    : 'Drag and drop files here, or'}
                </b>
              </span>
              <span
                style={{
                  color: '#3B7DDD',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  marginLeft: '5px',
                }}
              >
                Browse
              </span>
            </div>
            <p className={stylesManger.supportHeading}>
              Supported file formats: CSV, XLSX, PDF
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
  title="Select a Project"
  visible={isModalOpen}
  onCancel={handleModalClose}
  footer={
    selectedCategory === 'document_checklist' ? (
      <Button
        key="add"
        type="primary"
        onClick={handleUpload}
        className={stylesManger.btn}
        loading={loader}
        // onClick={() => {
        //   console.log('Loan ID:', selectedLoanId); 
        //   if (selectedFiles.length > 0) {
        //     console.log('PDF File:', selectedFiles[0].name);
        //   } else {
        //     console.error('No file selected!');
        //   }
        //   console.log('Document Detail ID:', documentDetailId); 
        // }}
      >
        Add
      </Button>
    ) : (
      <Button
      loading={loader}
      className={stylesManger.btn} key="submit" type="primary" onClick={handleSubmit}>
        Add
      </Button>
    )
  }
>
  <div>
    <Select
      style={{ width: 300 }}
      placeholder="Select a project"
      onChange={handleSelectChange}
      showSearch
      filterSort={(optionA, optionB) =>
        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
      }
    >
      {loanData.map((loan) => (
        <Option key={loan.loanid} value={loan.projectname}>
          {loan.projectname}
        </Option>
      ))}
    </Select>
  </div>

  {/* Display document categories if document data is available */}
  {Object.keys(documentData).length > 0 && (
    <div style={{ marginTop: 16 }}>
      <h3>Select a Category</h3>
      <Select
        style={{ width: 300, marginBottom: 16 }}
        placeholder="Select a category"
        onChange={handleCategoryChange}
      >
        {Object.keys(documentData).map((key) => (
          <Option key={key} value={key}>
            {key.replace(/_/g, ' ').toUpperCase()}
          </Option>
        ))}
      </Select>
    </div>
  )}

  {/* Display draw requests if 'draw_documents' is selected */}
  {selectedCategory === 'draw_documents' && (
    <div style={{ marginTop: 16 }}>
      <h3>Select Draw Request</h3>
      <Select
        style={{ width: 300 }}
        placeholder="Select Draw Request"
        onChange={handleDrawRequestChange}
      >
        {documentData.draw_documents?.map((draw) => (
          <Option key={draw.draw_request} value={draw.draw_request}>
            Draw Request {draw.draw_request}
          </Option>
        ))}
      </Select>
    </div>
  )}

  {/* Display document checklist if 'document_checklist' is selected */}
  {/* Display document checklist if 'document_checklist' is selected */}
{selectedCategory === 'document_checklist' && documentData.document_checklist && (
  <div style={{ marginTop: 16 }}>
    <h3>Select a Document Category</h3>
    <Select
      style={{ width: 300 }}
      placeholder="Select a category"
      onChange={(value) => {
        console.log('Selected category:', value);
        setSelectedChecklist(value); // Save the selected value
      }}
    >
      {Object.keys(documentData.document_checklist).map((category) => (
        <Option key={category} value={category}>
          {category}
        </Option>
      ))}
    </Select>
  </div>
)}

{/* Dropdown for document names */}
{selectedChecklist && documentData?.document_checklist?.[selectedChecklist] ? (
  <div style={{ marginTop: 16 }}>
    <h3>Select a Document</h3>
    <Select
      style={{ width: 300 }}
      placeholder="Select a document"
      onChange={(value) => {
        setDocumentDetailId(value);
        console.log('Selected document:', value);
      }}
    >
      {documentData?.document_checklist[selectedChecklist]?.map((document) => (
        <Option key={document.id} value={document.document_detail}>
          {document.document_name.trim()}
        </Option>
      ))}
    </Select>
  </div>): (
  <p style={{ color: '' }}></p>
)}

</Modal>


    </div>
  );
};
