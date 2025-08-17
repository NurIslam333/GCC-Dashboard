// DraggableList.js
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const DraggableList = ({ data, moveItem }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'LIST_ITEM',
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'LIST_ITEM',
    hover: (item, monitor) => {
      if (!monitor.isOver({ shallow: true })) {
        return;
      }

      moveItem(item.index, data.index);
      item.index = data.index;
    },
  });

  return (
    <div ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {data.item}
    </div>
  );
};

export default DraggableList;
