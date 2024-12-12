import React, { useEffect, useState } from 'react';
import { getListOfUser } from '../../services/api';
import styles from './ListOfUser.module.css';
import { DeleteUserByAdmin } from '../modal/deleteUserByAdmin/DeleteUserByAdmin';

export const ListOfUser = () => {
  const [data, setData] = useState([]);
    const[isDeleteModal,setIsDeleteModal] =useState(false)
    const[selectedUserId,setSelectedUserId] =useState()
  const usersColumns = [
    { title: 'Id', key: 'id' },
    { title: 'Role Type', key: 'role_type' },
    { title: 'User', key: 'user' },
    { title: 'Email', key: 'email'},
    { title: 'User Name', key: 'user_name' },
    { title: 'Delete', key: 'delete' },
  ];

  useEffect(() => {
    
    listOfUser();
  }, []);
  const listOfUser = async () => {
    try {
      const res = await getListOfUser();
      setData(res.data);
      console.log(res, 'response');
    } catch (err) {
      console.error(err);
    }
  };
  const openDeleteModal= (id) =>{
    setSelectedUserId(id)
    setIsDeleteModal(true)
   
  }
  return (
    <div className={styles.main}>
      <div className={styles.tableDiv}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.stickyHeader}>
              <tr className={styles.headRow}>
                {usersColumns.map((column, index) => (
                  <th className={styles.th} key={index}>
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {usersColumns.map((column, colIndex) => (
                    <td className={styles.td} key={colIndex}>
                      { column.key === 'delete' ? (
                        <button  onClick={() => openDeleteModal(item.user)}  className={styles.deleteButton}>Delete</button>
                      ) : (
                        typeof item[column.key] === 'string' 
                        ? item[column.key] 
                        : item[column.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <DeleteUserByAdmin
         isDeleteModal ={isDeleteModal}
          setIsDeleteModal ={setIsDeleteModal}
          selectedUserId={selectedUserId}
          listOfUser={listOfUser}
          />
      </div>
    </div>
  );
};
