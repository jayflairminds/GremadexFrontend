import { Button, Checkbox, Modal, message } from 'antd';
import React, { useState, useEffect } from 'react';
import styleEditUses from "./EditUsesModal.module.css";
import { updateUses } from '../../../services/api';

export const EditUsesModal = ({ 
  isEditModal, 
  setIsEditModal, 
  listOfUses, 
  editDetails 
}) => {
    const [loader, setLoader] = useState(false);
    const [checkLock, setCheckLock] = useState(editDetails.is_locked || false); // Pre-fill checkbox based on `is_locked`
    const [updatedName, setUpdatedName] = useState(editDetails.uses || ""); // Pre-fill input with `uses`

    // Update state when modal opens with new details
    useEffect(() => {
        if (editDetails) {
            setCheckLock(editDetails.is_locked || false);
            setUpdatedName(editDetails.uses || "");
        }
    }, [editDetails]);

    const handleCancel = () => {
        setIsEditModal(false);
        setCheckLock(editDetails.is_locked || false); // Reset checkbox state
        setUpdatedName(editDetails.uses || ""); // Reset input value
    };

    const handleSave = async () => {
        setLoader(true); // Show loader during API call
        try {
            const response = await updateUses(checkLock, updatedName, editDetails.id); // Use `editDetails.id`
            console.log(response);

            if (response.status === 200) {
                message.success("Uses updated successfully!");
                setIsEditModal(false); // Close the modal
                listOfUses(); // Refresh the list
            } else {
                message.error("Failed to update uses.");
            }
        } catch (err) {
            console.error(err);
            message.error("An error occurred while updating uses.");
        } finally {
            setLoader(false); // Hide loader
        }
    };

    return (
        <Modal
            title="Edit Uses"
            open={isEditModal}
            onCancel={handleCancel}
            footer={
                <div className={styleEditUses.footerDiv}>
                    <Button
                        key="back"
                        onClick={handleCancel}
                        className={styleEditUses.submitButton}
                    >
                        Cancel
                    </Button>
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleSave}
                        loading={loader} // Show loader on the update button
                        className={styleEditUses.filledBtn}
                    >
                        Update
                    </Button>
                </div>
            }
            centered
        >
            <div className={styleEditUses.main}>
                <input
                    value={updatedName} // Set input value
                    className={styleEditUses.inputTag}
                    onChange={(e) => setUpdatedName(e.target.value)} // Update state on input change
                />
                <Checkbox 
                    checked={checkLock} 
                    onChange={(e) => setCheckLock(e.target.checked)} // Update state on checkbox change
                >
                    Do you want to keep it as locked?
                </Checkbox>
            </div>
        </Modal>
    );
};
