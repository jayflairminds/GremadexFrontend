import { Button, message, Modal } from 'antd'
import styleBudget from "./DeleteRowModal.module.css"
import React, { useState } from 'react'
import { deleteBudgetMarter } from '../../../services/api'
export const DeleteRowModal = ({isDeleteModal,setIsDeleteModal,selectedRowId,BudgetLoadTable}) => {
    const [loader,setLoader]=useState(false)

    const handleCancelDelete=()=>{
        setIsDeleteModal(false)
    }

    const handleDelete =async()=>{
        setLoader(true);
        try{
            const res =  await deleteBudgetMarter(selectedRowId)
            console.log(res);
            if(res.status ===204){
                BudgetLoadTable()
                message.success("Deleted")
                setIsDeleteModal(false)
            
            }
        }catch(err){
            console.log(err);
        } finally {
            setLoader(false); // Hide loader regardless of outcome
        }
        
    }

  return (
    <div>
        <Modal
  title="Confirm Deletion"
  open={isDeleteModal}
  onCancel={handleCancelDelete} 
  footer={[
    <Button key="back" onClick={handleCancelDelete}>
      No
    </Button>,
    <Button key="submit" type="primary"  className={styleBudget.deleteBtn} onClick={handleDelete}  loading={loader}>
      Yes
    </Button>
  ]}
>
  <p>Are you sure you want to delete this ?</p>
</Modal>  
    </div>
  )
}
