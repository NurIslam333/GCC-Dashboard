/* eslint-disable react/jsx-key */
import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import CountDown from '../drag-and-drop/CountDown';
import PayButton from './PayButton';

import { da } from 'date-fns/locale';
import { Tooltip } from '@mui/material';

const ItemTypes = {
  CARD: 'card',
};
const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
};
const KuetSlipDraggable = ({
  id,
  index,
  moveCard,
  data,
  slots,
  handleSelectChange,
  selectedItems,
  setPaymentId,
  paymentId,
  handleRowCheckboxChange,
  handleComplete,
  handleShowMedical,
}) => {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    drop(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  const isItemSelected = selectedItems?.includes(data.id);
  return (
    <tr
      ref={ref}
      style={{ ...style, opacity }}
      data-handler-id={handlerId}
      data-pay-slip-id={data.id}
      key={data.id}
      className="mb-1  items-center rounded-lg bg-white capitalize shadow-card last:mb-0 hover:shadow-large dark:bg-light-dark"
    >
      <td className="px-2 py-1 ">
     
        <input
          type="checkbox"
          id={'inp' + data.id}
          checked={isItemSelected}
          onChange={(event) => handleRowCheckboxChange(event, data.id)}
        />
      </td>
      <td className="px-2 py-1 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
        {index + 1}
      </td>
      <td className="px-2 py-1 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
        <p>{data?.passport}</p>
        <p>{data?.tcountry}</p>
        <p>{data?.city}</p>
      </td>
      <td className="px-2 py-1 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
        <select
          name={'s' + data?.id}
          key={'s' + data?.id}
          className="rounded-lg"
          defaultValue={data?.slot_id}
          // value={selectedValue}
          onChange={(e) => handleSelectChange(e, data?.id)}
        >
          {slots.length > 0 &&
            slots.map((item, i) => (
              <option key={'opt_' + i + data?.id} value={item?.id}>
                {item?.name}
              </option>
            ))}
        </select>
        {/* </span> */}
      </td>
      <td className="px-2 py-1 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
        {data?.type}
      </td>
      <td
        className="px-2 py-1 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8"
        key={'td6' + data?.id}
      >
        <Tooltip
          title={
            data?.medical_list !== null
              ? data?.medical_list?.map((item, index) => {
                  return (
                    <ul key={'ul' + index + data?.id}>
                      <li key={'li' + index + data?.id}>
                        {' '}
                        {index + 1} .{item}
                      </li>
                    </ul>
                  );
                })
              : 'N/A'
          }
          placement="top-start"
        >
          <span
            style={{
              display: 'flex',
              alignItem: 'center',
              justifyContent: 'center',
            }}
          >
            {data?.medical_list !== null &&
            data?.medical_list[0]?.length < 15 ? (
              <span>{data?.medical_list[0]}</span>
            ) : (
              data?.medical_list !== null && (
                <span>
                  {data?.medical_list !== null &&
                    data?.medical_list[0]?.slice(0, 13)}
                  ...
                </span>
              )
            )}
          </span>
        </Tooltip>
      </td>
      <td
        className="px-2 py-1 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-1 md:ltr:first:pl-8 md:ltr:last:pr-8"
        key={'td7' + data?.id}
      >
        <h4 className="flex gap-2 font-medium text-orange-400">
          <p>{data?.medical_serial}.</p>
          <Tooltip title={data?.medical_name} placement="top-start">
            <span>
              {data?.medical_name?.length < 12 ? (
                <span>{data?.medical_name}</span>
              ) : (
                <span>
                  {data?.medical_name?.slice(0, 13)}
                  ...
                </span>
              )}
            </span>
          </Tooltip>
        </h4>
      </td>
      <td className="px-2 py-1 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
        <h4 className="flex gap-2 font-medium ">
          <Tooltip
            title={data?.slip_medical !== null && data?.slip_medical}
            placement="top-start"
          >
            <span>
              {data?.slip_medical !== null && data?.slip_medical.length < 12 ? (
                <span>{data?.slip_medical !== null && data?.slip_medical}</span>
              ) : (
                data?.slip_medical !== null && (
                  <span>
                    {data?.slip_medical !== null &&
                      data?.slip_medical?.slice(0, 13)}
                    ...
                  </span>
                )
              )}
            </span>
          </Tooltip>
        </h4>
      </td>
      <PayButton
        data={data}
        setPaymentId={setPaymentId}
        paymentId={paymentId}
        handleComplete={handleComplete}
      />
      <td
        key={'td10' + data?.id}
        className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8"
      >
        {/* <CountDown time={'2023-11-28T19:48:35.000000Z'}  duration={7140} /> */}
        {data?.timer !== null && <CountDown time={data?.timer} />}
      </td>
      <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
        {data?.notice}
      </td>
      <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
        {data?.user_name}
      </td>
      <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
        {data?.slip_price}
      </td>
    </tr>
  );
};

export default KuetSlipDraggable;
