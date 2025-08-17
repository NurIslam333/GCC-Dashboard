// DraggableRow.js
import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableRow = ({ item, index, moveRow }) => {
  const [, drag] = useDrag({
    type: 'ROW',
    item: { index },
  });
  console.log('sdsd', item);
  return (
    <tr ref={drag}>
      {/* {item.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))} */}

      <td key={index}>{item.cell1}</td>
      <td key={index}>{item.cell2}</td>
      <td key={index}>{item.cell3}</td>
    </tr>

    // <tr
    //   key={i}
    //   ref={drag}
    //   className="mb-3 items-center rounded-lg bg-white capitalize shadow-card last:mb-0 hover:shadow-large dark:bg-light-dark"
    // >
    //   <td className="px-2 py-4 ">
    //     <input type="checkbox" />
    //   </td>
    //   <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
    //     {i + 1}
    //   </td>
    //   <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
    //     <p>A00164654</p>
    //     <p>SA</p>
    //     <p>Sylhet</p>
    //   </td>
    //   <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
    //     <span className="block w-[80px] rounded-md border-2 border-solid border-orange-400 py-1 px-2">
    //       {data.shift}
    //     </span>
    //   </td>
    //   <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
    //     {data.slipCategory}
    //   </td>
    //   <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
    //     <h4 className="flex gap-2 font-medium ">
    //       <span>{i + 1}.</span> {data.medicalCenterName}
    //     </h4>
    //   </td>
    //   <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
    //     <h4 className="flex gap-2 font-medium text-orange-400">
    //       <span>{i + 1}.</span> {data.medicalCenterName}
    //     </h4>
    //   </td>
    //   <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
    //     <h4 className="flex gap-2 font-medium ">
    //       <span>{i + 1}.</span> {data.medicalCenterName}
    //     </h4>
    //   </td>
    //   <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
    //     <a
    //       href=""
    //       className="mb-2 block w-[80px] rounded-sm bg-orange-400 p-1 text-center text-white"
    //     >
    //       Pay 01
    //     </a>
    //     <a
    //       href=""
    //       className="block w-[80px] rounded-sm bg-orange-400 p-1 text-center text-white"
    //     >
    //       Pay 02
    //     </a>
    //   </td>
    //   <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
    //     90:60
    //   </td>
    //   <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
    //     All OK
    //   </td>
    //   <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
    //     Rasel
    //   </td>
    //   <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
    //     8000
    //   </td>
    // </tr>
  );
};

export default DraggableRow;
