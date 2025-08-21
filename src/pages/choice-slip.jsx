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
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTimeout, setSearchTimeout] = useState(null);
  
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

  // Debounced search effect
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      handleFetchNormalUser();
    }, 500); // 500ms delay
    
    setSearchTimeout(timeout);
    
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [search]);

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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortData = (data) => {
    if (!data || data.length === 0) return data;
    
    return [...data].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle nested properties
      if (sortField === 'name') {
        aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
        bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
      }
      
      // Handle date fields
      if (sortField === 'created_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      // Handle numeric fields
      if (sortField === 'id' || sortField === 'reference') {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      }
      
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return '↕️';
    }
    return sortDirection === 'asc' ? '↑' : '↓';
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

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    id="large-input"
                    className="w-64 sm:text-md block rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 pl-4 pr-4 py-2"
                    placeholder="Search by name, passport, country, city..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        setCurrentPage(1);
                        handleFetchNormalUser();
                      }
                    }}
                  />
                  {search && (
                    <button
                      onClick={() => {
                        setSearch('');
                        setCurrentPage(1);
                        handleFetchNormalUser();
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <Button
                  onClick={() => {
                    setCurrentPage(1);
                    handleFetchNormalUser();
                  }}
                  className="rounded-md border-0 bg-blue-500 hover:bg-blue-600 transition-colors px-4 py-2"
                >
                  Search
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="limit-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Show:
                </label>
                <select
                  id="limit-select"
                  value={limit}
                  onChange={(e) => {
                    setLimit(parseInt(e.target.value));
                    setCurrentPage(1); // Reset to first page when changing limit
                  }}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={75}>75</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <Button className="rounded-md border-0 bg-[#a855f7] hover:bg-[#9333ea] transition-colors">
                <Link href="/type-choice-slip">Type Choice Slip</Link>
              </Button>
            </div>
          </div>

          <div className="mt-5">
            {/* Summary Info */}
            <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Total Records:</span> {normalUserSlip.length > 0 ? totalPages * limit : 0} | 
                <span className="font-medium ml-2">Page:</span> {currentPage} of {totalPages} | 
                <span className="font-medium ml-2">Showing:</span> {normalUserSlip.length} per page
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Sort:</span> {sortField} ({sortDirection === 'asc' ? 'Ascending' : 'Descending'})
              </div>
            </div>
            
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
                              <th 
                                className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4 cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort('id')}
                              >
                                <div className="flex items-center justify-between">
                                  SL No {getSortIcon('id')}
                                </div>
                              </th>
                              <th 
                                className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4 cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort('name')}
                              >
                                <div className="flex items-center justify-between">
                                  Name {getSortIcon('name')}
                                </div>
                              </th>
                              <th 
                                className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4 cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort('passport')}
                              >
                                <div className="flex items-center justify-between">
                                  Passport No {getSortIcon('passport')}
                                </div>
                              </th>
                              <th 
                                className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4 cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort('tcountry')}
                              >
                                <div className="flex items-center justify-between">
                                  Travelling Country {getSortIcon('tcountry')}
                                </div>
                              </th>
                              <th 
                                className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4 cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort('city')}
                              >
                                <div className="flex items-center justify-between">
                                  City {getSortIcon('city')}
                                </div>
                              </th>
                              <th 
                                className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4 cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort('created_at')}
                              >
                                <div className="flex items-center justify-between">
                                  Submit Date, Time {getSortIcon('created_at')}
                                </div>
                              </th>
                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Choice Center
                              </th>
                              <th 
                                className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4 cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort('status')}
                              >
                                <div className="flex items-center justify-between">
                                  Status {getSortIcon('status')}
                                </div>
                              </th>
                              <th 
                                className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4 cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort('reference')}
                              >
                                <div className="flex items-center justify-between">
                                  Reference {getSortIcon('reference')}
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm">
                            {sortData(normalUserSlip).length > 0 &&
                              sortData(normalUserSlip).map((item, i) => {
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
