import React, { useState } from "react";
import stylesAddUses from "./AddUsesModal.module.css";
import { Button, Modal, Select, Input, Checkbox, message } from "antd";
import { postAddUses } from "../../../services/api";
export const AddUsesModal = ({isAddUses,setIsAddUses,listOfUses}) => {
    const [projectType, setProjectType] = useState("");
    const [usesType, setUsesType] = useState("");
    const [uses, setUses] = useState("");
    const [checkLock, setCheckLock] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleCancel=()=>{
        setIsAddUses(false)
    }

    const handleSave = async () => {
        if (!projectType || !usesType || !uses) {
            message.error("Please fill all required fields!");
            return;
        }

        setLoading(true);
        try {

            const response = await postAddUses(projectType,usesType,uses,checkLock)
            if(response.status===201){
                message.success("Uses Added")
                listOfUses()
            }
        } catch (error) {
            message.error("Failed to connect to the server!");
        } finally {
            setLoading(false);
            setIsAddUses(false)

        }
    };
  return (
    <Modal
    title="Add Uses"
    open={isAddUses}
    onCancel={handleCancel}
    footer={
        <div className={stylesAddUses.footerDiv}>
            <Button
                key="back"
                onClick={handleCancel}
                className={stylesAddUses.submitButton}
            >
                Cancel
            </Button>
            <Button
                key="submit"
                type="primary"
                onClick={handleSave}
                loading={loading}
                className={stylesAddUses.filledBtn}
            >
                Add 
            </Button>
        </div>
    }
    centered
>
    <div className={stylesAddUses.main}>
        {/* Project Type */}
        <div className={stylesAddUses.formItem}>
            <label>Project Type:</label>
            <Select
                id="projectType"
                name="projectType"
                required
                value={projectType}
                onChange={(value) => setProjectType(value)}
                style={{ width: "100%" }}
            >
                <Select.Option value="">Select Project Type</Select.Option>
                <Select.Option value="residential">Residential</Select.Option>
                <Select.Option value="commercial">Commercial</Select.Option>
            </Select>
        </div>

        {/* Uses Type */}
        <div className={stylesAddUses.formItem}>
            <label>Uses Type:</label>
            <Select
                id="usesType"
                name="usesType"
                required
                value={usesType}
                onChange={(value) => setUsesType(value)}
                style={{ width: "100%" }}
            >
                <Select.Option value="">Select Uses Type</Select.Option>
                <Select.Option value="Acquisition cost">Acquisition Cost</Select.Option>
                <Select.Option value="Soft cost">Soft Cost</Select.Option>
                <Select.Option value="Hard cost">Hard Cost</Select.Option>
            </Select>
        </div>

        {/* Uses */}
        <div className={stylesAddUses.formItem}>
            <label>Uses:</label>
            <Input
                id="uses"
                name="uses"
                required
                value={uses}
                onChange={(e) => setUses(e.target.value)}
                placeholder="Enter uses"
                style={{color:"black"}}
            />
        </div>

        {/* Is Locked */}
        <div style={{paddingTop:"1rem"}} className={stylesAddUses.formItem}>
            <Checkbox
                checked={checkLock}
                onChange={(e) => setCheckLock(e.target.checked)}
            >
                Do you want to keep it locked?
            </Checkbox>
        </div>
    </div>
</Modal>
  )
}
