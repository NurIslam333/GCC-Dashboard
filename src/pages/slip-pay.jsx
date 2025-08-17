/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import cn from 'classnames';
import { NextSeo } from 'next-seo';
import Button from '@/components/ui/button';
import Scrollbar from '@/components/ui/scrollbar';
import { Tab } from '@headlessui/react';
import withAuth from '@/hook/PrivateRoute';
import React, { useState, useEffect, useCallback } from 'react';
import { headers } from '@/utls/auth';
import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';
import Pagination from '@/components/gcc-component/Pagination';
import CountDown from '@/components/drag-and-drop/CountDown';
import toast from 'react-hot-toast';

const userChoiceSlip = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(25);
  const [normalUserSlip, setNormalUserSlip] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const handleFetchNormalUser = useCallback(async () => {
    try {
      const values = {
        page: currentPage,
        perPage: limit,
        // page,
        // limit,
        status: activeTab,
        search: search,
      };
      const response = await axios.get(`${process.env.API_URL}/link-slips`, {
        headers: headers,
        params: values,
      });
      if (response.data.status === 'success') {
        setNormalUserSlip(response.data.slips.data);
        setTotalPages(response.data.slips.last_page);
      }
    } catch (err) {}
  }, [currentPage, search, limit, activeTab]);

  const handleComplete = async (id) => {
    try {
      const response = await axios.post(
        `${process.env.API_URL}/complete-payment/${id}`,
        values,
        {
          headers: headers,
        }
      );
      if (response.data.status === 'success') {
        const successMessage = response?.data?.message.success[0];
        toast.success(successMessage);
        // setSelectedItems([]);
        // setPaymentId({});
        // handelfetch();
      }
      if (response.data.status === 'error') {
        Object.keys(response.data.message.error).forEach((key) => {
          const errorMessage = response?.data?.message.error[key];
          toast.error(errorMessage);
          // handelfetch();
          // setPaymentId({});
        });
      }
    } catch (error) {
      // Handle error as needed
      console.error('Error updating card index:', error);
    }
  };

  const handleHeaderCheckboxChange = (event) => {
    if (event.target.checked) {
      const allItems = normalUserSlip.map((data) => data.id);
      setSelectedItems(allItems);
    } else {
      setSelectedItems([]);
    }
  };

  const handleRowCheckboxChange = (event, id) => {
    if (event.target.checked) {
      setSelectedItems((prevSelectedItems) => [...prevSelectedItems, id]);
    } else {
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((item) => item !== id)
      );
    }
  };

  const handleReadyForPayment = async () => {
    try {
      if (selectedItems.length > 0) {
        const values = {
          slip_ids: selectedItems,
        };
        const response = await axios.post(
          `${process.env.API_URL}/ready-for-pay`,
          values,
          {
            headers: headers,
          }
        );
        console.log(response);
        if (response) {
          const successMessage = response?.data?.message.success[0];
          toast.success(successMessage);
          setSelectedItems([]);
          // handelfetch();
          // setPaymentId({});
        }
        if (response.data.status === 'error') {
          Object.keys(response.data.message.error).forEach((key) => {
            const errorMessage = response?.data?.message.error[key];
            toast.error(errorMessage);
            // handelfetch();
            // setPaymentId({});
          });
        }
      }
    } catch (error) {
      // Handle error as needed
      console.error('Error updating card index:', error);
    }
  };
  useEffect(() => {
    handleFetchNormalUser();
  }, [handleFetchNormalUser]);

  return (
    <>
      <NextSeo
        title="GCC Choice Slip"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <div className="">
        <div className="rounded-tl-lg rounded-tr-lg bg-white px-4 pt-6 dark:bg-light-dark md:px-8 md:pt-8">
          <div className="flex flex-col items-center justify-between border-b border-dashed border-gray-200 pb-5 dark:border-gray-700 md:flex-row">
            <h2 className="mb-3 shrink-0 text-lg font-medium uppercase text-black dark:text-white sm:text-xl md:mb-0 md:text-2xl">
              Slip Pay
            </h2>

            <div className="">
              <Button className="mb-5 rounded-md border-0 bg-[#a855f7]">
                <Link href="/link-payment">Link Payment</Link>
              </Button>
              <input
                type="text"
                // defaultValue={data?.price}
                id="large-input"
                // style={{ width: '100px' }}
                className="sm:text-md block rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Search..."
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="mt-5">
            <Tab.Group>
              <div className="flex justify-between gap-4 align-baseline">
                <Tab.List className="flex gap-4">
                  <Tab>
                    <Button
                      className={cn('rounded-md border-0', {
                        '!bg-yellow-500': activeTab === 'pending',
                        'bg-gray-200': activeTab !== 'pending',
                      })}
                      onClick={() => setActiveTab('pending')}
                    >
                      Pending
                    </Button>
                  </Tab>
                  <Tab>
                    <Button
                      className={cn('rounded-md border-0', {
                        '!bg-orange-500': activeTab === 'complete',
                        'bg-gray-200': activeTab !== 'complete',
                      })}
                      onClick={() => setActiveTab('complete')}
                    >
                      Complete
                    </Button>
                  </Tab>
                </Tab.List>
                <div className="">
                  <Button
                    className="rounded-md !bg-green-600"
                    onClick={handleReadyForPayment}
                  >
                    Ready for Payment
                  </Button>
                </div>
              </div>
              <div></div>
              <Tab.Panels>
                {/* panding */}
                <Tab.Panel>
                  <div className="-mx-0.5">
                    <Scrollbar style={{ width: '100%' }} autoHide="never">
                      <div className="px-0.5">
                        <table className="transaction-table w-full border-separate border-0">
                          <thead className="text-sm text-gray-500 dark:text-gray-300">
                            <tr>
                              <th className="px-2 py-4 ">
                                <input
                                  name="selection-th"
                                  type="checkbox"
                                  onChange={handleHeaderCheckboxChange}
                                />
                              </th>
                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                SL No
                              </th>

                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Status
                              </th>

                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Slip Medical
                              </th>

                              {/* <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Travelling County
                              </th>

                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                City
                              </th>

                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Submit Date, Time
                              </th> */}
                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Pay Now
                              </th>

                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Timer
                              </th>

                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Notice
                              </th>

                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Reference
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm">
                            {normalUserSlip.length > 0 &&
                              normalUserSlip.map((item, i) => {
                                const isItemSelected = selectedItems?.includes(
                                  item.id
                                );
                                return (
                                  <>
                                    <tr
                                      key={'ls' + i} data-link-slip-id={item.id}
                                      className="mb-3 items-center rounded-lg bg-white uppercase shadow-card last:mb-0 hover:shadow-large dark:bg-light-dark"
                                    >
                                      <td className="px-2 py-1 ">
                                        <input
                                          type="checkbox"
                                          id={'inp' + item.id}
                                          checked={isItemSelected}
                                          onChange={(event) =>
                                            handleRowCheckboxChange(
                                              event,
                                              item.id
                                            )
                                          }
                                        />
                                      </td>
                                      <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                        {i + 1}
                                      </td>
                                      <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                        {item.status}
                                      </td>
                                      <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                        {item?.slip_medical}
                                      </td>
                                      <td>
                                        {item.payable !== false && (
                                          <Button
                                            onClick={() => {
                                              // setPaymentId({
                                              //   card_no: 1,
                                              //   id: data.id,
                                              // });
                                              handleComplete(item?.id);
                                            }}
                                            className={`flex-1 rounded-sm bg-orange-500 p-1 text-center text-white`}
                                          >
                                            Pay
                                          </Button>
                                        )}
                                      </td>
                                      {/* <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                        {item?.tcountry}
                                      </td>
                                      <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                        {item.city}
                                      </td> */}
                                      {/* <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                        {moment(item?.created_at).format(
                                          'DD/MM/YYYY'
                                        )}
                                        <br />
                                        {moment(item?.created_at).format(
                                          'hh:mm A'
                                        )}
                                      </td> */}
                                      {/* <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                        
                                        {item?.medical_list?.map(
                                          (item, i, array) => (
                                            <React.Fragment key={i}>
                                              {item?.length < 15 ? (
                                                <>
                                                  {item} <br />
                                                </>
                                              ) : (
                                                <>
                                                  {item?.slice(0, 13)}...
                                                  <br />
                                                </>
                                              )}
                                            </React.Fragment>
                                          )
                                        )}
                                      </td> */}
                                      <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                        {/* <h5 className="rounded-full border-2 border-solid border-orange-400 py-2 px-3 text-center">
                                        
                                        </h5> */}
                                        {item?.timer !== null && (
                                          <CountDown time={item?.timer} />
                                        )}
                                      </td>
                                      <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                        {/* <h5 className="rounded-full border-2 border-solid border-orange-400 py-2 px-3 text-center">
                                        
                                        </h5> */}
                                        {item?.notice}
                                      </td>

                                      <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                        {item?.remarks}
                                      </td>
                                    </tr>

                                    {/* <tr
                                      key={i}
                                      className="mb-3 items-center rounded-lg bg-white uppercase shadow-card last:mb-0 hover:shadow-large dark:bg-light-dark"
                                    >
                                      <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                        {i + 1}
                                      </td>
                                      <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                        Michael Brown
                                      </td>
                                      <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                        JKL901234
                                      </td>
                                      <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                        Germany
                                      </td>
                                      <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                        Berlin
                                      </td>
                                      <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                        {moment('2024-01-16T16:30:00').format(
                                          'DD/MM/YYYY'
                                        )}
                                      </td>
                                      <td>
                                        <Button
                                          // onClick={() => {
                                          //   setPaymentId({
                                          //     card_no: 1,
                                          //     id: data.id,
                                          //   });
                                          //   handleComplete(1, data?.id);
                                          // }}
                                          className={`flex-1 rounded-sm bg-orange-500 p-1 text-center text-white`}
                                        >
                                          Pay
                                        </Button>
                                      </td>
                                      <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                        Center B
                                      </td>
                                      <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                        <h5 className="rounded-full border-2 border-solid border-orange-400 py-2 px-3 text-center">
                                          Approved
                                        </h5>
                                      </td>

                                      <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                        REF901234
                                      </td>
                                    </tr> */}
                                  </>
                                );
                              })}
                            {/* item */}
                          </tbody>
                        </table>
                        <div className=" flex  justify-center">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            fetchData={setCurrentPage}
                          />
                        </div>
                      </div>
                    </Scrollbar>
                  </div>
                </Tab.Panel>

                {/* compelete */}
                <Tab.Panel>
                  <div className="-mx-0.5">
                    <Scrollbar style={{ width: '100%' }} autoHide="never">
                      <div className="px-0.5">
                        <table className="transaction-table w-full border-separate border-0">
                          <thead className="text-sm text-gray-500 dark:text-gray-300">
                            <tr>
                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                SL No
                              </th>

                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Name
                              </th>

                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                <p>Passport No,</p>
                                <p>Travelling County,</p>
                                <p>City</p>
                              </th>

                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Submit Date, Time
                              </th>

                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Choice Center
                              </th>

                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Status
                              </th>

                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                <a href="" className="">
                                  Slip Link
                                </a>
                              </th>

                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Reference
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm">
                            {normalUserSlip.length > 0 &&
                              normalUserSlip.map((item, i) => {
                                return (
                                  <tr
                                    key={i}
                                    className="mb-3 items-center rounded-lg bg-white uppercase shadow-card last:mb-0 hover:shadow-large dark:bg-light-dark"
                                  >
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      {i + 1}
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      {item.first_name} {item.last_name}
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      {item?.passport}
                                      <br />
                                      {item?.tcountry}
                                      <br />
                                      {item?.city}
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      {moment(item?.created_at).format(
                                        'DD/MM/YYYY'
                                      )}
                                      <br />
                                      {moment(item?.created_at).format(
                                        'hh:mm A'
                                      )}
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      {item?.medical_list?.map(
                                        (item, i, array) => (
                                          <React.Fragment key={i}>
                                            {item?.length < 15 ? (
                                              <>
                                                {item} <br />
                                              </>
                                            ) : (
                                              <>
                                                {item?.slice(0, 13)}...
                                                <br />
                                              </>
                                            )}
                                          </React.Fragment>
                                        )
                                      )}
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      {item?.status}
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      <button
                                        onClick={() => {
                                          window.open(item.slip_url, '_blank');
                                        }}
                                        className="block w-[100px] rounded-sm bg-orange-400 p-2 text-center text-white"
                                      >
                                        Slip Link
                                      </button>
                                    </td>

                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      {item?.reference}
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                        <div className=" flex  justify-center">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            fetchData={setCurrentPage}
                          />
                        </div>
                      </div>
                    </Scrollbar>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
    </>
  );
};

// export default userChoiceSlip;
export default withAuth(userChoiceSlip, {
  isProtectedRoute: true,
  show: false,
});
