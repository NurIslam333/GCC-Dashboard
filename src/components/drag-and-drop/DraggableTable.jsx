// DraggableTable.js
import React from 'react';
import { useDrop } from 'react-dnd';
import DraggableRow from './DraggableRow';
import Scrollbar from '@/components/ui/scrollbar';

const DraggableTable = ({ data, moveRow }) => {
  // const [, drop] = useDrop({
  //   accept: 'ROW',
  //   drop: (item, monitor) => {
  //     const dragIndex = item.index;
  //     const hoverIndex = data.length;
  //     moveRow(dragIndex, hoverIndex);
  //     item.index = hoverIndex;
  //     const orderedData = data.map((row) => row[0]);
  //     console.log("data" , orderedData )
  //     console.log("data" , dragIndex )
  //   },
  // });

  const [, drop] = useDrop({
    accept: 'ROW',
    drop: async (item, monitor) => {
      const dragIndex = item.index;
      const hoverIndex = data.length;
      moveRow(dragIndex, hoverIndex);

      // Extract the reordered data with the correct order
      const orderedData = data.map((row, index) => ({
        ...row,
        order: index + 1, // Assuming you have an "order" property in your objects
      }));


      try {
        // Save the ordered data to the API
        await axios.post('/api/saveTableOrder', { orderedData });
      } catch (error) {
        console.error('Error saving table order:', error);
      }

      item.index = hoverIndex;
    },
  });

  // const [, drop] = useDrop({
  //   accept: 'ROW',
  //   drop: async (item, monitor) => {
  //     const dragIndex = item.index;
  //     const hoverIndex = data.length;
  //     moveRow(dragIndex, hoverIndex);

  //     // Extract the reordered data
  //     const orderedData = data.map((row) => row[0]);

  //     try {
  //       // Save the ordered data to the API
  //       await axios.post('/api/saveTableOrder', { orderedData });
  //     } catch (error) {
  //       console.error('Error saving table order:', error);
  //     }

  //     item.index = hoverIndex;
  //   },
  // });

  return (
    <div className="-mx-0.5">
    <Scrollbar style={{ width: '100%' }} autoHide="never">
      <div className="px-0.5">
        <table className="transaction-table w-full border-separate border-0">
          <thead className="text-sm text-gray-500 dark:text-gray-300">
            <tr>
              <th className="px-2 py-4 ">
                <input type="checkbox" />
              </th>
              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                SL No
              </th>

              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                Passport No, Travel County, City
              </th>

              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                Shift
              </th>

              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                Slip Category
              </th>

              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                Choice Center
              </th>

              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                Medical Center Serial
              </th>

              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                Slip Complete Center
              </th>
              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                Pay Now
              </th>

              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                Timer
              </th>

              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                Message
              </th>

              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                User
              </th>
              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                Price
              </th>
            </tr>
          </thead>
          <tbody className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm">

          <tbody ref={drop}>
        {data.map((row, index) => (
          <DraggableRow key={index} item={row} index={index} moveRow={moveRow} />
        ))}
      </tbody>
            {/* {MedicalCenter?.map((data, i) => (
              <tr
                key={i}
                className="mb-3 items-center rounded-lg bg-white capitalize shadow-card last:mb-0 hover:shadow-large dark:bg-light-dark"
              >
                <td className="px-2 py-4 ">
                  <input type="checkbox" />
                </td>
                <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                  {i + 1}
                </td>
                <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                  <p>A00164654</p>
                  <p>SA</p>
                  <p>Sylhet</p>
                </td>
                <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                  <span className="block w-[80px] rounded-md border-2 border-solid border-orange-400 py-1 px-2">
                    {data.shift}
                  </span>
                </td>
                <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                  {data.slipCategory}
                </td>
                <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                  <h4 className="flex gap-2 font-medium ">
                    <span>{i + 1}.</span> {data.medicalCenterName}
                  </h4>
                </td>
                <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                  <h4 className="flex gap-2 font-medium text-orange-400">
                    <span>{i + 1}.</span> {data.medicalCenterName}
                  </h4>
                </td>
                <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                  <h4 className="flex gap-2 font-medium ">
                    <span>{i + 1}.</span> {data.medicalCenterName}
                  </h4>
                </td>
                <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                  <a
                    href=""
                    className="mb-2 block w-[80px] rounded-sm bg-orange-400 p-1 text-center text-white"
                  >
                    Pay 01
                  </a>
                  <a
                    href=""
                    className="block w-[80px] rounded-sm bg-orange-400 p-1 text-center text-white"
                  >
                    Pay 02
                  </a>
                </td>
                <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                  90:60
                </td>
                <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                  All OK
                </td>
                <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                  Rasel
                </td>
                <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                  8000
                </td>
              </tr>
            ))} */}
          </tbody>
        </table>
      </div>
    </Scrollbar>
  </div>
  );
};

export default DraggableTable;
