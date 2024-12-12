
import { Button, message, Modal } from 'antd'
import { deleteUser } from '../../../services/api'
import style from './DeleteUserByAdmin.module.css'
import React, { useState } from 'react'

export const DeleteUserByAdmin = ({isDeleteModal,setIsDeleteModal,selectedUserId,listOfUser}) => {
    const [loader,setLoader]=useState(false)

    const handleCancelDelete=()=>{
        setIsDeleteModal(false)
    }

    const handleDeleteUser = async() =>{
        setLoader(true);
        try{
            const res =  await deleteUser(selectedUserId)
            if(res.status===200){
                message.success("user deleted successfully")
                listOfUser()
            }
            
        }catch(err){
            console.log(err);
            message.error("Something went wrong")
            // listOfUser()
        } finally {
            setLoader(false); // Hide loader regardless of outcome
            setIsDeleteModal(false)
            // listOfUser()
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
    <Button key="submit" type="primary"  className={style.deleteButton} onClick={handleDeleteUser}  loading={loader}>
      Yes
    </Button>
  ]}
>
  <p>Are you sure you want to delete this ?</p>
</Modal>  
    </div>
  )
}
