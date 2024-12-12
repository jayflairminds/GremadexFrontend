import React, { useState } from 'react';
import styles from './LoanApplicationForm.module.css'; // Assuming you have a CSS module for styling
import { DatePicker, Select, Modal, Button, message } from 'antd';
import { useParams } from 'react-router-dom';
import { getProjectList, postProjectForm } from '../../services/api';

export const LoanApplicationForm = ({ projectAppModal, setProjectAppModal, setProjectData }) => {

  const [formData, setFormData] = useState({
    projectname: '',
    address: '',
    street_address: '',
    zip_Code: '',
    city: '',
    lot: '',
    block: '',
    state: '',
    project_type: ''
  });
  
  const [loader, setLoader] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setProjectAppModal(false);
  };

  const handleCancel = () => {
    setFormData({
      projectname: '',
      address: '',
      street_address: '',
      zip_Code: '',
      city: '',
      lot: '',
      block: '',
      state: '',
      project_type: ''
    });
    setProjectAppModal(false);
  };

  const handleTableProjectList = async () => {
    try {
      const res = await getProjectList();
      setProjectData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  console.log(formData,"data");
  
  const handleProjectFormSubmit = async () => {
    setLoader(true);
    console.log(formData,"insode");
    
    try {
      const res = await postProjectForm(formData);
      console.log(res);
      await handleTableProjectList();
      setProjectAppModal(false);
      message.success("Project Created");
      setFormData({
        projectname: '',
        address: '',
        street_address: '',
        zip_Code: '',
        city: '',
        lot: '',
        block: '',
        state: '',
        project_type: ''
      });
      setProjectAppModal(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  return (
    <Modal
      title="Create New Project"
      visible={projectAppModal}
      onCancel={handleCancel}
      footer={null}
      centered
    >
      <form className={styles.formDiv} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="projectname">Project Name:</label>
          <input
            type="text"
            id="projectname"
            name="projectname"
            value={formData.projectname}
            onChange={handleChange}
            required
            style={{color:"black"}}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            style={{color:"black"}}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="street_address">Street Address:</label>
          <input
            type="text"
            id="street_address"
            name="street_address"
            value={formData.street_address}
            onChange={handleChange}
            style={{color:"black"}}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="zip_Code">ZIP Code:</label>
          <input
            type="number"
            id="zip_Code"
            name="zip_Code"
            value={formData.zip_Code}
            onChange={handleChange}
            style={{color:"black"}}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            style={{color:"black"}}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="lot">Lot:</label>
          <input
            type="text"
            id="lot"
            name="lot"
            value={formData.lot}
            onChange={handleChange}
            style={{color:"black"}}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="block">Block:</label>
          <input
            type="text"
            id="block"
            name="block"
            value={formData.block}
            onChange={handleChange}
            style={{color:"black"}}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="state">State:</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            style={{color:"black"}}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="projectType">Project Type:</label>
          <Select
            id="projectType"
            name="projectType"
            value={formData.project_type}
            onChange={(value) => setFormData({ ...formData, project_type: value })}
            required
            style={{ width: "100%" }}
          >
            <Select.Option value="">Select Project Type</Select.Option>
            <Select.Option value="residential">Residential</Select.Option>
            <Select.Option value="commercial">Commercial</Select.Option>
            <Select.Option value="industrial">Industrial</Select.Option>
            <Select.Option value="hospitality">Hospitality</Select.Option>
          </Select>
        </div>
        <Button className={styles.submitButton} type="primary" onClick={handleProjectFormSubmit} loading={loader}>
          Submit
        </Button>
      </form>
    </Modal>
  );
};
