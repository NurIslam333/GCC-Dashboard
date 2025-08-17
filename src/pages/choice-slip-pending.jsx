/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useCallback, useEffect } from 'react';

import { NextSeo } from 'next-seo';

import Scrollbar from '@/components/ui/scrollbar';
import Link from 'next/link';
import withAuth from '@/hook/PrivateRoute';
import axios from 'axios';
import { headers, generateShortName } from '@/utls/auth';
import moment from 'moment';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import Pagination from '@/components/gcc-component/Pagination';
import { Tooltip } from 'recharts';

const choiceSlipPending = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [normalSlip, setNormalSlip] = useState([]);
  const handleFetchNormalUser = useCallback(async () => {
    try {
      const values = {
        page: currentPage,
        perPage: limit,
        status: 'pending',
        search: search,
      };
      const response = await axios.get(
        `${process.env.API_URL}/admin/choice-slips`,
        {
          headers: headers,
          params: values,
        }
      );
      if (response.data.status === 'success') {
        setNormalSlip(response.data.slips.data);
        setTotalPages(response.data.slips.last_page);
      }
    } catch (err) {}
  }, [currentPage, search, limit]);

  const slipDelete = async (id) => {
    try {
      Swal.fire({
        iconHtml:
          '<img src="https://i.ibb.co/HXqMCgx/delete.png/images/delete.png">',
        customClass: {
          icon: 'no-border',
          border: '0',
        },
        text: 'Are you sure you want to delete this Slip?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#894BCA',
        cancelButtonColor: '#d33',
        confirmButtonText: 'yes, delete',
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          const response = await axios.post(
            `${process.env.API_URL}/admin/delete-slip/${id}`,
            {},
            {
              headers: headers,
            }
          );

          if (response.data.status) {
            setNormalSlip((pd) => {
              const filter = normalSlip.filter((prod) => {
                return prod.id !== id;
              });
              return [...filter];
            });
            // setNormalSlip((pd) => pd.filter((prod) => prod.id !== id));
            toast.success('Slip deleted successfully!');
          }
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info');
        }
      });
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Error deleting blog. Please try again.');
    } finally {
    }
  };

  useEffect(() => {
    handleFetchNormalUser();
  }, [handleFetchNormalUser]);
  return (
    <>
      <NextSeo
        title="GCC Choice Slip Pending"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <div className="">
        <div className="rounded-tl-lg rounded-tr-lg bg-white px-4 pt-6 dark:bg-light-dark md:px-8 md:pt-8">
          <div className="flex flex-col items-center justify-between border-b border-dashed border-gray-200 pb-5 dark:border-gray-700 md:flex-row">
            <h2 className="mb-3 shrink-0 text-lg font-medium uppercase text-black dark:text-white sm:text-xl md:mb-0 md:text-2xl">
              Choice Slip Pending
            </h2>
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
                      Passport No, Travel County, City
                    </th>

                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Choice Center
                    </th>

                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Submit Date, Time
                    </th>

                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      User Name
                    </th>

                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Reference
                    </th>
                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                        Message
                      </th>
                    </th>
                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm">
                  {/* item */}

                  {normalSlip.length > 0 &&
                    normalSlip.map((item, i) => {
                      return (
                        //

                        <tr
                          key={i}
                          className="mb-3 items-center rounded-lg bg-white uppercase shadow-card last:mb-0 hover:shadow-large dark:bg-light-dark"
                        >
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            {i + 1 + currentPage * 25 - 25}
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            {' '}
                            {item.first_name} {item.last_name}
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            {' '}
                            {item?.passport}
                            <br />
                            {item?.tcountry}
                            <br />
                            {item?.city}
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            {/* {item?.medical_list?.map((item, i, array) => (
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
                            ))} */}
                            <a data-tooltip-id={item?.id}>
                              {item?.medical_list[0]}
                            </a>
                            <Tooltip id={item?.id}>
                              <div>
                                {item?.medical_list?.map((data, i, array) => (
                                  <ul>
                                    <li>{data}</li>
                                  </ul>
                                ))}
                              </div>
                            </Tooltip>
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            {moment(item?.created_at).format('DD/MM/YYYY')}
                            <br />
                            {moment(item?.created_at).format('hh:mm A')}
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            {' '}
                            {item.user_name}{' '}
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            {item?.reference}
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            {item?.notice}
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            <button
                              onClick={() => slipDelete(item.id)}
                              className=""
                            >
                              Delate
                            </button>
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

export default withAuth(choiceSlipPending, {
  isProtectedRoute: true,
  show: false,
});
