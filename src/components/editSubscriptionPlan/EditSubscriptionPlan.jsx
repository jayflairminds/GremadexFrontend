import React, { useEffect, useState } from 'react';
import { getListOfSubscription, handleDeleteSubscription } from '../../services/api';
import styles from './EditSubscriptionPlan.module.css';
import { Button } from 'antd';
import { AddSubscriptionModal } from '../modal/addSubscriptionModal/AddSubscriptionModal';
import { EditSubscriptionModal } from '../modal/editSubscriptionModal/EditSubscriptionModal';
import { Loader } from '../loader/Loder';

export const EditSubscriptionPlan = () => {
  const [data, setData] = useState([]);
  const [loaderDelete, setLoaderDelete] = useState({});
  const [isAddSubscriptionModal, setIsAddSubscriptionModal] = useState(false);
  const [isEditSubscriptionModal, setIsEditSubscriptionModal] = useState(false);
  const [editDetails, setEditDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const usersColumns = [
    { title: 'Id', key: 'id' },
    { title: 'Tier Type', key: 'tier' },
    { title: 'Loan Count', key: 'loan_count' },
    { title: 'Created At', key: 'created_at' },
    { title: 'Updated At', key: 'updated_at' },
    // { title: 'Is Active', key: 'is_active' },
    { title: 'Risk Metrics', key: 'risk_metrics' },
  ];

  const listOfSubscription = async () => {
    setIsLoading(true)
    try {
      const res = await getListOfSubscription();
      setData(res.data);
    } catch (err) {
      console.error('Error fetching subscription list:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    listOfSubscription();
  }, []);

  const formatDate = (date) => {
    if (!date) return 'N/A'; // Handle null or undefined dates
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = async (item) => {
    setLoaderDelete((prev) => ({ ...prev, [item.id]: true }));
    try {
      await handleDeleteSubscription(item.id);
      listOfSubscription();
    } catch (err) {
      console.error('Error deleting subscription:', err);
    } finally {
      setLoaderDelete((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  const handleOpenAddModal = () => {
    setIsAddSubscriptionModal(true);
  };

  const handleEditOpenModal = (item) => {
    setEditDetails(item);
    setIsEditSubscriptionModal(true);
  };

  return (
    <div>
      {isLoading ? (
        <div className={styles.loaderDiv}>
          <Loader />
        </div>
      ) : (
        <>
          <div className={styles.btnDiv}>
            <Button onClick={handleOpenAddModal} className={styles.filledBtnAdd}>
              Add Plan
            </Button>
          </div>
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
                    <th className={styles.th}>Edit</th>
                    <th className={styles.th}>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, rowIndex) => (
                    <tr key={rowIndex}>
                      {usersColumns.map((column, colIndex) => (
                        <td className={styles.td} key={colIndex}>
                          {column.key === 'is_active' || column.key === 'risk_metrics'
                            ? item[column.key]
                              ? 'Yes'
                              : 'No'
                            : column.key === 'created_at' || column.key === 'updated_at'
                            ? formatDate(item[column.key])
                            : item[column.key]}
                        </td>
                      ))}
                      <td className={styles.td}>
                        <Button
                          onClick={() => handleEditOpenModal(item)}
                          className={styles.filledBtn}
                        >
                          Edit
                        </Button>
                      </td>
                      <td className={styles.td}>
                        <Button
                          loading={loaderDelete[item.id] || false}
                          onClick={() => handleDelete(item)}
                          className={styles.deleteButton}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <AddSubscriptionModal
              isAddSubscriptionModal={isAddSubscriptionModal}
              setIsAddSubscriptionModal={setIsAddSubscriptionModal}
              listOfSubscription={listOfSubscription}
            />
            <EditSubscriptionModal
              isEditSubscriptionModal={isEditSubscriptionModal}
              setIsEditSubscriptionModal={setIsEditSubscriptionModal}
              editDetails={editDetails}
              listOfSubscription={listOfSubscription}
            />
          </div>
        </>
      )}
    </div>
  );
};
