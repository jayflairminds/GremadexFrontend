import React, { useEffect, useState } from 'react';
import styleBudget from "./LoanAppComp.module.css";
import { Button, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { deleteProject, getProjectList } from '../../services/api';
import { LoanApplicationForm } from '../loanApplicationForm/LoanApplicationForm';
import { EditProjectModal } from '../../components/modal/editProjectModal/EditProjectModal';
import { Loader } from '../../components/loader/Loder';

const projectColumns = [
  { title: "ID", key: "id" },
  { title: "Project Name", key: "projectname" },
  { title: "Address", key: "address" },
  // { title: "Start Date", key: "startdate" },
  // { title: "End Date", key: "enddate" },
  { title: "Project Type", key: "project_type" },
  { title: "User ID", key: "user" },
  { title: "Edit", key: "edit" }, 
  { title: "Delete", key: "delete" },
  { title: "Apply Loan", key: "ApplyLoan" }
];

export const LoanAppCom = () => {
  const [projectData, setProjectData] = useState([]);
  const [projectAppModal, setProjectAppModal] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // State for controlling modal visibility
  const [selectedProjectId, setSelectedProjectId] = useState(null); // State for storing the selected project ID
  const [loaderDelete,setLoaderDelete]=useState(false)
  const[isEditModal,setIsEditModal]=useState(false)
  const[editProjectData,setEditProjectData]=useState([])
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleTableProjectList = async () => {
    setIsLoading(true)
    try {
      const res = await getProjectList();
      setProjectData(res.data);
    } catch (err) {
      console.log(err);
    }finally{
      setIsLoading(false)
    }
  };

  useEffect(() => {
    handleTableProjectList();
  }, []);

  const handleEdit = (project) => {
    console.log("Edit project:", project.id);
    setIsEditModal(true)
    setEditProjectData(project)
    // Implement edit functionality here
  };

  const handleDeleteClick = (projectId) => {
    setSelectedProjectId(projectId); // Store the selected project ID
    setIsDeleteModalVisible(true); // Show the delete confirmation modal
  };

  const handleDelete = async () => {
    setLoaderDelete(true)
    try {
     await deleteProject(selectedProjectId);
      message.success("Project is deleted");
      handleTableProjectList(); 
    } catch (err) {
      console.log(err);
    } finally {
      setIsDeleteModalVisible(false); // Close the modal after deletion
      setLoaderDelete(false)
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false); // Close the modal without deleting
  };

  const handleApplyLoan = (projectId) => {
    navigate(`/loan-application-form/${projectId}`);
  };

  const dark = JSON.parse(localStorage.getItem('darkTheme'));
  return (
    <div  className={styleBudget.main}>
    {isLoading ? (
      <div className={styleBudget.loaderDiv}>
         <Loader />
      </div>
     
    ) : (
    <div className={styleBudget.main}
    //  style={{ padding: "0rem 0 0 1rem", height: "100vh", overflow: "auto" }}
    style={{
      backgroundColor: dark ? '#084c61' : 'white',         // Change text color based on the theme
    }}
    >
      <div className={styleBudget.headingDiv}>  
        <LoanApplicationForm 
          setProjectAppModal={setProjectAppModal} 
          projectAppModal={projectAppModal} 
          setProjectData={setProjectData} 
        />
        <div className={styleBudget.btnDiv}>
        <Button className={styleBudget.filledBtn} onClick={() => setProjectAppModal(true)}>Add new project</Button>
        </div>
      </div>
      <div className={styleBudget.tableDiv}>
        <div className={styleBudget.tableContainer}>
        {projectData && projectData.length > 0 ? (
  <table className={styleBudget.table}>
    <thead className={styleBudget.stickyHeader}>
      <tr className={styleBudget.headRow}>
        {projectColumns.map((column, index) => (
          <th className={styleBudget.th} key={index}>{column.title}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {projectData.map((project, rowIndex) => (
        <tr key={rowIndex}>
          {projectColumns.map((column, colIndex) => (
            <td className={styleBudget.td} key={colIndex}>
              {column.key === "startdate" || column.key === "enddate"
                ? new Date(project[column.key]).toLocaleDateString()
                : column.key === "edit" ? (
                  <button
                    className={styleBudget.applyLoan}
                    onClick={() => handleEdit(project)}
                  >
                    Edit
                  </button>
                ) : column.key === "delete" ? (
                  <button
                    className={styleBudget.deleteBtn}
                    onClick={() => handleDeleteClick(project.id)}
                  >
                    Delete
                  </button>
                ) : column.key === "ApplyLoan" ? (
                  <button
                    className={styleBudget.applyLoan}
                    onClick={() => handleApplyLoan(project.id)}
                  >
                    Apply Loan
                  </button>
                ) : (
                  project[column.key]
                )}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
          ) : (
            <div className={styleBudget.noProjectMessage}>
              <p>No projects created yet.</p>
            </div>
          )}

        </div>
      </div>
      <Modal
  title="Confirm Deletion"
  open={isDeleteModalVisible}
  onCancel={handleCancelDelete} 
  footer={[
        <Button key="back" onClick={handleCancelDelete}>
          No
        </Button>,
        <Button 
            key="submit" 
            type="primary"  
            className={styleBudget.deleteBtn} 
            onClick={handleDelete} 
            loading={loaderDelete}
          >
        Yes
      </Button>
  ]}
>
  <p>Are you sure you want to delete this project?</p>
</Modal>  
  <EditProjectModal setIsEditModal={setIsEditModal} isEditModal={isEditModal} editProjectData={editProjectData}   setProjectData={setProjectData}/>
    </div>
    )}
    </div>
  );
};
