import React, { useEffect, useState } from "react";
import { deleteDocManagement, docTypeLoad, getListOfDoc, getViewFile, postDocManagement, SummaryDoc } from "../../services/api";
import stylesD from "./DocUpload.module.css";
import { DocUpdateStatusModal } from "../modal/docUpdateStatus/DocUpdateStatusModal";
import classNames from "classnames";
import { Button, message, Select } from "antd";
import { SummarizeModal } from "../modal/summarizeModal/SummarizeModal";
import { Loader } from "../loader/Loder";
import { DocUploadComments } from "../modal/docUploadComments/DocUploadComments";


const { Option } = Select;

export const DocUpload = ({ loanId }) => {
  const [documentList, setDocumentList] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [docUploadStatusModal, setDocUploadStatusModal] = useState(false);
  const [selectedData, setSelecetedData] = useState(null);
  const [docTypes, setDocTypes] = useState([]);
  const [documentHeadingList, setDocumentHeadingList] = useState([]);
  const [openSections, setOpenSections] = useState({}); // State to manage section visibility\
  const[isSummaryModal,setIsSummaryModal]=useState(false)
  const[summaryResponse,setSummaryResponse]=useState([])
  const[selectedDocument,setSelecetedDocument]=useState([])
  const [isLoading, setIsLoading] = useState(false);
  const[isCommentModal, setIsCommentModal]=useState(false)
  const[documentCommentId,setDocumentCommentId]=useState([])
  const[documentNameSub,setDocumentNameSub]=useState([])
  const[documentTypeSub,setDocumentTypeSub]=useState([])
  const[loader,setLoader]=useState(false)
  const [loadingDelete, setLoadingDelete] = useState({});
  const[loadingViewFile,setLoadingViewFile]=useState({})
  const[loadingDownloadFile,setLoadingDownloadFile]=useState({})
  const role = localStorage.getItem('RoleType');
  useEffect(() => {
    // getFileList();
    getDocTypeLoad();
  }, []);

  const getFileList = async (value) => {
    const res = await getListOfDoc(loanId, value);
    setDocumentList(res.data);
    setDocumentHeadingList(Object.keys(res.data)); // Update headings based on fetched data
  };

  const getDocTypeLoad = async () => {
    const response = await docTypeLoad(loanId);
    setDocTypes(response.data);
    if (response.data.length > 0) {
      const defaultDocType = response.data[0];
      setSelecetedDocument(defaultDocType.document_type);
      getFileList(response.data[0].id); // Automatically select the first option
    }
  };

  const handleUpload = async (event, doc) => {
    
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("pdf_file", file);
      formData.append("loan", loanId);
      formData.append("document_detail_id", doc.document_detail);
      setLoader(true)
      try {
        await postDocManagement(formData);
        message.success("File Uploaded");
        getFileList();
      } catch (error) {
        message.error("Something Went Wrong")
        console.error("Upload error:", error);
      }finally{
        setLoader(false)
      }
    }
  };

  const handleDelete = async (document_detail) => {
    console.log(document_detail,"doc");
    setLoadingDelete(prev => ({ ...prev, [document_detail]: true }));
    try {
      await deleteDocManagement(document_detail);
      message.success("File Deleted");
      getFileList();
    } catch (error) {
      console.error("Error deleting file:", error);
      message.error("Failed to delete file");
    }finally{
      setLoadingDelete(prev => ({ ...prev, [document_detail]: false }));
    }
  };

  const handleStatusClick = (doc) => {
    setSelecetedData(doc);
    setSelectedRow(doc.document_detail);
    setSelectedId(doc.id);
    setDocUploadStatusModal(true);
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleString() : "Not Uploaded";
  };

  const getStatusClass = (status) => {
    if (status === "Pending") return stylesD.pending;
    if (status === "Not Uploaded" || status === "Rejected") return stylesD.notUploaded;
    if (status === "In Review" || status === "Pending Lender") return stylesD.pending;
    if (status === "Approved" || status === "Approve") return stylesD.approve;
    if (status === "Reject") return stylesD.notUploaded;
    return stylesD.uploaded;
  };

  const handleRowClick = (rowIndex, doc) => {
    setSelectedRow(documentList[rowIndex].document_detail);
    setSelectedId(documentList[rowIndex].id);
  };

  const handleSectionToggle = (heading) => {
    setOpenSections(prev => ({
      ...prev,
      [heading]: !prev[heading] // Toggle the section
    }));
  };

  const handleSelectChange = (value,option) => {
    getFileList(value);
    setSelecetedDocument(option.children);
  };

  const handleSummaryClick = async(fileID) => {
    
    setIsLoading(true)
    try{
      const res = await SummaryDoc(fileID)
      if(res.status===200){
        const processedResponse = processResponse(res.data.summary.summary);
        setSummaryResponse(processedResponse)
        setIsSummaryModal(true)
      }

    }
    catch(err){
      console.log(err);
    }
    finally{
      setIsLoading(false)
    }
  };

  const processResponse = (response) => {
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
  
  const handleView = async (id,file_id, document_name) => {
    setLoadingViewFile(prev => ({ ...prev, [id]: true }));
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
  
        // Open in a new tab
        link.target = "_blank";  // This will open the file in a new tab
  
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
      setLoadingViewFile(prev => ({ ...prev, [id]: false }));
    }
  };
  
  const handleCommentsModal=(doc)=>{
    setDocumentNameSub(doc.document_name)
    setDocumentTypeSub(doc.document_type)
    setDocumentCommentId(doc.id)
    setIsCommentModal(true)
    
  }

  const dark = JSON.parse(localStorage.getItem('darkTheme'));
  return (
    <>
      {loader ? (
        <div className={stylesD.loaderDiv}>
           <Loader />
        </div>
       
      ) : (
    <div className={stylesD.main}
    style={{
      backgroundColor: dark ? '#084c61' : 'white',         // Change text color based on the theme
    }}
    >
      <div className={stylesD.selectDiv}>
        <Select
          style={{ width: "10%" }}
          onChange={handleSelectChange}
          placeholder="Select Document Type"
          defaultValue={docTypes.length > 0 ? docTypes[0].id : undefined}
        >
          {docTypes.map((doc) => (
            <Option key={doc.id} value={doc.id}>
              {doc.document_type}
            </Option>
          ))}
        </Select>
      </div>
        {isLoading ? (
        <div className={stylesD.loaderDiv}>
         <Loader />
        </div>
 
) : (
  <SummarizeModal
    isSummaryModal={isSummaryModal}
    setIsSummaryModal={setIsSummaryModal}
    summaryResponse={summaryResponse}
  />
)}
{!loader &&(
      <div className={stylesD.tableDiv}>
        <h3 className={stylesD.heading} 
        style={{
          color: dark ? 'white' : 'black',         // Change text color based on the theme
        }}
        >{selectedDocument} Document Checklist</h3>
        {documentHeadingList?.map((heading, index) => (
          <div key={index} className={stylesD.headingSection}>
            <div className={stylesD.headigDiv}>
            <h3 onClick={() => handleSectionToggle(heading)} className={stylesD.headingTitle}>
              {heading} {openSections[heading] ? '▲' : '▼'}
            </h3>
            </div>
            
            {openSections[heading] && (
              <div className={stylesD.tableContainer}>
                <table className={stylesD.table}>
                  <thead className={stylesD.stickyHeader}>
                    <tr className={stylesD.headRow}>
                      <th className={stylesD.th}>Document Name</th>
                      <th className={stylesD.th}>Status</th>
                      <th className={stylesD.th}>Comments</th>
                      <th className={stylesD.th}>Uploaded At</th>
                      {role === "borrower" && <th className={stylesD.th}>Upload</th>}
                      <th className={stylesD.th}>Download</th>
                      <th className={stylesD.th}>View</th>
                      {role === "borrower" && <th className={stylesD.th}>Delete</th>}
                      <th className={stylesD.th}>Summary</th> 
                    </tr>
                  </thead>
                  <tbody>
                    {documentList[heading]?.map((doc, rowIndex) => (
                      <tr 
                        key={rowIndex}
                        className={rowIndex === selectedRow ? stylesD.selectedRow : ''} 
                        onClick={() => handleRowClick(rowIndex, doc)}
                      >
                        <td className={stylesD.td}>{doc.document_name}</td>
                        <td className={stylesD.td}>
                          <button
                            className={classNames(stylesD.statusBtn, getStatusClass(doc.status))}
                            onClick={() => handleStatusClick(doc)}
                          >
                            {doc.status}
                          </button>
                        </td>
                        
                        <td className={stylesD.td}>
                          <button onClick={()=>handleCommentsModal(doc)}  className={stylesD.filledBtn}>
                            View Comments
                          </button>
                        </td>
                        <td className={stylesD.td}>{formatDate(doc.uploaded_at)}</td>
                        {role === "borrower" && (
                          <td className={stylesD.td}>
                            <button
                              className={stylesD.filledBtn}
                              onClick={() => document.querySelector(`.fileInput-${rowIndex}`).click()}
                            >
                              Upload
                            </button>
                            <input
                              type="file"
                              className={`fileInput-${rowIndex}`}
                              onChange={(event) => handleUpload(event, doc)}
                              style={{ display: "none" }}
                            />
                          </td>
                        )}
                        <td className={stylesD.td}>
                          <Button onClick={() => handleDownload(doc.id,doc.file_id, doc.document_name)}
                           loading={loadingDownloadFile[doc.id] || false}
                          className={stylesD.filledBtn}>
                            Download
                          </Button>
                        </td>
                        <td className={stylesD.td}>
                        <Button
                          onClick={() => handleView(doc.id,doc.file_id, doc.document_name)}
                          loading={loadingViewFile[doc.id] || false} 
                          className={stylesD.filledBtn}
                        >
                          View
                        </Button>
                        </td>
                        {/* <td className={stylesD.td}>{doc.document_comment}</td> */}
                        {role === "borrower" && (
                          <td className={stylesD.td}>
                            <Button
                              className={stylesD.deleteBtn}
                              onClick={() => {
                                setSelectedRow(doc.document_detail);
                                handleDelete(doc.id);
                              }}
                              loading={loadingDelete[doc.id] || false}
                            >
                              Delete
                            </Button>
                          </td>
                        )}
                         <td className={stylesD.td}> 
                         <button  onClick={() => handleSummaryClick(doc.id)} className={stylesD.filledBtn}>
                          Summary
                        </button>

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
        <DocUpdateStatusModal
          getFileList={getFileList}
          docUploadStatusModal={docUploadStatusModal}
          setDocUploadStatusModal={setDocUploadStatusModal}
          selectedData={selectedData}
        />
     

     </div>
     )}

     <DocUploadComments isCommentModal={isCommentModal} setIsCommentModal={setIsCommentModal} documentCommentId={documentCommentId}
     documentNameSub ={documentNameSub}
     documentTypeSub={documentTypeSub}
     />
    </div>
    )}
    </>
  );
};
