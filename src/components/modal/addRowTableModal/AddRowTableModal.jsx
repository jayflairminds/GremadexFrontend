import { Button, message, Modal } from 'antd';
import React, { useState } from 'react';
import styles from "./AddRowTable.module.css";
import { addRowPost } from '../../../services/api';

export const AddRowTableModal = ({ isAddRowModal, setIsAddRowModal, loanId, usesType, BudgetLoadTable }) => {
    const [loader, setLoader] = useState(false);
    const [addRowInput, setAddRowInput] = useState({
        uses: "",
        original_loan_budget: 0,
        adjustments: 0,
        equity_budget: 0,
        building_loan: 0,
        project_loan: 0,
        mezzanine_loan: 0,
    });

    const resetInputFields = () => {
        setAddRowInput({
            uses: "",
            original_loan_budget: 0,
            adjustments: 0,
            equity_budget: 0,
            building_loan: 0,
            project_loan: 0,
            mezzanine_loan: 0,
        });
    };

    const handleOk = () => {
        resetInputFields(); // Reset fields when modal is closed
        setIsAddRowModal(false);
    };

    const handleCancel = () => {
        resetInputFields(); // Reset fields when modal is canceled
        setIsAddRowModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddRowInput(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddRow = async () => {
        setLoader(true);
        const payload = {
            uses_type: usesType,
            ...addRowInput,
            loan_id: loanId
        };

        try {
            const res = await addRowPost(payload);
            if (res.status === 201) {
                setIsAddRowModal(false);
                message.success("Row Added");
                BudgetLoadTable();
                resetInputFields(); // Reset fields after successfully adding row
            }
            console.log(res);
        } catch (err) {
            console.log(err);
        } finally {
            setLoader(false);
        }
    };

    return (
        <div>
            <Modal
                open={isAddRowModal}
                title="Add Details"
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" className={styles.cancelBtn} onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleAddRow} loading={loader} className={styles.addBtn}>
                        Add
                    </Button>,
                ]}
                centered
                width={600}
            >
                <div>
                    <div className={styles.inputDiv}>
                        <span>Uses :</span>
                        <input
                            type="text"
                            name="uses"
                            value={addRowInput.uses}
                            onChange={handleInputChange}
                            placeholder="Enter uses"
                            style={{ color: "black" }}
                        />
                    </div>
                    <div className={styles.inputDiv}>
                        <span>Original Loan Budget:</span>
                        <input
                            type="number"
                            name="original_loan_budget"
                            value={addRowInput.original_loan_budget}
                            onChange={handleInputChange}
                            placeholder="Enter orginal Loan Budget"
                            style={{ color: "black" }}
                        />
                    </div>
                    <div className={styles.inputDiv}>
                        <span>Adjustments :</span>
                        <input
                            type="number"
                            name="adjustments"
                            value={addRowInput.adjustments}
                            onChange={handleInputChange}
                            placeholder="Adjustments"
                            style={{ color: "black" }}
                        />
                    </div>
                    <div className={styles.inputDiv}>
                        <span>Equity Budget :</span>
                        <input
                            type="number"
                            name="equity_budget"
                            value={addRowInput.equity_budget}
                            onChange={handleInputChange}
                            placeholder="Enter Equity Budget"
                            style={{ color: "black" }}
                        />
                    </div>
                    {/* <div className={styles.inputDiv}>
                        <span>Building Loan :</span>
                        <input
                            type="number"
                            name="building_loan"
                            value={addRowInput.building_loan}
                            onChange={handleInputChange}
                            placeholder="Enter building loan"
                            style={{ color: "black" }}
                        />
                    </div> */}
                    {/* <div className={styles.inputDiv}>
                        <span>Project Loan :</span>
                        <input
                            type="number"
                            name="project_loan"
                            value={addRowInput.project_loan}
                            onChange={handleInputChange}
                            placeholder="Enter project loan"
                            style={{ color: "black" }}
                        />
                    </div>
                    <div className={styles.inputDiv}>
                        <span>Mezzanine Loan :</span>
                        <input
                            type="number"
                            name="mezzanine_loan"
                            value={addRowInput.mezzanine_loan}
                            onChange={handleInputChange}
                            placeholder="Enter mezzanine loan"
                            style={{ color: "black" }}
                        />
                    </div> */}
                </div>
            </Modal>
        </div>
    );
};
