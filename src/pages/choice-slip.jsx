/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import cn from 'classnames';
import { NextSeo } from 'next-seo';
import Button from '@/components/ui/button';
import Scrollbar from '@/components/ui/scrollbar';
import { Tab } from '@headlessui/react';
import withAuth from '@/hook/PrivateRoute';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import moment from 'moment';
import Link from 'next/link';
import Pagination from '@/components/gcc-component/Pagination';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from 'react-query';

const userChoiceSlip = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(25);
  const [normalUserSlip, setNormalUserSlip] = useState([]);
  const [retryingSlips, setRetryingSlips] = useState(new Set());
  const [sortField, setSortField] = useState('completed_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [hasError, setHasError] = useState(false);

  const prevSearchRef = useRef(search);
  
  const queryClient = useQueryClient();
  
  // Helper function to format completed date
  const formatCompletedDate = (completedAt) => {
    if (!completedAt) {
      return "Not Completed Yet";
    }
    return (
      <>
        {moment(completedAt).format('DD/MM/YYYY')}
        <br />
        {moment(completedAt).format('hh:mm A')}
      </>
    );
  };

  // Helper function to calculate professional SL No
  const calculateSLNo = (index) => {
    return (currentPage - 1) * limit + index + 1;
  };
  
  // React Query for data fetching
  const { data, isLoading: queryLoading, error, refetch } = useQuery(
    ['choice-slips', currentPage, limit, activeTab, search],
    async () => {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('perPage', limit.toString());
      
      // Always send status to get proper filtering
      params.append('status', activeTab);
      
      if (search.trim()) {
        params.append('search', search.trim());
      }



      const response = await fetch(`/api/choice-slips?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'success' && data.slips) {
        return data;
      } else {
        throw new Error('API returned error status');
      }
    },
    {
      refetchOnWindowFocus: true,
      retry: 1,
      staleTime: 0, // No cache - always fetch fresh data
      cacheTime: 0, // No cache - always fetch fresh data
      onSuccess: (data) => {
        // Ensure we're getting the filtered data
        const filteredData = data.slips?.data || [];
        

        
        // Set both the original data and filtered data
        setNormalUserSlip(filteredData);
        setTotalPages(data.slips?.last_page || 1);
        setHasError(false);
        
        // Update current page if it's out of bounds
        if (currentPage > (data.slips?.last_page || 1)) {
          setCurrentPage(1);
        }
      },
      onError: (error) => {
        setNormalUserSlip([]);
        setTotalPages(1);
        setHasError(true);
        toast.error(error.message || 'Failed to fetch data. Please try again.');
      }
    }
  );

  // Retry slip mutation
  const retryMutation = useMutation(
    async (slipId) => {
      const response = await fetch('/api/retry-slip-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slip_id: slipId }),
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        return data;
      } else {
        throw new Error(data.message || 'Failed to retry slip');
      }
    },
    {
      onSuccess: () => {
        toast.success('Slip retry initiated successfully!');
        // Invalidate and refetch the data
        queryClient.invalidateQueries(['choice-slips']);
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to retry slip. Please try again.');
      }
    }
  );

  // Safety effect to ensure normalUserSlip is always an array
  useEffect(() => {
    if (!Array.isArray(normalUserSlip)) {
      setNormalUserSlip([]);
      setHasError(true);
    }
  }, [normalUserSlip]);



  // Handle limit changes - reset to first page and refetch
  useEffect(() => {
    setCurrentPage(1);
    // Refetch data when limit changes to ensure proper pagination
    setTimeout(() => {
      refetch();
    }, 0);
  }, [limit, refetch]);

  // Handle activeTab changes - reset to first page and refetch
  useEffect(() => {
    setCurrentPage(1);
    // Refetch data when tab changes to ensure proper status filtering
    setTimeout(() => {
      refetch();
    }, 0);
  }, [activeTab, refetch]);

  // Handle search changes - reset to first page
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Debounced search effect
  useEffect(() => {
    // Clear any existing search timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Create a new timeout for search debouncing
    const timeout = setTimeout(() => {
      // Reset to first page when searching
      if (search !== prevSearchRef.current) {
        setCurrentPage(1);
      }
      
      // Update the ref to track the current search value
      prevSearchRef.current = search;
    }, search ? 500 : 0); // 500ms delay for search, no delay for other changes
    
    setSearchTimeout(timeout);
    
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [activeTab, currentPage, search, limit]);

  const handleRetrySlip = async (slipId) => {
    try {
      setRetryingSlips(prev => new Set(prev).add(slipId));
      await retryMutation.mutateAsync(slipId);
    } catch (error) {
      // Handle retry error silently
    } finally {
      setRetryingSlips(prev => {
        const newSet = new Set(prev);
        newSet.delete(slipId);
        return newSet;
      });
    }
  };

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
    // Safety check - ensure data is valid
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }
    
    return [...data].sort((a, b) => {
      // Additional safety check for items
      if (!a || !b || typeof a !== 'object' || typeof b !== 'object') {
        return 0;
      }
      
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle nested properties
      if (sortField === 'name') {
        aValue = `${a.first_name || ''} ${a.last_name || ''}`.toLowerCase();
        bValue = `${b.first_name || ''} ${b.last_name || ''}`.toLowerCase();
      }
      
      // Handle date fields
      if (sortField === 'completed_at') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
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
                    disabled={queryLoading}
                    className="w-64 sm:text-md block rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 pl-4 pr-4 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Search by name, passport, country, city..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        setCurrentPage(1);
                        // Trigger refetch after setting page
                        setTimeout(() => {
                          refetch();
                        }, 0);
                      }
                    }}
                  />
                  {search && (
                    <button
                      onClick={() => {
                        setSearch('');
                        setCurrentPage(1);
                        // Trigger refetch after clearing search
                        setTimeout(() => {
                          refetch();
                        }, 0);
                      }}
                      disabled={queryLoading}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <Button
                  onClick={() => {
                    setCurrentPage(1);
                    refetch();
                  }}
                  disabled={queryLoading}
                  className="rounded-md border-0 px-4 py-2 font-medium transition-colors cursor-pointer bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {queryLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Searching...
                    </div>
                  ) : (
                    'Search'
                  )}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="limit-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Show:
                </label>
                <select
                  id="limit-select"
                  value={limit}
                  disabled={queryLoading}
                  onChange={(e) => {
                    const newLimit = parseInt(e.target.value);
                    setLimit(newLimit);
                    setCurrentPage(1); // Reset to first page when changing limit
                    // Trigger refetch with new limit after state update
                    setTimeout(() => {
                      refetch();
                    }, 0);
                  }}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={75}>75</option>
                  <option value={100}>100</option>
                </select>
                {queryLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                )}
              </div>
              

              
                                                           <Button className="rounded-md border-0 px-4 py-2 font-medium transition-colors cursor-pointer bg-[#a855f7] hover:bg-[#9333ea] text-white">
                   <Link href="/type-choice-slip">Type Choice Slip</Link>
                 </Button>
            </div>
          </div>

          <div className="mt-5">
            {/* Summary Info */}
            <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">

                              <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Total Records:</span> {Array.isArray(normalUserSlip) && normalUserSlip.length > 0 ? (totalPages * limit) : 0} | 
                  <span className="font-medium ml-2">Page:</span> {currentPage} of {totalPages} | 
                  <span className="font-medium ml-2">Showing:</span> {Array.isArray(normalUserSlip) ? normalUserSlip.length : 0} of {Array.isArray(normalUserSlip) && normalUserSlip.length > 0 ? (totalPages * limit) : 0} records

                </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Sort:</span> {sortField} ({sortDirection === 'asc' ? 'Ascending' : 'Descending'})
              </div>
            </div>
            


            {/* Safety check - ensure normalUserSlip is always an array */}
            {hasError && (
              <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900 dark:text-red-200">
                <p className="font-medium">Data Error</p>
                <p>Invalid data received. Please refresh the page or try again.</p>
                <div className="mt-2 text-sm">
                  <p><strong>Data Type:</strong> {typeof normalUserSlip}</p>
                  <p><strong>Data Value:</strong> {JSON.stringify(normalUserSlip, null, 2)}</p>
                </div>
                <button 
                  onClick={refetch}
                  className="mt-2 rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            )}
            

            
            {/* Loading indicator */}
            {queryLoading && (
              <div className="mb-4 rounded-lg bg-blue-50 p-4 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <p>Loading data...</p>
                </div>
              </div>
            )}


            {/* Only render tabs if we have valid data and not loading */}
            {!queryLoading && Array.isArray(normalUserSlip) && (
              <>
                {/* Tab buttons - always show regardless of data */}
            <Tab.Group>
              <Tab.List className="flex gap-4">
                    <Tab 
                      className={cn('rounded-md border-0 px-4 py-2 font-medium transition-colors cursor-pointer', {
                        '!bg-blue-500 text-white': activeTab === 'all',
                        'bg-gray-200 text-gray-700 hover:bg-gray-300': activeTab !== 'all',
                        'opacity-50 cursor-not-allowed': queryLoading
                    })}
                    onClick={() => {
                      if (queryLoading) return;
                      setActiveTab('all');
                      setCurrentPage(1);
                    }}
                    disabled={queryLoading}
                  >
                    All
                </Tab>
                    <Tab 
                      className={cn('rounded-md border-0 px-4 py-2 font-medium transition-colors cursor-pointer', {
                        '!bg-yellow-500 text-white': activeTab === 'pending',
                        'bg-gray-200 text-gray-700 hover:bg-gray-300': activeTab !== 'pending',
                        'opacity-50 cursor-not-allowed': queryLoading
                    })}
                    onClick={() => {
                      if (queryLoading) return;
                      setActiveTab('pending');
                      setCurrentPage(1);
                    }}
                    disabled={queryLoading}
                  >
                    Pending
                </Tab>
                    <Tab 
                      className={cn('rounded-md border-0 px-4 py-2 font-medium transition-colors cursor-pointer', {
                        '!bg-green-500 text-white': activeTab === 'complete',
                        'bg-gray-200 text-gray-700 hover:bg-gray-300': activeTab !== 'complete',
                        'opacity-50 cursor-not-allowed': queryLoading
                    })}
                    onClick={() => {
                      if (queryLoading) return;
                      setActiveTab('complete');
                      setCurrentPage(1);
                    }}
                    disabled={queryLoading}
                  >
                    Complete
                </Tab>
                    <Tab 
                      className={cn('rounded-md border-0 px-4 py-2 font-medium transition-colors cursor-pointer', {
                        '!bg-red-500 text-white': activeTab === 'failed',
                        'bg-gray-200 text-gray-700 hover:bg-gray-300': activeTab !== 'failed',
                        'opacity-50 cursor-not-allowed': queryLoading
                    })}
                    onClick={() => {
                      if (queryLoading) return;
                      setActiveTab('failed');
                      setCurrentPage(1);
                    }}
                    disabled={queryLoading}
                  >
                    Failed
                </Tab>
              </Tab.List>
                  
                  {/* Tab content - only show when there's data */}
                  {normalUserSlip.length > 0 ? (
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
                                onClick={() => handleSort('completed_at')}
                              >
                                <div className="flex items-center justify-between">
                                  Completed Date, Time {getSortIcon('completed_at')}
                                </div>
                              </th>
                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Choice Center
                              </th>
                              <th 
                                      className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4 cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort('status')}
                              >
                                <div className="flex items-center justify-between">
                                  Status {getSortIcon('status')}
                                </div>
                              </th>
                              <th 
                                      className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4 cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort('reference')}
                              >
                                <div className="flex items-center justify-between">
                                  Reference {getSortIcon('reference')}
                                </div>
                              </th>
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                      Actions
                                    </th>
                            </tr>
                          </thead>
                          <tbody className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm">
                                  {Array.isArray(normalUserSlip) && normalUserSlip.length > 0 &&
                              sortData(normalUserSlip).map((item, i) => {
                                      // Additional safety check for item
                                      if (!item || typeof item !== 'object') {
                                        return null;
                                      }
                                      
                                return (
                                  <tr
                                    key={i}
                                    className="mb-3 items-center rounded-lg bg-white uppercase shadow-card last:mb-0 hover:shadow-large dark:bg-light-dark"
                                  >
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      {calculateSLNo(i)}
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
                                      {formatCompletedDate(item?.completed_at)}
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
                                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                            <div className="flex flex-col gap-2">
                                              {item?.status?.toLowerCase() === 'complete' && item?.slip_url ? (
                                                <button
                                                  onClick={() => {
                                                    window.open(item.slip_url, '_blank');
                                                  }}
                                                  className="block w-[100px] rounded-sm bg-orange-400 p-2 text-center text-white hover:bg-orange-500 transition-colors"
                                                >
                                                  Pay Now
                                                </button>
                                              ) : null}
                                              {item?.status?.toLowerCase() === 'failed' && (
                                                <Button
                                                  onClick={() => handleRetrySlip(item.id)}
                                                  disabled={retryingSlips.has(item.id)}
                                                  className="rounded-md border-0 bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed px-4 py-2 text-sm"
                                                >
                                                  {retryingSlips.has(item.id) ? 'Retrying...' : 'Retry'}
                                                </Button>
                                              )}
                                            </div>
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
                            fetchData={(newPage) => {
                              setCurrentPage(newPage);
                              // Trigger refetch with new page
                              setTimeout(() => {
                                refetch();
                              }, 0);
                            }}
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
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                SL No
                              </th>
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Name
                              </th>
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Passport No
                              </th>
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Travelling Country
                              </th>
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                City
                              </th>
                              
                              <th 
                                className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4 cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSort('completed_at')}
                              >
                                <div className="flex items-center justify-between">
                                  Completed Date, Time {getSortIcon('completed_at')}
                                </div>
                              </th>
                              <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Choice Center
                              </th>
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Status
                              </th>
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Reference
                              </th>
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                      Actions
                                    </th>
                            </tr>
                          </thead>
                          <tbody className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm">
                                  {Array.isArray(normalUserSlip) && normalUserSlip.length > 0 &&
                              normalUserSlip.map((item, i) => {
                                      // Additional safety check for item
                                      if (!item || typeof item !== 'object') {
                                        return null;
                                      }
                                      
                                return (
                                  <tr
                                    key={i}
                                    className="mb-3 items-center rounded-lg bg-white uppercase shadow-card last:mb-0 hover:shadow-large dark:bg-light-dark"
                                  >
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      {calculateSLNo(i)}
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
                                      {formatCompletedDate(item?.completed_at)}
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
                                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                            <div className="flex flex-col gap-2">
                                              {item?.status?.toLowerCase() === 'complete' && item?.slip_url ? (
                                                <button
                                                  onClick={() => {
                                                    window.open(item.slip_url, '_blank');
                                                  }}
                                                  className="block w-[100px] rounded-sm bg-orange-400 p-2 text-center text-white hover:bg-orange-500 transition-colors"
                                                >
                                                  Pay Now
                                                </button>
                                              ) : null}
                                              {item?.status?.toLowerCase() === 'failed' && (
                                                <Button
                                                  onClick={() => handleRetrySlip(item.id)}
                                                  disabled={retryingSlips.has(item.id)}
                                                  className="rounded-md border-0 bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed px-4 py-2 text-sm"
                                                >
                                                  {retryingSlips.has(item.id) ? 'Retrying...' : 'Retry'}
                                                </Button>
                                              )}
                                            </div>
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
                            fetchData={(newPage) => {
                              setCurrentPage(newPage);
                              // Trigger refetch with new page
                              setTimeout(() => {
                                refetch();
                              }, 0);
                            }}
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
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                SL No
                              </th>
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Name
                              </th>
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                <p>Passport No,</p>
                                <p>Travelling Country,</p>
                                <p>City</p>
                              </th>
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Completed Date, Time
                              </th>
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Choice Center
                              </th>
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Status
                              </th>
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                <a href="" className="">
                                  Pay Now
                                </a>
                              </th>
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Reference
                              </th>
                            </tr>
                          </thead>
                              <tbody className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm">
                                   {Array.isArray(normalUserSlip) && normalUserSlip.length > 0 &&
                               normalUserSlip.map((item, i) => {
                                      // Additional safety check for item
                                      if (!item || typeof item !== 'object') {
                                        return null;
                                      }
                                      
                                return (
                                  <tr
                                    key={i}
                                    className="mb-3 items-center rounded-lg bg-white uppercase shadow-card last:mb-0 hover:shadow-large dark:bg-light-dark"
                                  >
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      {calculateSLNo(i)}
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
                                      {formatCompletedDate(item?.completed_at)}
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
                                            {item?.status?.toLowerCase() === 'complete' && item?.slip_url ? (
                                      <button
                                        onClick={() => {
                                          window.open(item.slip_url, '_blank');
                                        }}
                                                className="block w-[100px] rounded-sm bg-orange-400 p-2 text-center text-white hover:bg-orange-500 transition-colors"
                                      >
                                        Pay Now
                                      </button>
                                            ) : (
                                              <span className="text-gray-400 text-xs">-</span>
                                            )}
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
                            fetchData={(newPage) => {
                              setCurrentPage(newPage);
                              // Trigger refetch with new page
                              setTimeout(() => {
                                refetch();
                              }, 0);
                            }}
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
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                SL No
                              </th>
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Name
                              </th>
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Passport No
                              </th>
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Travelling Country
                              </th>
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                City
                              </th>
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Completed Date, Time
                              </th>
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Choice Center
                              </th>
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Status
                              </th>
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Reference
                              </th>
                                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                Actions
                              </th>
                            </tr>
                          </thead>
                                                     <tbody className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm">
                                   {Array.isArray(normalUserSlip) && normalUserSlip.length > 0 &&
                               normalUserSlip.map((item, i) => {
                                      // Additional safety check for item
                                      if (!item || typeof item !== 'object') {
                                        return null;
                                      }
                                      
                                return (
                                  <tr
                                    key={i}
                                    className="mb-3 items-center rounded-lg bg-white uppercase shadow-card last:mb-0 hover:shadow-large dark:bg-light-dark"
                                  >
                                    <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                      {calculateSLNo(i)}
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
                                      {formatCompletedDate(item?.completed_at)}
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
                            fetchData={(newPage) => {
                              setCurrentPage(newPage);
                              // Trigger refetch with new page
                              setTimeout(() => {
                                refetch();
                              }, 0);
                            }}
                          />
                        </div>
                      </div>
                    </Scrollbar>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
                  ) : (
                    // Show message when no data in tab content area
                    <div className="mt-4 rounded-lg bg-gray-50 p-8 text-center text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      <p className="text-lg font-medium mb-2">No data available for this tab</p>
                      <p className="text-sm">Try switching to a different tab or adjusting your search criteria.</p>
                    </div>
                  )}
            </Tab.Group>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// export default userChoiceSlip;
export default withAuth(userChoiceSlip, {
  isProtectedRoute: true,
  show: true,
  requireAdmin: false, // Only admins can access this page
});
