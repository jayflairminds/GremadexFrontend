 import React, { useState } from 'react';
import { Button, Modal, Input, DatePicker, Checkbox, message } from 'antd';
import dayjs from 'dayjs';
import { postInsertSubscription } from '../../../services/api';
import style from "./AddSubscriptionModal.module.css"

export const AddSubscriptionModal = ({ isAddSubscriptionModal, setIsAddSubscriptionModal,listOfSubscription }) => {
  const [formData, setFormData] = useState({
    tier: '',
    loan_count: '',
    created_at: '',
    updated_at: '',
    is_active: false,
  });
  const[loader,setLoader]=useState(false)
  const handleCancel = () => {
    setIsAddSubscriptionModal(false);
  };

  const handleSubmit = async () => {
    setLoader(true)
    try{
      const response = await postInsertSubscription(formData)
      if(response.status===200){
        message.success("Added Successfully")
      }
      console.log(response);
      
    }catch(err){
      console.log(err);
      
    }finally{
      setLoader(false)
      setIsAddSubscriptionModal(false)
      listOfSubscription()
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  return (
    <Modal
      open={isAddSubscriptionModal}
      title="Add Subscription"
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} loading={loader} className={style.filledBtnAdd}>
          Add
        </Button>,
      ]}
      width={900}
    >
      <div className={style.main}>
      <div >
        <label className={style.label}>Tier:</label>
        <Input
          placeholder="Enter tier (e.g., Trial)"
          value={formData.tier}
          onChange={(e) => handleInputChange('tier', e.target.value)}
          style={{color:"black"}}
        />
      </div>
      <div className={style.dateDiv}>
      <label className={style.label}>Loan Count:</label>
        <Input
          type="number"
          placeholder="Enter loan count"
          value={formData.loan_count}
          onChange={(e) => handleInputChange('loan_count', e.target.value)}
          className={style.inputTag}
        />

        <label className={style.label}>Created At:</label>
        <DatePicker
          value={formData.created_at ? dayjs(formData.created_at) : null}
          onChange={(date) => handleInputChange('created_at', date ? date.format('YYYY-MM-DD') : '')}
        />
         <label className={style.label}>Updated At:</label>
        <DatePicker
          value={formData.updated_at ? dayjs(formData.updated_at) : null}
          onChange={(date) => handleInputChange('updated_at', date ? date.format('YYYY-MM-DD') : '')}
        />
      </div>
      
      <div className={style.checkboxDiv}>
        <label className={style.label}>Metrics:</label>
        <Checkbox
          checked={formData.is_active}
          onChange={(e) => handleInputChange('is_active', e.target.checked)}
        >
          Is Active
        </Checkbox>
      </div>
      </div>
      
    </Modal>
  );
};
