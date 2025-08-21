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
import toast from 'react-hot-toast';

const userChoiceSlip = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(25);
  const [normalUserSlip, setNormalUserSlip] = useState([]);
  const [retryingSlips, setRetryingSlips] = useState(new Set());
  
  const handleFetchNormalUser = useCallback(async () => {
    try {
      const values = {
        page: currentPage,
        perPage: limit,
        status: activeTab === 'all' ? 'all' : activeTab,
        search: search,
      };
      const response = await axios.get(`${process.env.API_URL}/choice-slips`, {
        headers: headers,
        params: values,
      });
      if (response.data.status === 'success') {
        setNormalUserSlip(response.data.slips.data);
        setTotalPages(response.data.slips.last_page);
      }
    } catch (err) {}
  }, [currentPage, search, limit, activeTab]);

  const handleRetrySlip = async (slipId) => {
    try {
      setRetryingSlips(prev => new Set(prev).add(slipId));
      
      const response = await axios.post(
        `${process.env.API_URL}/retry-slip-submission`,
        { slip_id: slipId },
        { headers: headers }
      );
      
      if (response.data.status === 'success') {
        toast.success('Slip retry initiated successfully!');
        // Refresh the data to show updated status
        handleFetchNormalUser();
      } else {
        toast.error(response.data.message || 'Failed to retry slip');
      }
    } catch (error) {
      console.error('Retry error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to retry slip. Please try again.');
      }
    } finally {
      setRetryingSlips(prev => {
        const newSet = new Set(prev);
        newSet.delete(slipId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    handleFetchNormalUser();
  }, [handleFetchNormalUser]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'border-yellow-400 text-yellow-600';
      case 'complete':
        return 'border-green-400 text-green-600';
      case 'failed':
        return 'border-red-400 text-red-600';
      default:
        return 'border-gray-400 text-gray-600';
    }
  };

  const getStatusBackground = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100';
      case 'complete':
        return 'bg-green-100';
      case 'failed':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <>
      <NextSeo
        title="GCC Choice Slip"
        description="GCC Choice Slip"
      />
      <div className="">
        <div className="rounded-tl-lg rounded-tr-lg bg-white px-4 pt-6 dark:bg-light-dark md:px-8 md:pt-8">
          <div className="flex flex-col items-center justify-between border-b border-dashed border-gray-200 pb-5 dark:border-gray-700 md:flex-row">
            <h2 className="mb-3 shrink-0 text-lg font-medium uppercase text-black dark:text-white sm:text-xl md:mb-0 md:text-2xl">
              Choice Slip
            </h2>

            <div className="">
              <Button className="mb-5 rounded-md border-0 bg-[#a855f7]">
                <Link href="/type-choice-slip">Type Choice Slip</Link>
              </Button>
              <input
                type="text"
                id="large-input"
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
              <Tab.List className="flex gap-4">
                <Tab>
                  <Button
                    className={cn('rounded-md border-0', {
                      '!bg-blue-500': activeTab === 'all',
                      'bg-gray-200': activeTab !== 'all',
                    })}
                    onClick={() => setActiveTab('all')}
                  >
                    All
                  </Button>
                </Tab>
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
                      '!bg-green-500': activeTab === 'complete',
                      'bg-gray-200': activeTab !== 'complete',
                    })}
                    onClick={() => setActiveTab('complete')}
                  >
                    Complete
                  </Button>
                </Tab>
                <Tab>
                  <Button
                    className={cn('rounded-md border-0', {
                      '!bg-red-500': activeTab === 'failed',
                      'bg-gray-200': activeTab !== 'failed',
                    })}
                    onClick={() => setActiveTab('failed')}
                  >
                    Failed
                  </Button>
                </Tab>
              </Tab.List>
              <Tab.Panels>
                {/* All */}
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
                                Passport No
                              </th>
                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Travelling Country
                              </th>
                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                City
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
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      {item?.tcountry}
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      {item.city}
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      {moment(item?.created_at).format('DD/MM/YYYY')}
                                      <br />
                                      {moment(item?.created_at).format('hh:mm A')}
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      {item?.medical_list?.map((item, i, array) => (
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
                                      ))}
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      <h5 className={`rounded-full border-2 border-solid py-2 px-3 text-center ${getStatusColor(item?.status)} ${getStatusBackground(item?.status)}`}>
                                        {item?.status}
                                      </h5>
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

                {/* Pending */}
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
                                Passport No
                              </th>
                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Travelling Country
                              </th>
                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                City
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
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      {item?.tcountry}
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      {item.city}
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      {moment(item?.created_at).format('DD/MM/YYYY')}
                                      <br />
                                      {moment(item?.created_at).format('hh:mm A')}
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      {item?.medical_list?.map((item, i, array) => (
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
                                      ))}
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      <h5 className="rounded-full border-2 border-solid border-yellow-400 py-2 px-3 text-center bg-yellow-100 text-yellow-600">
                                        {item?.status}
                                      </h5>
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

                {/* Complete */}
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
                                <p>Travelling Country,</p>
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
                                  Pay Now
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
                                      {moment(item?.created_at).format('DD/MM/YYYY')}
                                      <br />
                                      {moment(item?.created_at).format('hh:mm A')}
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      {item?.medical_list?.map((item, i, array) => (
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
                                      ))}
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      <h5 className="rounded-full border-2 border-solid border-green-400 py-2 px-3 text-center bg-green-100 text-green-600">
                                        {item?.status}
                                      </h5>
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      <button
                                        onClick={() => {
                                          window.open(item.slip_url, '_blank');
                                        }}
                                        className="block w-[100px] rounded-sm bg-orange-400 p-2 text-center text-white"
                                      >
                                        Pay Now
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

                {/* Failed */}
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
                                Passport No
                              </th>
                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Travelling Country
                              </th>
                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                City
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
                                Reference
                              </th>
                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Actions
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
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      {item?.tcountry}
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      {item.city}
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      {moment(item?.created_at).format('DD/MM/YYYY')}
                                      <br />
                                      {moment(item?.created_at).format('hh:mm A')}
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      {item?.medical_list?.map((item, i, array) => (
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
                                      ))}
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      <h5 className="rounded-full border-2 border-solid border-red-400 py-2 px-3 text-center bg-red-100 text-red-600">
                                        {item?.status}
                                      </h5>
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      {item?.reference}
                                    </td>
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      <Button
                                        onClick={() => handleRetrySlip(item.id)}
                                        disabled={retryingSlips.has(item.id)}
                                        className="rounded-md border-0 bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed px-4 py-2"
                                      >
                                        {retryingSlips.has(item.id) ? 'Retrying...' : 'Retry'}
                                      </Button>
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
