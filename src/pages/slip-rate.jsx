/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { NextSeo } from 'next-seo';
import Scrollbar from '@/components/ui/scrollbar';
import withAuth from '@/hook/PrivateRoute';
import { UserSlipRate } from '../components/UserSlipRate/UserSlipRate';
import { useState, useEffect, useCallback } from 'react';
import cn from 'classnames';
import Button from '@/components/ui/button';
import { Tab } from '@headlessui/react';

const slipRate = () => {
  const [activeTab, setActiveTab] = useState(80);
  // const [limit, setLimit] = useState(93);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [normalUserSlip, setNormalUserSlip] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleFetchNormalUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      const params = new URLSearchParams({
        search: search,
        city: activeTab,
      });
      
      const response = await fetch(`/api/medicals?${params}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setNormalUserSlip(data.medicals || []);
        setHasError(false);
      } else {
        setNormalUserSlip([]);
        setHasError(true);
      }
    } catch (err) {
      setNormalUserSlip([]);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [search, activeTab]);

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
          Slip Pricing
          </h2>

          <div className="">
            <input
              type="text"
              id="large-input"
              className="sm:text-md block rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Search..."
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            {isLoading && (
              <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                Loading data...
              </div>
            )}
          </div>
        </div>

        <div className="mt-5">
          <Tab.Group>
            <Tab.List className="flex gap-4">
              <Tab>
                <Button
                  className={cn('rounded-md border-0', {
                    '!bg-yellow-500': activeTab === 80,
                    'bg-gray-200': activeTab !== 80,
                  })}
                  onClick={() => setActiveTab(80)}
                >
                  Dhaka
                </Button>
              </Tab>
              <Tab>
                <Button
                  className={cn('rounded-md border-0', {
                    '!bg-orange-500': activeTab === 81,
                    'bg-gray-200': activeTab !== 81,
                  })}
                  onClick={() => setActiveTab(81)}
                >
                  Chittagong
                </Button>
              </Tab>
              <Tab>
                <Button
                  className={cn('rounded-md border-0', {
                    '!bg-orange-500': activeTab === 2030,
                    'bg-gray-200': activeTab !== 2030,
                  })}
                  onClick={() => setActiveTab(2030)}
                >
                  Rajshahi
                </Button>
              </Tab>
              <Tab>
                <Button
                  className={cn('rounded-md border-0', {
                    '!bg-orange-500': activeTab === 2032,
                    'bg-gray-200': activeTab !== 2032,
                  })}
                  onClick={() => setActiveTab(2032)}
                >
                  Comilla
                </Button>
              </Tab>
              <Tab>
                <Button
                  className={cn('rounded-md border-0', {
                    '!bg-orange-500': activeTab === 2033,
                    'bg-gray-200': activeTab !== 2033,
                  })}
                  onClick={() => setActiveTab(2033)}
                >
                  Cox&apos;s Bazar
                </Button>
              </Tab>
              <Tab>
                <Button
                  className={cn('rounded-md border-0', {
                    '!bg-orange-500': activeTab === 2031,
                    'bg-gray-200': activeTab !== 2031,
                  })}
                  onClick={() => setActiveTab(2031)}
                >
                  Barishal
                </Button>
              </Tab>
              <Tab>
                <Button
                  className={cn('rounded-md border-0', {
                    '!bg-orange-500': activeTab === 83,
                    'bg-gray-200': activeTab !== 83,
                  })}
                  onClick={() => setActiveTab(83)}
                >
                  Sylhet
                </Button>
              </Tab>
            </Tab.List>
            <Tab.Panels>
              {/* Dhaka */}
              <Tab.Panel>
                <div className="-mx-0.5">
                  <Scrollbar style={{ width: '100%' }} autoHide="never">
                    <div className="px-0.5">
                      <table className="transaction-table w-full border-separate border-0">
                        <thead className="text-sm text-gray-500 dark:text-gray-300">
                          <tr>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              SL No
                            </th>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              Medical Center Serial
                            </th>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              KSA Price
                            </th>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              KUET Price
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm">
                          {isLoading ? (
                            <tr>
                              <td colSpan="4" className="px-2 py-4 text-center">Loading...</td>
                            </tr>
                          ) : hasError ? (
                            <tr>
                              <td colSpan="4" className="px-2 py-4 text-center text-red-500">No data found.</td>
                            </tr>
                          ) : normalUserSlip?.map((data, i) => (
                            <tr
                              key={i}
                              className="mb-3 items-center rounded-lg bg-white uppercase shadow-card last:mb-0 hover:shadow-large dark:bg-light-dark"
                            >
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                {i + 1}
                              </td>
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                <h4 className="font-medium text-orange-400">
                                  {data.name}
                                </h4>
                              </td>
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                <h4 className="font-medium text-orange-400">
                                  {data?.ksa_price}
                                </h4>
                              </td>
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                <h4 className="font-medium text-orange-400">
                                  {data?.kuet_price}
                                </h4>
                              </td>
                            </tr>
                          )) || (normalUserSlip.length === 0 && !isLoading && !hasError ? (
                            <tr>
                              <td colSpan="4" className="px-2 py-4 text-center text-gray-500">No data found for this city.</td>
                            </tr>
                          ) : null)}
                        </tbody>
                      </table>
                    </div>
                  </Scrollbar>
                </div>
              </Tab.Panel>

              {/* Chittagong */}
              <Tab.Panel>
                <div className="-mx-0.5">
                  <Scrollbar style={{ width: '100%' }} autoHide="never">
                    <div className="px-0.5">
                      <table className="transaction-table w-full border-separate border-0">
                        <thead className="text-sm text-gray-500 dark:text-gray-300">
                          <tr>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              SL No
                            </th>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              Medical Center Serial
                            </th>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              KSA Price
                            </th>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              KUET Price
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm">
                          {isLoading ? (
                            <tr>
                              <td colSpan="4" className="px-2 py-4 text-center">Loading...</td>
                            </tr>
                          ) : hasError ? (
                            <tr>
                              <td colSpan="4" className="px-2 py-4 text-center text-red-500">No data found.</td>
                            </tr>
                          ) : normalUserSlip?.map((data, i) => (
                            <tr
                              key={i}
                              className="mb-3 items-center rounded-lg bg-white uppercase shadow-card last:mb-0 hover:shadow-large dark:bg-light-dark"
                            >
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                {i + 1}
                              </td>
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                <h4 className="font-medium text-orange-400">
                                  {data.name}
                                </h4>
                              </td>
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                <h4 className="font-medium text-orange-400">
                                  {data?.ksa_price}
                                </h4>
                              </td>
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                <h4 className="font-medium text-orange-400">
                                  {data?.kuet_price}
                                </h4>
                              </td>
                            </tr>
                          )) || (normalUserSlip.length === 0 && !isLoading && !hasError ? (
                            <tr>
                              <td colSpan="4" className="px-2 py-4 text-center text-gray-500">No data found for this city.</td>
                            </tr>
                          ) : null)}
                        </tbody>
                      </table>
                    </div>
                  </Scrollbar>
                </div>
              </Tab.Panel>

              {/* Rajshahi */}
              <Tab.Panel>
                <div className="-mx-0.5">
                  <Scrollbar style={{ width: '100%' }} autoHide="never">
                    <div className="px-0.5">
                      <table className="transaction-table w-full border-separate border-0">
                        <thead className="text-sm text-gray-500 dark:text-gray-300">
                          <tr>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              SL No
                            </th>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              Medical Center Serial
                            </th>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              KSA Price
                            </th>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              KUET Price
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm">
                          {isLoading ? (
                            <tr>
                              <td colSpan="4" className="px-2 py-4 text-center">Loading...</td>
                            </tr>
                          ) : hasError ? (
                            <tr>
                              <td colSpan="4" className="px-2 py-4 text-center text-red-500">No data found.</td>
                            </tr>
                          ) : normalUserSlip?.map((data, i) => (
                            <tr
                              key={i}
                              className="mb-3 items-center rounded-lg bg-white uppercase shadow-card last:mb-0 hover:shadow-large dark:bg-light-dark"
                            >
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                {i + 1}
                              </td>
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                <h4 className="font-medium text-orange-400">
                                  {data.name}
                                </h4>
                              </td>
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                <h4 className="font-medium text-orange-400">
                                  {data?.ksa_price}
                                </h4>
                              </td>
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                <h4 className="font-medium text-orange-400">
                                  {data?.kuet_price}
                                </h4>
                              </td>
                            </tr>
                          )) || (normalUserSlip.length === 0 && !isLoading && !hasError ? (
                            <tr>
                              <td colSpan="4" className="px-2 py-4 text-center text-gray-500">No data found for this city.</td>
                            </tr>
                          ) : null)}
                        </tbody>
                      </table>
                    </div>
                  </Scrollbar>
                </div>
              </Tab.Panel>

              {/* Comilla */}
              <Tab.Panel>
                <div className="-mx-0.5">
                  <Scrollbar style={{ width: '100%' }} autoHide="never">
                    <div className="px-0.5">
                      <table className="transaction-table w-full border-separate border-0">
                        <thead className="text-sm text-gray-500 dark:text-gray-300">
                          <tr>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              SL No
                            </th>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              Medical Center Serial
                            </th>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              KSA Price
                            </th>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              KUET Price
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm">
                          {isLoading ? (
                            <tr>
                              <td colSpan="4" className="px-2 py-4 text-center">Loading...</td>
                            </tr>
                          ) : hasError ? (
                            <tr>
                              <td colSpan="4" className="px-2 py-4 text-center text-red-500">No data found.</td>
                            </tr>
                          ) : normalUserSlip?.map((data, i) => (
                            <tr
                              key={i}
                              className="mb-3 items-center rounded-lg bg-white uppercase shadow-card last:mb-0 hover:shadow-large dark:bg-light-dark"
                            >
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                {i + 1}
                              </td>
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                <h4 className="font-medium text-orange-400">
                                  {data.name}
                                </h4>
                              </td>
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                <h4 className="font-medium text-orange-400">
                                  {data?.ksa_price}
                                </h4>
                              </td>
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                <h4 className="font-medium text-orange-400">
                                  {data?.kuet_price}
                                </h4>
                              </td>
                            </tr>
                          )) || (normalUserSlip.length === 0 && !isLoading && !hasError ? (
                            <tr>
                              <td colSpan="4" className="px-2 py-4 text-center text-gray-500">No data found for this city.</td>
                            </tr>
                          ) : null)}
                        </tbody>
                      </table>
                    </div>
                  </Scrollbar>
                </div>
              </Tab.Panel>

              {/* Cox&apos;s Bazar */}
              <Tab.Panel>
                <div className="-mx-0.5">
                  <Scrollbar style={{ width: '100%' }} autoHide="never">
                    <div className="px-0.5">
                      <table className="transaction-table w-full border-separate border-0">
                        <thead className="text-sm text-gray-500 dark:text-gray-300">
                          <tr>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              SL No
                            </th>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              Medical Center Serial
                            </th>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              KSA Price
                            </th>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              KUET Price
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm">
                          {isLoading ? (
                            <tr>
                              <td colSpan="4" className="px-2 py-4 text-center">Loading...</td>
                            </tr>
                          ) : hasError ? (
                            <tr>
                              <td colSpan="4" className="px-2 py-4 text-center text-red-500">No data found.</td>
                            </tr>
                          ) : normalUserSlip?.map((data, i) => (
                            <tr
                              key={i}
                              className="mb-3 items-center rounded-lg bg-white uppercase shadow-card last:mb-0 hover:shadow-large dark:bg-light-dark"
                            >
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                {i + 1}
                              </td>
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                <h4 className="font-medium text-orange-400">
                                  {data.name}
                                </h4>
                              </td>
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                <h4 className="font-medium text-orange-400">
                                  {data?.ksa_price}
                                </h4>
                              </td>
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                <h4 className="font-medium text-orange-400">
                                  {data?.kuet_price}
                                </h4>
                              </td>
                            </tr>
                          )) || (normalUserSlip.length === 0 && !isLoading && !hasError ? (
                            <tr>
                              <td colSpan="4" className="px-2 py-4 text-center text-gray-500">No data found for this city.</td>
                            </tr>
                          ) : null)}
                        </tbody>
                      </table>
                    </div>
                  </Scrollbar>
                </div>
              </Tab.Panel>

              {/* Barishal */}
              <Tab.Panel>
                <div className="-mx-0.5">
                  <Scrollbar style={{ width: '100%' }} autoHide="never">
                    <div className="px-0.5">
                      <table className="transaction-table w-full border-separate border-0">
                        <thead className="text-sm text-gray-500 dark:text-gray-300">
                          <tr>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              SL No
                            </th>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              Medical Center Serial
                            </th>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              KSA Price
                            </th>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              KUET Price
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm">
                          {isLoading ? (
                            <tr>
                              <td colSpan="4" className="px-2 py-4 text-center">Loading...</td>
                            </tr>
                          ) : hasError ? (
                            <tr>
                              <td colSpan="4" className="px-2 py-4 text-center text-red-500">No data found.</td>
                            </tr>
                          ) : normalUserSlip?.map((data, i) => (
                            <tr
                              key={i}
                              className="mb-3 items-center rounded-lg bg-white uppercase shadow-card last:mb-0 hover:shadow-large dark:bg-light-dark"
                            >
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                {i + 1}
                              </td>
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                <h4 className="font-medium text-orange-400">
                                  {data.name}
                                </h4>
                              </td>
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                <h4 className="font-medium text-orange-400">
                                  {data?.ksa_price}
                                </h4>
                              </td>
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                <h4 className="font-medium text-orange-400">
                                  {data?.kuet_price}
                                </h4>
                              </td>
                            </tr>
                          )) || (normalUserSlip.length === 0 && !isLoading && !hasError ? (
                            <tr>
                              <td colSpan="4" className="px-2 py-4 text-center text-gray-500">No data found for this city.</td>
                            </tr>
                          ) : null)}
                        </tbody>
                      </table>
                    </div>
                  </Scrollbar>
                </div>
              </Tab.Panel>

              {/* Sylhet */}
              <Tab.Panel>
                <div className="-mx-0.5">
                  <Scrollbar style={{ width: '100%' }} autoHide="never">
                    <div className="px-0.5">
                      <table className="transaction-table w-full border-separate border-0">
                        <thead className="text-sm text-gray-500 dark:text-gray-300">
                          <tr>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              SL No
                            </th>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              Medical Center Serial
                            </th>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              KSA Price
                            </th>
                            <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-bl-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                              KUET Price
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm">
                          {isLoading ? (
                            <tr>
                              <td colSpan="4" className="px-2 py-4 text-center">Loading...</td>
                            </tr>
                          ) : hasError ? (
                            <tr>
                              <td colSpan="4" className="px-2 py-4 text-center text-red-500">No data found.</td>
                            </tr>
                          ) : normalUserSlip?.map((data, i) => (
                            <tr
                              key={i}
                              className="mb-3 items-center rounded-lg bg-white uppercase shadow-card last:mb-0 hover:shadow-large dark:bg-light-dark"
                            >
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                {i + 1}
                              </td>
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                <h4 className="font-medium text-orange-400">
                                  {data.name}
                                </h4>
                              </td>
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                <h4 className="font-medium text-orange-400">
                                  {data?.ksa_price}
                                </h4>
                              </td>
                              <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                <h4 className="font-medium text-orange-400">
                                  {data?.kuet_price}
                                </h4>
                              </td>
                            </tr>
                          )) || (normalUserSlip.length === 0 && !isLoading && !hasError ? (
                            <tr>
                              <td colSpan="4" className="px-2 py-4 text-center text-gray-500">No data found for this city.</td>
                            </tr>
                          ) : null)}
                        </tbody>
                      </table>
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
export default withAuth(slipRate, {
  isProtectedRoute: true,
  show: true,
  requireAdmin: false, // Only admins can access this page
});
