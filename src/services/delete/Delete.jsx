import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import styles from './Delete.module.css'; // Adjust the import according to your file structure

export const Delete = () => {
  // Sample static data for the table
  const drawRequestData = [
    {
      id: 1,
      uses: 'Project A',
      uses_type: 'Type 1',
      draw_request: 'Request 1',
      released_amount: 5000,
      budget_amount: 10000,
      funded_amount: 3000,
      balance_amount: 2000,
      draw_amount: 2500,
      requested_date: '2024-01-01',
    },
    {
      id: 2,
      uses: 'Project B',
      uses_type: 'Type 2',
      draw_request: 'Request 2',
      released_amount: 7000,
      budget_amount: 15000,
      funded_amount: 4000,
      balance_amount: 3000,
      draw_amount: 3500,
      requested_date: '2024-01-02',
    },
    // Add more static data as needed
  ];

  const initialColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Uses", dataIndex: "uses", key: "uses" },
    { title: "Uses Type", dataIndex: "uses_type", key: "uses_type" },
    { title: "Draw Request", dataIndex: "draw_request", key: "draw_request" },
    { title: "Released Amount", dataIndex: "released_amount", key: "released_amount" },
    { title: "Budget Amount", dataIndex: "budget_amount", key: "budget_amount" },
    { title: "Funded Amount", dataIndex: "funded_amount", key: "funded_amount" },
    { title: "Balance Amount", dataIndex: "balance_amount", key: "balance_amount" },
    { title: "Draw Amount", dataIndex: "draw_amount", key: "draw_amount" },
    { title: "Requested Date", dataIndex: "requested_date", key: "requested_date" },
  ];

  const [columns, setColumns] = useState(initialColumns);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
  
    // Get day, month, year, hours, minutes, and seconds
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    // Format the string as DD/MM/YYYY HH:MM:SS
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  // Handle the end of drag event
  const onDragEnd = (result) => {
    if (!result.destination) return; // dropped outside the list
    const newColumns = Array.from(columns);
    const [removed] = newColumns.splice(result.source.index, 1);
    newColumns.splice(result.destination.index, 0, removed);
    setColumns(newColumns);
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided) => (
            <table className={styles.table} ref={provided.innerRef} {...provided.droppableProps}>
              <thead className={styles.stickyHeader}>
                <tr className={styles.headRow}>
                  {columns.map((column, index) => (
                    <Draggable key={column.key} draggableId={column.key} index={index}>
                      {(provided) => (
                        <th
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={styles.th}
                        >
                          {column.title}
                        </th>
                      )}
                    </Draggable>
                  ))}
                </tr>
              </thead>
              <tbody>
                {drawRequestData.map((data, index) => (
                  <tr key={index}>
                    {columns.map((column) => (
                      <td className={styles.td} key={column.key}>
                        {column.dataIndex === "requested_date"
                          ? formatDateTime(data[column.dataIndex])
                          : data[column.dataIndex]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
