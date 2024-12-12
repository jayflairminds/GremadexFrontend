import { Modal, Button, Input, Select, DatePicker } from 'antd';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import styleEditProject from './EditProjectModal.module.css';
import { getProjectList, updateProject } from '../../../services/api';

export const EditProjectModal = ({ editProjectData, setIsEditModal, isEditModal ,setProjectData}) => {
 let EditId = editProjectData.id
  
  const [formData, setFormData] = useState({
    projectname: '',
    address: '',
    startdate: null,
    enddate: null,
    project_type: ''
  });

  // Initialize formData when editProjectData changes
  useEffect(() => {
    if (editProjectData) {
      setFormData({
        projectname: editProjectData.projectname || '',
        address: editProjectData.address || '',
        startdate: editProjectData.startdate ? moment(editProjectData.startdate) : null,
        enddate: editProjectData.enddate ? moment(editProjectData.enddate) : null,
        project_type: editProjectData.project_type || 'residential'
      });
    }
  }, [editProjectData]);

  const handleCancel = () => {
    setIsEditModal(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date, field) => {
    setFormData({ ...formData, [field]: date });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, project_type: value });
  };

  const handleTableProjectList = async () => {
    try {
      const res = await getProjectList();
      console.log(res,"resspro");
      
      setProjectData(res.data);
    } catch (err) {
      console.log(err);
    }
  };


  const handleSave = async() => {
    try {
        console.log('Updated project data:', formData);
        const res = await updateProject(EditId, formData); 
        handleTableProjectList()
        console.log(res);
        setIsEditModal(false);
      } catch (error) {
        console.error('Error updating project:', error);
      }
    
    setIsEditModal(false);
  };

  return (
    <Modal
      title="Edit Project"
      open={isEditModal}
      onCancel={handleCancel}
      footer={
        <div className={styleEditProject.fotterDiv}>
             <Button key="back" onClick={handleCancel} className={styleEditProject.submitButton}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSave} className={styleEditProject.submitButton}>
          Update
        </Button>
        </div>
       
      }
      centered
    >
      <div className={styleEditProject.formDiv}>
        <form>
          <div className={styleEditProject.formGroup}>
            <label>Project Name</label>
            <Input
              name="projectname"
              value={formData.projectname}
              onChange={handleInputChange}
              placeholder="Enter project name"
              className={styleEditProject.input}
              style={{color:"black"}}
            />
          </div>
          <div className={styleEditProject.formGroup}>
            <label>Address</label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter address"
              className={styleEditProject.input}
              style={{color:"black"}}
            />
          </div>
          {/* <div className={styleEditProject.formGroup}>
            <label>Start Date</label>
            <DatePicker
              value={formData.startdate}
              onChange={(date) => handleDateChange(date, 'startdate')}
              className={styleEditProject.input}
              style={{ width: "100%" }}
            />
          </div>
          <div className={styleEditProject.formGroup}>
            <label>End Date</label>
            <DatePicker
              value={formData.enddate}
              onChange={(date) => handleDateChange(date, 'enddate')}
              className={styleEditProject.input}  style={{ width: "100%" }}
            />
          </div> */}
          <div className={styleEditProject.formGroup}>
            <label>Project Type</label>
            <Select
              value={formData.project_type}
              onChange={handleSelectChange}
              className={styleEditProject.input}  style={{ width: "100%" }}
            >
              <Select.Option value="residential">Residential</Select.Option>
              <Select.Option value="commercial">Commercial</Select.Option>
              <Select.Option value="industrial">Industrial</Select.Option>
              <Select.Option value="hospitality">Hospitality</Select.Option>
            </Select>
          </div>
        </form>
      </div>
    </Modal>
  );
};
