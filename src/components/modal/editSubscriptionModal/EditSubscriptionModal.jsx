import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, Checkbox, message } from 'antd';
import stylesEditSubModal from "./EditSubscriptionModal.module.css"
import { putSubscriptionPlan } from '../../../services/api';

export const EditSubscriptionModal = ({
  isEditSubscriptionModal,
  setIsEditSubscriptionModal,
  editDetails,
  listOfSubscription,
}) => {
  const [formData, setFormData] = useState({
    tier: '',
    loan_count: '',
    risk_metrics: false,
  });

  const[editLoader,setLoader]=useState(false)
  
  // Pre-fill the form data when `editDetails` changes
  useEffect(() => {
    if (editDetails) {
      setFormData({
        tier: editDetails.tier || '',
        loan_count: editDetails.loan_count || '',
        risk_metrics: editDetails.risk_metrics || false, 
      });
    }
  }, [editDetails]);

  const handleCancel = () => {
    setIsEditSubscriptionModal(false);
  };

  const handleSubmit = async () => {
    setLoader(true)
   try{
    const response = await putSubscriptionPlan(formData,editDetails?.id)
    if(response.status===200){
        message.success("Edited Successfully")
        listOfSubscription()
    }
   }catch(err){
    console.log(err);
    message.error("Something went wrong")
   }finally{
    setLoader(false)
    setIsEditSubscriptionModal(false)
   }
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  return (
    <Modal
      open={isEditSubscriptionModal}
      title="Edit Subscription"
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} 
        loading={editLoader}
        className={stylesEditSubModal.filledBtnAdd}>
          Submit
        </Button>,
      ]}
    >
        <div className={stylesEditSubModal.main}>
                <div >
                <label className={stylesEditSubModal.labelTag}>Tier:</label>
                <Input
                placeholder="Enter tier (e.g., Trial)"
                value={formData.tier}
                onChange={(e) => handleInputChange('tier', e.target.value)}
                className={stylesEditSubModal.inputTag}
                />
            </div>
            <div >
                <label className={stylesEditSubModal.labelTag}>Loan Count:</label>
                <Input
                type="number"
                placeholder="Enter loan count"
                value={formData.loan_count}
                onChange={(e) => handleInputChange('loan_count', e.target.value)}
                className={stylesEditSubModal.inputTag}
                />
            </div>
            <div className={stylesEditSubModal.checkboxDiv}>
            <label className={stylesEditSubModal.labelTag}>Metrics:</label>
                <Checkbox
                checked={formData.risk_metrics}
                onChange={(e) => handleInputChange('risk_metrics', e.target.checked)}
                >
                Is Active
                </Checkbox>
            </div>
        </div>
      
    </Modal>
  );
};
