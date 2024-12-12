import React, { useEffect, useState } from 'react';
import styles from "./EditUsesByAdmin.module.css";
import { Button, message, Select } from 'antd';
import { Option } from 'antd/es/mentions';
import { deleteUses, getListOfUses } from '../../services/api';
import { EditUsesModal } from '../modal/editUsesModal/EditUsesModal';
import { AddUsesModal } from '../modal/addUsesModal/AddUsesModal';
import { Loader } from '../loader/Loder';

export const EditUsesByAdmin = ({data, setData,sortedData, setSortedData}) => {
   
    const [loader, setLoader] = useState({});
    const [isEditModal, setIsEditModal] = useState(false);
    const [isAddUses, setIsAddUses] = useState(false);
    const [usesName, setUsesName] = useState(null);
    const [selectedProjectType, setSelectedProjectType] = useState('');
    const [filterBasis, setFilterBasis] = useState('project_type'); // State to track the filter basis
    const [isLoading, setIsLoading] = useState(true);
    const[editDetails,setEditDetails]=useState([])
    console.log(isLoading,"setIsLoading");
    
    const usersColumns = [
      { title: 'Id', key: 'id' },
      { title: 'Project Type', key: 'project_type' },
      { title: 'Uses Type', key: 'uses_type' },
      { title: 'Uses', key: 'uses' },
      { title: 'Default', key: 'is_locked' },
    ];
  
    const listOfUses = async () => {
      console.log("hi");
      
      setIsLoading(true)
      try {
        const res = await getListOfUses();
        setData(res.data);
        setSortedData(res.data);
      } catch (err) {
        console.error(err);
      }finally{
        setIsLoading(false)
      }
    };
  
    useEffect(() => {
      listOfUses();
    }, []);
  
    const handleEdit = (item) => {
      setIsEditModal(true);
      setUsesName(item.uses);
      setEditDetails(item)
    };
  
    const handleDelete = async (item) => {
      setLoader((prev) => ({ ...prev, [item.id]: true }));
      try {
        const response = await deleteUses(item.id);
        if (response.status === 204) {
          message.success("Deleted");
          listOfUses();
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoader((prev) => ({ ...prev, [item.id]: false }));
      }
    };
  
    const handleAddUses = () => {
      setIsAddUses(true);
    };
  
    const handleSort = () => {
      const sorted = [...sortedData].sort((a, b) =>
        a.project_type.localeCompare(b.project_type)
      );
      setSortedData(sorted);
    };
  
    const handleProjectTypeChange = (value) => {
      setSelectedProjectType(value);
      if (value) {
        // Filter data by selected project_type
        const filteredData = data.filter((item) => item.project_type === value);
        setSortedData(filteredData);
      } else {
        // If no filter is selected, show all data
        setSortedData(data);
      }
    };
  
    const handleFilterBasisChange = (value) => {
      setFilterBasis(value);
      // Reset the selection of filter value whenever the filter basis is changed
      setSelectedProjectType('');
      setSortedData(data);
    };
  
    const handleUseTypeChange = (value) => {
      setSelectedProjectType(value);
      if (value) {
        // Filter data by selected uses_type
        const filteredData = data.filter((item) => item.uses_type === value);
        setSortedData(filteredData);
      } else {
        // If no filter is selected, show all data
        setSortedData(data);
      }
    };
  
const dark = JSON.parse(localStorage.getItem('darkTheme'));
    return (
      <div className={styles.main}
      style={{
        backgroundColor: dark ? '#084c61' : 'white',         // Change text color based on the theme
      }}>
     
      {isLoading ? (
        <div className={styles.loaderDiv}>
          <Loader />
        </div>
      ) : (
        <>
        <div className={styles.selectDiv}>
          <Select
            style={{ width: 200, marginRight: '20px' }}
            placeholder="Select Filter Basis"
            onChange={handleFilterBasisChange}
            value={filterBasis}
          >
            <Option value="project_type">Project Type</Option>
            <Option value="uses_type">Uses Type</Option>
          </Select>
  
          {filterBasis === 'project_type' ? (
            <Select
              style={{ width: 200 }}
              placeholder="Select Project Type"
              onChange={handleProjectTypeChange}
              value={selectedProjectType}
            >
              <Option value="">All</Option>
              {/* Dynamically create options based on unique project_type values */}
              {data
                .map((item) => item.project_type)
                .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
                .map((type, index) => (
                  <Option key={index} value={type}>
                    {type}
                  </Option>
                ))}
            </Select>
          ) : (
            <Select
              style={{ width: 200 }}
              placeholder="Select Uses Type"
              onChange={handleUseTypeChange}
              value={selectedProjectType}
            >
              <Option value="">All</Option>
              {/* Dynamically create options based on unique uses_type values */}
              {data
                .map((item) => item.uses_type)
                .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
                .map((type, index) => (
                  <Option key={index} value={type}>
                    {type}
                  </Option>
                ))}
            </Select>
          )}
        </div>
  
        <div className={styles.btnDiv}>
          <Button className={styles.filledBtnAdd} onClick={() => handleAddUses()}>Add Uses</Button>
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
                {sortedData.map((item, rowIndex) => (
                  <tr key={rowIndex}>
                    {usersColumns.map((column, colIndex) => (
                      <td className={styles.td} key={colIndex}>
                        {column.key === 'is_locked'
                          ? item[column.key]
                            ? 'Yes'
                            : 'No'
                          : item[column.key]}
                      </td>
                    ))}
                    <td className={styles.td}>
                      <Button onClick={() => handleEdit(item)} className={styles.filledBtn}>
                        Edit
                      </Button>
                    </td>
                    <td className={styles.td}>
                      <Button
                        loading={loader[item.id]}
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
  
        </div>
        </>
      )}
      
      <EditUsesModal
            isEditModal={isEditModal}
            setIsEditModal={setIsEditModal}
            usesName={usesName}
            itemId={data.find((dataItem) => dataItem.uses === usesName)?.id}
            listOfUses={listOfUses}
            editDetails={editDetails}
          />
  
          <AddUsesModal isAddUses={isAddUses} setIsAddUses={setIsAddUses} listOfUses={listOfUses} />
      </div>
    );
  };