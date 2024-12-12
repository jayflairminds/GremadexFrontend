import React, { useEffect, useState } from 'react';
import { Button, message, Select } from 'antd';
import { getAssestList, getDocumentList, getViewFile } from '../../services/api';
import styles from './ViewDocumentComponent.module.css';
import { SummarizeModal } from '../modal/summarizeModal/SummarizeModal';

const { Option } = Select;

export const ViewDocumentComponent = ({isSummaryModal,setIsSummaryModal}) => {
    const [loanData, setLoanData] = useState([]);
    const [selectedLoanId, setSelectedLoanId] = useState(null);
    const [documentData, setDocumentData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [openSections, setOpenSections] = useState({});
  const[loadingDownloadFile,setLoadingDownloadFile]=useState({})
  const[loadingViewFile,setLoadingViewFile]=useState({})
  const[valueSelectedVersion,setValueSelectedVersion]=useState("")

    useEffect(() => {
        const fetchAssestList = async () => {
            try {
                const response = await getAssestList();
                setLoanData(response.data || []);
            } catch (error) {
                console.error("Error fetching loan data:", error);
            }
        };

        fetchAssestList();
    }, []);

    const handleSelectChange = async (value) => {
        const selectedLoan = loanData.find((loan) => loan.projectname === value);
        if (selectedLoan) {
            setSelectedLoanId(selectedLoan.loanid);
            try {
                const response = await getDocumentList(selectedLoan.loanid);
                setDocumentData(response.data || {});
            } catch (error) {
                console.error("Error fetching document data:", error);
            }
        }
    };

    const handleCategoryChange = (value) => {
        setValueSelectedVersion(value)
        if (value === 'document_checklist') {
            const data = documentData[value];
            setCategoryData(Array.isArray(data) ? data : Object.values(data).flat());
            // setCategoryData(documentData[value] || []);
        } else if (value === 'draw_documents') {
            setValueSelectedVersion(value)
            setCategoryData(documentData[value]?.map((draw) => ({
                ...draw,
                documents: draw.documents || [],
            })) || []);
        }
    };

    const handleSectionToggle = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleView = async (doc) => {
        console.log(doc,"doc");
        
        setLoadingViewFile(prev => ({ ...prev, [doc.id]: true }));
        try {
          console.log("Downloading file with ID:", doc.file_id);
          const res = await getViewFile(doc.file_id); 
          
          if (res && res.data && res.data.pdf_base64) {
            const base64Data = res.data.pdf_base64;
      
            // Convert base64 to binary data
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const blob = new Blob([byteNumbers], { type: 'application/pdf' });
      
            // Create a URL for the Blob
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
      
            // Open in a new tab
            link.target = "_blank";  // This will open the file in a new tab
      
            // Set the file name using either content-disposition header or document_name from response
            let fileName = doc.file_name; // Default file name
          
            const contentDisposition = res.headers['content-disposition'];
            if (contentDisposition) {
              const matches = /filename="(.+)"/.exec(contentDisposition);
              if (matches != null && matches[1]) {
                fileName = matches[1];
              }
            } else if (res.data.document_name) {
              fileName = res.data.document_name; // Use document_name from response if available
            }
      
            // Attach the link to the document body temporarily to open the file
            document.body.appendChild(link);
            link.click();
      
            // Cleanup after opening
            window.URL.revokeObjectURL(url);
            link.remove();
            message.success("File opened successfully in a new tab");
          } else {
            message.error("Failed to open the file");
          }
        } catch (error) {
          console.error("Error opening file:", error);
          message.error("Error opening the file");
        }finally{
          setLoadingViewFile(prev => ({ ...prev, [doc.id]: false }));
        }
      };

      const handleDownload = async (id,file_id, document_name) => {
        setLoadingDownloadFile(prev => ({ ...prev, [id]: true }));
        
        try {
          console.log("Downloading file with ID:", file_id);
          const res = await getViewFile(file_id); // Fetch file data from API
          
          if (res && res.data && res.data.pdf_base64) {
            const base64Data = res.data.pdf_base64;
        
            // Convert base64 to binary data
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const blob = new Blob([byteNumbers], { type: 'application/pdf' });
        
            // Create a URL for the Blob
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
        
            // Set the file name using either content-disposition header or document_name from response
            let fileName = document_name; // Default file name
        
            const contentDisposition = res.headers['content-disposition'];
            if (contentDisposition) {
              const matches = /filename="(.+)"/.exec(contentDisposition);
              if (matches != null && matches[1]) {
                fileName = matches[1];
              }
            } else if (res.data.document_name) {
              fileName = res.data.document_name; // Use document_name from response if available
            }
        
            // Trigger download with the correct file name
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
        
            // Cleanup after download
            window.URL.revokeObjectURL(url);
            link.remove();
            message.success("File downloaded successfully");
          } else {
            message.error("Failed to download the file");
          }
        } catch (error) {
          console.error("Error downloading file:", error);
          message.error("Error downloading the file");
        }finally{
          setLoadingDownloadFile(prev => ({ ...prev, [id]: false }));
        }
      };
      
      const handleViewChecklist = async (doc) => {

        console.log(doc,"doc");
        
        setLoadingViewFile(prev => ({ ...prev, [doc.id]: true }));
        try {
          console.log("Downloading file with ID:", doc.file_id);
          const res = await getViewFile(doc.file_id); 
          
          if (res && res.data && res.data.pdf_base64) {
            const base64Data = res.data.pdf_base64;
      
            // Convert base64 to binary data
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const blob = new Blob([byteNumbers], { type: 'application/pdf' });
      
            // Create a URL for the Blob
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
      
            // Open in a new tab
            link.target = "_blank";  // This will open the file in a new tab
      
            // Set the file name using either content-disposition header or document_name from response
            let fileName = doc.file_name; // Default file name
          
            const contentDisposition = res.headers['content-disposition'];
            if (contentDisposition) {
              const matches = /filename="(.+)"/.exec(contentDisposition);
              if (matches != null && matches[1]) {
                fileName = matches[1];
              }
            } else if (res.data.document_name) {
              fileName = res.data.document_name; // Use document_name from response if available
            }
      
            // Attach the link to the document body temporarily to open the file
            document.body.appendChild(link);
            link.click();
      
            // Cleanup after opening
            window.URL.revokeObjectURL(url);
            link.remove();
            message.success("File opened successfully in a new tab");
          } else {
            message.error("Failed to open the file");
          }
        } catch (error) {
          console.error("Error opening file:", error);
          message.error("Error opening the file");
        }finally{
          setLoadingViewFile(prev => ({ ...prev, [doc.id]: false }));
        }
      };

      const processResponse = (response) => {
        if (!response) {
          return "No summary available";
        }
      
        console.log(response, "gb");
      
        setIsSummaryModal(true);
        // Convert bold text surrounded by double asterisks to <strong> tags
        let processedResponse = response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
        // Replace new lines with <br> tags for line breaks
        processedResponse = processedResponse.replace(/\n\n/g, '<br><br>');
      
        // Replace single new lines with <br> tags
        processedResponse = processedResponse.replace(/\n/g, '<br>');
      
        // Add new line after remaining asterisks
        processedResponse = processedResponse.replace(/\*/g, '<br>');
      
        return processedResponse;
      };
      
      

    return (
        <div className={styles.main}>
          <div className={styles.selectDiv}>
          <h3 style={{color:"white"}}>Select a Project: </h3>
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
           

            {Object.keys(documentData).length > 0 && (
                <div  className={styles.selectDiv} style={{ marginTop: 16 }}>
                    <h3 style={{color:"white"}}>Select a Category</h3>
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

            {categoryData.length > 0 && documentData['document_checklist']&& valueSelectedVersion==="document_checklist"&&(
                <div  style={{ marginTop: 16 }}>
                    <h3 style={{color:"white",display:"flex", justifyContent:"center",paddingBottom:"1rem"}}>Documents in Selected Category</h3>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead className={styles.stickyHeader}>
                                <tr className={styles.headRow}>
                                    <th className={styles.th}>ID</th>
                                    <th className={styles.th}>Document Name</th>
                                    <th className={styles.th}>Document Type</th>
                                    <th className={styles.th}>Status</th>
                                    <th className={styles.th}>File Name</th>
                                    <th className={styles.th}>Loan ID</th>
                                    <th className={styles.th}>View File</th>
                                    <th className={styles.th}>Download</th>
                                    <th className={styles.th}>Summary</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoryData.map((doc) => (
                                    <tr key={doc.id}>
                                        <td className={styles.td}>{doc.id}</td>
                                        <td className={styles.td}>{doc.document_name}</td>
                                        <td className={styles.td}>{doc.document_type}</td>
                                        <td className={styles.td}>{doc.status}</td>
                                        <td className={styles.td}>{doc.file_name || 'N/A'}</td>
                                        <td className={styles.td}>{doc.loan}</td>
                                        <td  className={styles.td}>
                                                        <Button  className={styles.filledBtn}
                                                         onClick={() => handleViewChecklist(doc)}
                                                        loading={loadingViewFile[doc.id] || false} 
                                                        disabled={doc.status === 'Not Uploaded'}
                                                        >
                                                            View
                                                        </Button>
                                        </td>

                                        <td className={styles.td}>
                                                        <Button onClick={() => handleDownload(doc.id,doc.file_id, doc.fileName)}
                                                        loading={loadingDownloadFile[doc.id] || false}
                                                        className={styles.filledBtn}
                                                        disabled={doc.status === 'Not Uploaded'}>
                                                            Download
                                                        </Button>
                                        </td>
                                        <td className={styles.td}>
                                            <Button className={styles.filledBtn}
                                            onClick={() => {
                                              const processedSummary = processResponse(doc?.summary?.summary);
                                              console.log("Processed Summary:", processedSummary);
                                            }}
                                            disabled={doc.status === 'Not Uploaded'}
                                          >
                                            Summary
                                          </Button>
                                        </td>
                                        

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {categoryData.length > 0 && documentData['draw_documents'] && valueSelectedVersion==="draw_documents"&&(
                <div>
                    {categoryData.map((draw, index) => (
                        <div key={index} className={styles.headingSection}>
                            <div className={styles.headigDiv}>
                                <h3
                                    onClick={() => handleSectionToggle(draw.id)}
                                    className={styles.headingTitle}
                                >
                                    {`Draw ID: ${draw.id}`} {openSections[draw.id] ? '▲' : '▼'}
                                </h3>
                            </div>
                            {openSections[draw.id] && (
                                <div className={styles.tableContainer}>
                                    <table className={styles.table}>
                                        <thead className={styles.stickyHeader}>
                                            <tr className={styles.headRow}>
                                                <th className={styles.th}>ID</th>
                                                <th className={styles.th}>Document Name</th>
                                                <th className={styles.th}>File Name</th>
                                                <th className={styles.th}>Uploaded At</th>
                                                <th className={styles.th}>Status</th>
                                                <th className={styles.th}>User</th>
                                                <th className={styles.th}>View File</th>
                                                <th className={styles.th}>Download</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {draw.documents.map((doc) => (
                                                <tr key={doc.id}>
                                                    <td  className={styles.td}>{doc.id}</td>
                                                    <td  className={styles.td}>{doc.doc_name}</td>
                                                    <td  className={styles.td}>{doc.file_name}</td>
                                                    <td  className={styles.td}>{doc.uploaded_at}</td>
                                                    <td  className={styles.td}>{doc.status}</td>
                                                    <td  className={styles.td}>{doc.user}</td>
                                                    <td  className={styles.td}>
                                                        <Button 
                                                         onClick={() => handleView(doc)}
                                                        loading={loadingViewFile[doc.id] || false} 
                                                        >
                                                            View
                                                        </Button>
                                                    </td>

                                                    <td className={styles.td}>
                                                        <Button onClick={() => handleDownload(doc.id,doc.file_id, doc.fileName)}
                                                        loading={loadingDownloadFile[doc.id] || false}
                                                        className={styles.filledBtn}>
                                                            Download
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

        <SummarizeModal
            isSummaryModal={isSummaryModal}
            setIsSummaryModal={setIsSummaryModal}
            summaryResponse={processResponse}
          />
        </div>
    );
};
