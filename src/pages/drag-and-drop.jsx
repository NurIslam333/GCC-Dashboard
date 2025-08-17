// pages/index.js
import React, { useState } from 'react';
import DraggableTable from '../components/drag-and-drop/DraggableTable';


const Home = () => {
  const [tableData, setTableData] = useState([
    { id: 1, cell1: 'Row 1 Cell 1', cell2: 'Row 1 Cell 2', cell3: 'Row 1 Cell 3' },
    { id: 2, cell1: 'Row 2 Cell 1', cell2: 'Row 2 Cell 2', cell3: 'Row 2 Cell 3' },
    { id: 3, cell1: 'Row 1 Cell 1', cell2: 'Row 1 Cell 2', cell3: 'Row 1 Cell 3' },
    { id: 4, cell1: 'Row 2 Cell 1', cell2: 'Row 2 Cell 2', cell3: 'Row 2 Cell 3' },
    { id: 5, cell1: 'Row 1 Cell 1', cell2: 'Row 1 Cell 2', cell3: 'Row 1 Cell 3' },
    { id: 6, cell1: 'Row 2 Cell 1', cell2: 'Row 2 Cell 2', cell3: 'Row 2 Cell 3' },
    { id: 7, cell1: 'Row 1 Cell 1', cell2: 'Row 1 Cell 2', cell3: 'Row 1 Cell 3' },
    { id: 8, cell1: 'Row 2 Cell 1', cell2: 'Row 2 Cell 2', cell3: 'Row 2 Cell 3' },
    // Add more rows as needed
  ]);

  const moveRow = (dragIndex, hoverIndex) => {
    const dragRow = tableData[dragIndex];
    const updatedTableData = [...tableData];
    updatedTableData.splice(dragIndex, 1);
    updatedTableData.splice(hoverIndex, 0, dragRow);
    setTableData(updatedTableData);
  };

  return (
    <div>
      <h1>Draggable Table with Fixed Header</h1>
      <div style={{ overflowX: 'auto' }}>
        <DraggableTable data={tableData} moveRow={moveRow} />
      </div>
    </div>
  );
};

export default Home;
