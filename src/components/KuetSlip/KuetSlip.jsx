import React, { useState } from 'react';

import Button from '@/components/ui/button';
import RootLayout from '@/layouts/_root-layout';
import Scrollbar from '@/components/ui/scrollbar';
import Link from 'next/link';

import { Tab } from '@headlessui/react';
import { MedicalCenter } from './MedicalCenter';

const KuetSlip = () => {
  const [selectedItems, setSelectedItems] = useState([]);

    // Function to handle API call for Ready for Payment
    const handleReadyForPayment = () => {
      // Implement your API call logic here for "Ready for Payment"
      
    };
  
    // Function to handle API call for Complete
    const handleComplete = () => {
      // Implement your API call logic here for "Complete"
      
    };

  const handleHeaderCheckboxChange = (event) => {
    if (event.target.checked) {
      // Select all items
      const allItems = MedicalCenter.map((data, i) => i + 1);
      setSelectedItems(allItems);
    } else {
      // Deselect all items
      setSelectedItems([]);
    }
  };

  const handleRowCheckboxChange = (event, index) => {
    if (event.target.checked) {
      // Add the selected item to the list
      setSelectedItems((prevSelectedItems) => [...prevSelectedItems, index + 1]);
    } else {
      // Remove the selected item from the list
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((item) => item !== index + 1)
      );
    }
  };


  return (
    <div className="py-5">
      <h2 className="mb-3 shrink-0 pb-5 text-lg font-medium uppercase text-black dark:text-white sm:text-xl md:mb-0 md:text-2xl">
        KUET SLIP
      </h2>
      <Tab.Group>
        <Tab.List className="flex gap-4">
          <Tab>
            <Button className="rounded-md border-0 bg-orange-500">
              Slop 1
            </Button>
          </Tab>
      
        </Tab.List>
        <Tab.Panels>
          {/* 1 */}
          <Tab.Panel>
            <div className="mt-5">
              {/* header */}
              <div className="flex items-center justify-between ">
                {/* left */}
                <div className="flex items-center gap-4">
                  <Button className="rounded-md !bg-blue-500">
                    Normal Slip Input
                  </Button>
                  <Button className="rounded-md !bg-blue-500">
                    False Slip Input
                  </Button>
                </div>

                {/* right */}
                <div className="">
                  <Button className="rounded-md !bg-green-600" onClick={handleReadyForPayment}>
                    Ready for Payment
                  </Button>
                </div>
              </div>

              <div className="my-5">
                <Button className="rounded-md !bg-[#ec4899]" onClick={handleComplete}>Complete</Button>
              </div>

              {/* table */}
              <div className="-mx-0.5">
                <Scrollbar style={{ width: '100%' }} autoHide="never">
                  <div className="px-0.5">
                    <table className="transaction-table w-full border-separate border-0">
                      <thead className="text-sm text-gray-500 dark:text-gray-300">
                        <tr>
                          <th className="px-2 py-4 ">
                            <input type="checkbox"  onChange={handleHeaderCheckboxChange} />
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
                        {MedicalCenter?.map((data, i) => (
                          <tr
                            key={i}
                            className="mb-3 items-center rounded-lg bg-white capitalize shadow-card last:mb-0 hover:shadow-large dark:bg-light-dark"
                          >
                            <td className="px-2 py-4 ">
                              <input type="checkbox"  checked={selectedItems.includes(i + 1)}   onChange={(event) => handleRowCheckboxChange(event, i)} />
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
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Scrollbar>
              </div>
            </div>
          </Tab.Panel>

       
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default KuetSlip;
