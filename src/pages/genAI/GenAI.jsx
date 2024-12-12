import React, { useRef, useState } from 'react';
import StylesGeniAI from "./GenAI.module.css";
import { Button, message } from 'antd';
import { ArrowRightOutlined, LoadingOutlined } from '@ant-design/icons';
import attachIcon from "../../assets/sidebar/attachment.svg";
import { postFileUpload, postPromt, postSummary } from '../../services/api';
import { Loader } from '../../components/loader/Loder';
import copyIcon from "../../assets/sidebar/copy.svg"
import { jsPDF } from "jspdf";  

export const GenAI = ({
                    selectedFile,
                    setSelectedFile,
                    conversationHistory,
                    setConversationHistory,
                    promptInput,
                    setPromptInput,
                    loading,
                    setLoading,
                    isDragActive,
                    setIsDragActive,
                    fileInputRef,
                    isFileNameShow,
                    setIsFileNameShow,
                    isFileUploaded,
                    setIsFileUploaded,
}) => {
  
console.log(conversationHistory,"conversationHistory");

  const handleAttachClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const loadFile = async (file) => {
    if (file) {
      setLoading((prev) => ({ ...prev, fileUpload: true }));
      try {
        const res = await postFileUpload(file);
        if (res.status === 200) {
          message.success("File Uploaded");
          setIsFileUploaded(true)
        }
      } catch (error) {
        message.error(error.message);
        console.error(error,"ererer");
      } finally {
        setLoading((prev) => ({ ...prev, fileUpload: false }));
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        message.error("Only PDF files are allowed. Please upload a valid PDF file.");
        return; // Exit the function early
      }
      setSelectedFile(file);
      setIsFileNameShow(true)

      setConversationHistory([]);  // Clear previous conversation history
    setPromptInput("");          // Clear the prompt input
    setIsFileUploaded(false);

      loadFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setIsFileNameShow(true)
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        message.error("Only PDF files are allowed. Please upload a valid PDF file.");
        return; // Exit the function early
      }

      setSelectedFile(file);

      setConversationHistory([]);  // Clear previous conversation history
      setPromptInput("");          // Clear the prompt input
      setIsFileUploaded(false); 

      loadFile(file);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleSummary = async () => {
    setIsFileNameShow(false)
    setLoading((prev) => ({ ...prev, summary: true }));
    try {
      const res = await postSummary();
      if (res.status === 200) {
        const processedResponse = processResponse(res.data.response);
        setConversationHistory((prevHistory) => [
          ...prevHistory,
          { prompt: "Summary", response: processedResponse }
        ]);
      }
    } catch (error) {
      message.error("Error fetching summary");
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, summary: false }));
    }
  };

  const handlePromptChange = (e) => {
    setPromptInput(e.target.value);
  };

  const promtFunc = async () => {
    setLoading((prev) => ({ ...prev, prompt: true }));
    try {
      const res = await postPromt(promptInput);
      const processedResponse = processResponse(res.data.response);
      setConversationHistory((prevHistory) => [
        ...prevHistory,
        { prompt: promptInput, response: processedResponse }
      ]);
      setPromptInput("");
    } catch (error) {
      message.error("Error processing prompt");
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, prompt: false }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      promtFunc();
    }
  };

  const processResponse = (response) => {
    return response.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  };

  const dark = JSON.parse(localStorage.getItem('darkTheme'));

  const exportSummaryToPDF = (entry) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Summary Report', 10, 10);
    doc.text(`Prompt: ${entry.prompt}`, 10, 20);
    doc.text(`Response: ${entry.response.replace(/<\/?[^>]+(>|$)/g, "")}`, 10, 30);
    doc.save(`summary-${entry.prompt}.pdf`);
  };

  const handleClearBtn=()=>{
    setConversationHistory([]);  // Clear previous conversation history
    setPromptInput("");    
    setSelectedFile(null)  
    setIsFileUploaded(false)
  }
  
  const copyToClipboard = (entry) => {
    const textToCopy = `Prompt: ${entry.prompt}\nResponse: ${entry.response.replace(/<\/?[^>]+(>|$)/g, "")}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      message.success('Message copied to clipboard!');
    }).catch((error) => {
      message.error('Failed to copy message');
      console.error(error);
    });
  };
  
  return (
    <div
      className={`${StylesGeniAI.main} ${isDragActive ? StylesGeniAI.dragActive : ""}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      style={{
        backgroundColor: dark ? '#084c61' : 'white',
      }}
    >
      <div className={StylesGeniAI.Gpt}>
        {selectedFile &&  !isFileNameShow &&(
          <div className={StylesGeniAI.messageTopDiv}>
          <h3 style={{
                    color: dark ? 'white' : 'black',         
                  }}
           className={StylesGeniAI.messageFile}>{selectedFile.name}</h3>
           <Button onClick={handleClearBtn}  className={StylesGeniAI.filledBtn}>Clear</Button>
        </div>
        )}
        
        <div className={StylesGeniAI.responseDiv}>
          {loading.prompt || loading.summary || loading.fileUpload ? (
            <div className={StylesGeniAI.loaderDiv}>
              <Loader />
            </div>
            
          ) : conversationHistory.length > 0 ? (
            conversationHistory.map((entry, index) => (
              <div key={index} className={StylesGeniAI.welcomeMessage}>
                <div className={StylesGeniAI.EntryPrompt}>
                  <h4 className={StylesGeniAI.promtMessage}>{entry.prompt}</h4>
                </div>
                <div className={StylesGeniAI.messageResponseDiv}>
                  <div className={StylesGeniAI.summaryMessage} dangerouslySetInnerHTML={{ __html: entry.response }} />
                  <div  className={StylesGeniAI.pdfButtonDiv}>
                  <Button className={StylesGeniAI.btnExport} onClick={() => exportSummaryToPDF(entry)}>Export to PDF</Button>
                  <img
                    src={copyIcon}
                    onClick={() => copyToClipboard(entry)}
                    alt="Copy"
                    className={StylesGeniAI.imgCopy}
                  />

                  </div>  
                </div>
              </div>
            ))
          ) : (
            <div className={StylesGeniAI.welcomeMessage}>
              {selectedFile ? isFileNameShow&&(
                <h1 style={{
                  color: dark ? 'white' : 'black',         // Change text color based on the theme
                }}
                 className={StylesGeniAI.message}>{selectedFile.name}</h1>
              ) : (
                <>
                  <h1
                 style={{
                  color: dark ? 'white' : 'black',         // Change text color based on the theme
                }} 
                  className={StylesGeniAI.message}>Hello, User</h1>
                  <h1 style={{
                    color: dark ? 'white' : 'black',         // Change text color based on the theme
                  }}
                   className={StylesGeniAI.message}>Please select File</h1>
                  <p style={{
                    color: dark ? 'white' : 'black',         // Change text color based on the theme
                  }} 
                  className={StylesGeniAI.dragMessage}>or drag & drop file here (PDF file only)</p>
                </>
              )}
            </div>
          )}
        </div>
        <div className={StylesGeniAI.messageDiv}>
          <div className={StylesGeniAI.inputDiv}>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <img className={StylesGeniAI.img} src={attachIcon} onClick={handleAttachClick} alt="attach" />
            <input
              placeholder="Enter prompt here"
              className={StylesGeniAI.input}
              onChange={handlePromptChange}
              onKeyDown={handleKeyDown}
              style={{ color: "black" }}
              value={promptInput}
            />
            <div className={StylesGeniAI.arrowDiv} onClick={promtFunc}>
              {loading.prompt ? (
                <LoadingOutlined className={StylesGeniAI.icon} />
              ) : (
                <ArrowRightOutlined style={{ paddingLeft: "0.5rem" }} className={StylesGeniAI.icon} />
              )}
            </div>
          </div>
          <div className={StylesGeniAI.btnDivs}>
            <Button
              className={StylesGeniAI.filledBtn}
              onClick={handleSummary}
              loading={loading.summary}
              disabled={!isFileUploaded}
            >
              Summarize
            </Button>
           
          </div>
        </div>
      </div>
    </div>
  );
};
