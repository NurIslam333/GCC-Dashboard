/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */

import { NextSeo } from 'next-seo';
import RootLayout from '@/layouts/_root-layout';
import Scrollbar from '@/components/ui/scrollbar';
import withAuth from '@/hook/PrivateRoute';
import Pagination from '@/components/gcc-component/Pagination';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { headers } from '@/utls/auth';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Switch } from '@headlessui/react';

const totalUser = () => {
  const [limit, setLimit] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [normalUserSlip, setNormalUserSlip] = useState([]);
  const [fetch, setFetch] = useState(false);

  // const handleActive = async(event) => {
  //   const data = event.target.checked
  //   console.log(data)
  // }
  const handleActive = async (event, id) => {
    try {
      const response = await axios.post(
        `${process.env.API_URL}/admin/update-user-status/${id}`,
        {
          status: event.target.checked === true ? 'unlock' : 'lock',
        },
        {
          headers: headers,
        }
      );

      if (response.data.status) {
        toast.success('User status updated successfull');
        setFetch(true);
      }

      if (response.data.status === 'error') {
        Object.keys(response.data.message.error).forEach((key) => {
          const errorMessage = response?.data?.message.error[key][0];
          toast.error(errorMessage);
        });
        // console.log('Error submitting form:', response.data.message.error);
      }

      // Handle successful response if needed
    } catch (error) {
      console.error('Error updating price:', error);
      // Handle error appropriately (e.g., show a user-friendly error message)
    }
  };

  const handlePriceUpdate = async (event, id) => {
    try {
      if (event.key === 'Enter' && event.target.value > 0) {
        const response = await axios.post(
          `${process.env.API_URL}/admin/users/update-price/${id}`,
          {
            price: event.target.value,
          },
          {
            headers: headers,
          }
        );

        if (response.data.status === 'success') {
          toast.success('Price Update   Successfully !');
        }

        if (response.data.status === 'error') {
          Object.keys(response.data.message.error).forEach((key) => {
            const errorMessage = response?.data?.message.error[key][0];
            toast.error(errorMessage);
          });
          // console.log('Error submitting form:', response.data.message.error);
        }

        // Handle successful response if needed
      }
    } catch (error) {
      console.error('Error updating price:', error);
      // Handle error appropriately (e.g., show a user-friendly error message)
    }
  };
  const handleAmount = async (event, id) => {
    try {
      if (event.key === 'Enter' && event.target.value > 0) {
        const response = await axios.post(
          `${process.env.API_URL}/admin/update-user-balance/${id}`,
          {
            amount: event.target.value,
          },
          {
            headers: headers,
          }
        );

        if (response.data.status === 'success') {
          toast.success('Price Update   Successfully !');
          setFetch(true);
        }

        if (response.data.status === 'error') {
          Object.keys(response.data.message.error).forEach((key) => {
            const errorMessage = response?.data?.message.error[key][0];
            toast.error(errorMessage);
          });
          // console.log('Error submitting form:', response.data.message.error);
        }

        // Handle successful response if needed
      }
    } catch (error) {
      console.error('Error updating price:', error);
      // Handle error appropriately (e.g., show a user-friendly error message)
    }
  };

  const handlePriceDiscountUpdate = async (event, id) => {
    try {
      if (event.key === 'Enter' && event.target.value > -1) {
        const response = await axios.post(
          `${process.env.API_URL}/admin/users/discount/${id}`,
          {
            discount: event.target.value,
          },
          {
            headers: headers,
          }
        );

        if (response.data.status === 'success') {
          toast.success('Price Update   Successfully !');
        }

        if (response.data.status === 'error') {
          Object.keys(response.data.message.error).forEach((key) => {
            const errorMessage = response?.data?.message.error[key][0];
            toast.error(errorMessage);
          });
          // console.log('Error submitting form:', response.data.message.error);
        }

        // Handle successful response if needed
      }
    } catch (error) {
      console.error('Error updating price:', error);
      // Handle error appropriately (e.g., show a user-friendly error message)
    }
  };
  const handleFetchNormalUser = useCallback(async () => {
    try {
      const values = {
        page: currentPage,
        perPage: limit,
        search: search,
      };
      const response = await axios.get(`${process.env.API_URL}/admin/users`, {
        headers: headers,
        params: values,
      });
      if (response.data.status === 'success') {
        setNormalUserSlip(response.data.users.data);
        setTotalPages(response.data.users.last_page);
        setFetch(false);
      }
    } catch (err) {}
  }, [search,currentPage, limit, fetch]);

  useEffect(() => {
    handleFetchNormalUser();
  }, [handleFetchNormalUser]);

  return (
    <>
      <NextSeo
        title="GCC Total User"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <div className="">
        <div className="rounded-tl-lg rounded-tr-lg bg-white px-4 pt-6 dark:bg-light-dark md:px-8 md:pt-8">
          <div className="flex flex-col items-center justify-between border-b border-dashed border-gray-200 pb-5 dark:border-gray-700 md:flex-row">
            <h2 className="mb-3 shrink-0 text-lg font-medium uppercase text-black dark:text-white sm:text-xl md:mb-0 md:text-2xl">
              Total User
            </h2>
            <div className="!bg-orange-400 py-2 px-5 font-medium text-white">
              <Link href="/add-user">Add User</Link>
            </div>
          </div>
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
                      Email
                    </th>

                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Balance Due
                    </th>

                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Total Paid
                    </th>

                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      New Payment Received
                    </th>

                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Rate Discount
                    </th>

                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Normal Slip RATE
                    </th>
                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Complete Slips
                    </th>
                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Failed Slips
                    </th>
                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm">
                  {/* item */}

                  {normalUserSlip.length > 0 &&
                    normalUserSlip.map((item, i) => {
                      return (
                        <tr
                          key={item.id}
                          className="mb-3 items-center rounded-lg bg-white uppercase shadow-card last:mb-0 hover:shadow-large dark:bg-light-dark"
                        >
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            {i + 1}
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            {item?.name}
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            {item?.email}
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            {parseFloat(item.costs) - parseFloat(item?.balance)}
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            {item?.balance}
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            <input
                             key={item?.id}
                              type="number"
                              id="large-input"
                              style={{ width: '100px' }}
                              className="sm:text-md block rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                              placeholder="New Payment Received"
                              onKeyDown={(event) =>
                                handleAmount(event, item?.id)
                              }
                            />
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            <input
                             key={item?.id}
                              type="number"
                             
                              defaultValue={item?.discount}
                              id="large-input"
                              className="sm:text-md inline-block rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                              style={{ width: '100px' }} // Adjust the width as needed
                              placeholder="Rate Discount"
                              onKeyDown={(event) =>
                                handlePriceDiscountUpdate(event, item?.id)
                              }
                            />
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            <input
                              key={item?.id}
                              type="number"
                              defaultValue={item?.normal_price}
                              id="large-input"
                              className="sm:text-md block rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                              placeholder="Normal Slip RATE"
                              style={{ width: '100px' }}
                              onKeyDown={(event) =>
                                handlePriceUpdate(event, item?.id)
                              }
                            />
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                              {item?.complete_slips_count || 0}
                            </span>
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                              {item?.failed_slips_count || 0}
                            </span>
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            <label className="relative inline-flex cursor-pointer items-center">
                              <p className="mx-2">
                                {item.active === '1' ? 'UnLock' : 'lock'}
                              </p>
                              <input
                                key={item?.id}
                                type="checkbox"
                                defaultChecked={
                                  item.active === '1' ? true : false
                                }
                                onChange={(e) => handleActive(e, item.id)}
                                className="peer sr-only"
                              />

                              <div className="after:start-[2px] peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800" />
                            </label>
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
      </div>
    </>
  );
};

export default withAuth(totalUser, {
  isProtectedRoute: true,
  show: false,
});
