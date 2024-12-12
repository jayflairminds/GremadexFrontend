import { Button, message, Modal, Select } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import stylesModal from "./ViewUploadFileModal.module.css"
import { useDropzone } from 'react-dropzone';
import { deleteFileDrawHistory, drawDocumentStatus, getFileList, getViewFileDrawRequest, statusDraw, uploadFileDrawHistory } from '../../../services/api';
import { Option } from 'antd/es/mentions';
export const ViewUploadFileModal = ({ isViewDocModal, setIsViewDocModal,selectedItem }) => {

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileList, setFileList] = useState([]);
    const[loading,setLoading]=useState(false)
    const[isStatus,IsSetStatus]=useState(false)
    const[selectedRowData,setSelectedRowData]=useState([])
    const [statusOptions, setStatusOptions] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const[drawDocId,setDrawDocId]=useState([])
    const[statusLoader,setStatusLoader]=useState(false)
    const [loadingView, setLoadingView] = useState({});
  const [loadingDownload, setLoadingDownload] = useState({});

    const role = localStorage.getItem('RoleType');
    const onDrop = useCallback((acceptedFiles) => {
      setSelectedFiles(acceptedFiles);
    }, []);
  
    const { getRootProps, getInputProps } = useDropzone({onDrop,
      accept: ['.csv', '.xlsx', '.pdf'], // Acceptable file types
      multiple: true, // Allow multiple file selection
    });
  
    const handleCancel = () => {
      setIsViewDocModal(false);
      setSelectedFiles([]); 
    };
  
    const handleFileUpload = async () => {
        if (selectedFiles.length > 0) {
          const formData = new FormData();
          
          // Append the first file and other form data
          formData.append('pdf_file', selectedFiles[0]);  // Only send the first selected file
          formData.append('doc_name', selectedFiles[0].name);  // You can customize the document name
          formData.append('loan_id', selectedItem.loan);  // Assuming loan_id comes from selectedItem
          formData.append('draw_request', selectedItem.draw_request);  // Assuming draw_request comes from selectedItem
          setLoading(true)
          try {
            const response = await uploadFileDrawHistory(formData);
            console.log('File upload response:', response);
            setIsViewDocModal(false)
            // getFileList()
            setSelectedFiles([]); 
          } catch (err) {
            console.error('File upload error:', err);
          }finally{
            setLoading(false)
            setSelectedFiles([]); 
        }
        } else {
          console.log('No files selected');
        }
      };
      
      const handleFileList =async()=>{
        try{
            const response = await getFileList(selectedItem.loan, selectedItem.draw_request)
            setFileList(response.data)
            
        }catch(err){
            console.log(err);
            
        }
      }
      useEffect(() => {
        // Check if selectedItem has required properties before calling
        if (isViewDocModal) {
            handleFileList();
        } else {
            console.log('selectedItem is not ready:', selectedItem); // Debugging line
        }
    }, [selectedItem,isViewDocModal]);

      const handleDownload = async (file_id, id,document_name) => {
        setLoadingDownload(file_id);
        setLoadingDownload(prev => ({ ...prev, [file_id]: true }));
        try {
          console.log("Downloading file with ID:", file_id);
          const res = await getViewFileDrawRequest(file_id,id); // Fetch file data from API
          
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
        }finally {
          setLoadingDownload(prev => ({ ...prev, [file_id]: false }));
        }
      };
      
      const handleView = async (file_id, id, document_name) => {
        setLoadingView(prev => ({ ...prev, [file_id]: true }));
        try {
          console.log("Downloading file with ID:", file_id);
          const res = await getViewFileDrawRequest(file_id, id); // Fetch file data from API
          console.log(res, "view");
      
          if (res && res.data && res.data.pdf_base64) {
            const base64Data = res.data.pdf_base64;
            console.log(base64Data, "base64Data");
      
            // Convert base64 to binary data
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
      
            // Determine MIME type based on file extension or content type
            let mimeType;
            if (document_name.endsWith(".pdf")) {
              mimeType = 'application/pdf';
            } else if (document_name.endsWith(".xlsx")) {
              mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            } else if (document_name.endsWith(".xls")) {
              mimeType = 'application/vnd.ms-excel';
            } else {
              message.error("Unsupported file type");
              return;
            }
      
            // Create Blob with correct MIME type
            const blob = new Blob([byteNumbers], { type: mimeType });
      
            // Create URL for the Blob
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.target = "_blank";  // Open the file in a new tab without downloading
      
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
        } finally {
          setLoadingView(prev => ({ ...prev, [file_id]: false }));
        }
      };
      


      const handleDelteFile = async(id)=>{
        try{
            
        const response = await deleteFileDrawHistory(id)
        if(response.status===204){
            handleFileList()
            message.success("File Deleted")
        }
        console.log(response);
        }catch(err){
            console.log(err);
            message.error("Something went wrong")
            
        }

        
      }
      const getStatusClass = (status) => {
        console.log(status,"sss");
        
        if (status === "Pending") return stylesModal.pending;
        if (status === "Not Uploaded" || status === "Rejected") return stylesModal.notUploaded;
        if (status === "In Review" || status === "Pending Lender") return stylesModal.pending;
        if (status === "Approved" || status === "Approve" || status === "In Approval") return stylesModal.approve;
        if (status === "Reject") return stylesModal.notUploaded;
        return stylesModal.uploaded;
      };
    
      const handleStatusClick=(file)=>{
        if(role !=="borrower"){
          IsSetStatus(true)
          handleOptions()
        }
        setDrawDocId(file.id)
        console.log(file,"filess");
        setSelectedRowData(file)
      }
      const handleCancelStatus=()=>{
        IsSetStatus(false)
        
      }
      const handleOptions =async() =>{
        try{
            const res = await statusDraw("draw-approval");
            setStatusOptions(res.data)
        }
        catch(err){
            console.log(err);
            
        }
      }
      const handleStatusChange = (value) => {
        setSelectedStatus(value); // Update the selected status in state
      };

      const handleStatusUpload = async () =>{
        setStatusLoader(true)
        try{
          const response = await drawDocumentStatus(selectedStatus,drawDocId)
          console.log(response.data);
          
        }catch(err){
          console.log(err);
          
          message.error(err.response.data.error)
        }
        finally{
          setStatusLoader(false)
          IsSetStatus(false)
        }
      }
  return (
    <div>
        <Modal
        title={
            <span style={{ color: '#909090', fontWeight: '500', fontSize: '14px', padding: '0 0 0 3%' }}>
              View/Upload Documents
            </span>
          }
          centered
          open={isViewDocModal}
          onCancel={handleCancel}
          width={'60%'}
          footer={[
            <div key="footer-buttons" className="px-4" style={{display:"flex",gap:"10px",justifyContent:"right"}}>
            <Button key="back" onClick={handleCancel} className={stylesModal.outlinedBtn}
           
            >
              Cancel
            </Button>
            <Button

              className={stylesModal.btnSummary}
              key="submit"
              type="button"
              onClick={handleFileUpload}
              loading={loading}
            >
              Upload
            </Button>
          </div>,
          
          ]}
        >
            <div>
                <div className={stylesModal.uploadHeadingDiv}>
                    <p className={stylesModal.uploadHeading}>Upload File</p>
                </div>
                <div className={stylesModal.visibleMain}>
                    <div className={stylesModal.visible}>
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
                <p className={stylesModal.supportHeading}>Supported file formats: CSV, XLSX, PDF</p>
              </div>
                    </div>
                </div>
                <div className={stylesModal.existingFileDiv}>
                <div  className={stylesModal.headingFiles} >
                  List of Uploaded Files
                </div>
                {/* <div className={stylesModal.inputSearch}>
                  <input type="text" placeholder="Search by file name" className={stylesModal.searchinputTag}/>
                </div> */}
                {/* {searchTerm === '' || displayFetchData.length > 0 ? ( */}
                  <div className={stylesModal.tableContainer}>
                  <table className={stylesModal.table}>
                        <thead>
                            <tr>
                            <th className={stylesModal.th}>Document Name</th>
                            <th className={stylesModal.th}>Uploaded At</th>
                            <th className={stylesModal.th}>Status</th>
                            <th className={stylesModal.th}>View</th>
                            <th className={stylesModal.th}>Download</th>
                            <th className={stylesModal.th}>Delete</th>
                            </tr>
                        </thead>
                                <tbody>
                                    {fileList.length > 0 ? (
                                    fileList.map((file) => (
                                        <tr key={file.id}>
                                        <td className={stylesModal.td}>{file.doc_name}</td>
                                        <td className={stylesModal.td}>{new Date(file.uploaded_at).toLocaleDateString()}</td>
                                        <td
                                          className={`${stylesModal.td} ${getStatusClass(file.status)}`}
                                          onClick={(e) => handleStatusClick(file, e)}
                                        >
                                          {file.status}
                                        </td>
                                        <td className={stylesModal.td}>
                                            <Button
                                            className={stylesModal.btnSummary} onClick={() => handleView(file.file_id, file.id,file.doc_name)} 
                                            loading={loadingView[file.file_id] || false}  
                                            >
                                            
                                            View
                                            </Button>
                                        </td>
                                        <td className={stylesModal.td}>
                                            <Button
                                              className={stylesModal.btnSummary}
                                             onClick={() => handleDownload(file.file_id, file.id,file.doc_name)}
                                             loading={loadingDownload[file.file_id] || false}  
                                            >
                                            Download
                                            </Button>
                                        </td>
                                        <td className={stylesModal.td}>
                                            <button
                                            className={stylesModal.deleteBtn}
                                            onClick={() => handleDelteFile(file.id)}
                                            >
                                            Delete
                                            </button>
                                        </td>
                                        </tr>
                                    ))
                                    ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center' }}>No files available</td>
                                    </tr>
                                    )}
                                </tbody>
                        </table>
                  </div>
                {/* ) : (
                  <div>No data available</div>
                )} */}
              </div>
            </div>
        </Modal>
        <Modal
         title={
          <span style={{ color: '#909090', fontWeight: '500', fontSize: '14px', padding: '0 0 0 3%' }}>
            
          </span>
        }
        centered
        open={isStatus}
        onCancel={handleCancelStatus}
        // width={'60%'}
        footer={[
          <div key="footer-buttons" className="px-4" style={{display:"flex",gap:"10px",justifyContent:"right"}}>
          <Button key="back" onClick={handleCancelStatus} className={stylesModal.outlinedBtn}
         
          >
            Cancel
          </Button>
          <Button

            className={stylesModal.btnSummary}
            key="submit"
            type="button"
            onClick={handleStatusUpload}
            loading={statusLoader}
          >
            Submit
          </Button>
        </div>,
        
        ]}>
          <div>
              {selectedRowData  && (
              <div className={stylesModal.statusDetails}>
                <p>
                  <strong>Update Status:</strong>
                  <Select value={selectedStatus} onChange={handleStatusChange} style={{ width: 200 }}>
                        {statusOptions.map((option) => (
                        <Option key={option} value={option}>
                            {option}
                        </Option>
                        ))}
                    </Select>
                </p>
                <p><strong>Document Name:</strong> {selectedRowData.doc_name}</p>
                <p><strong>File Name:</strong> {selectedRowData.file_name}</p>
                <p><strong>Status:</strong> {selectedRowData.status}</p>
                <p><strong>Uploaded at:</strong> {new Date(selectedRowData.uploaded_at).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </Modal>
    </div>
  )
}
