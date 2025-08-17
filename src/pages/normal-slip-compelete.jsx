/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect, useState } from 'react';
import { NextSeo } from 'next-seo';
import Scrollbar from '@/components/ui/scrollbar';
import Link from 'next/link';
import withAuth from '@/hook/PrivateRoute';
import axios from 'axios';
import { headers } from '@/utls/auth';
import moment from 'moment';
import { useRouter } from 'next/router';
import Pagination from '@/components/gcc-component/Pagination';

const normalSlipCompelete = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(25);
  const [normalSlip, setNormalSlip] = useState([]);
  const handleFetchNormalUser = useCallback(async () => {
    try {
      const values = {
        page: currentPage,
        perPage: limit,
        status: 'complete',
        search: search,
      };
      const response = await axios.get(
        `${process.env.API_URL}/admin/normal-slips`,
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
  }, [search, currentPage, limit]);

  useEffect(() => {
    handleFetchNormalUser();
  }, [handleFetchNormalUser]);
  return (
    <>
      <NextSeo
        title="GCC Normal Slip Compelete"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <div className="">
        <div className="rounded-tl-lg rounded-tr-lg bg-white px-4 pt-6 dark:bg-light-dark md:px-8 md:pt-8">
          <div className="flex flex-col items-center justify-between border-b border-dashed border-gray-200 pb-5 dark:border-gray-700 md:flex-row">
            <h2 className="mb-3 shrink-0 text-lg font-medium uppercase text-black dark:text-white sm:text-xl md:mb-0 md:text-2xl">
              Normal Slip Compelete
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
                      Submit Date, Time
                    </th>

                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      User Name
                    </th>

                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Reference
                    </th>

                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Slip
                    </th>
                  </tr>
                </thead>
                <tbody className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm">
                  {/* item */}

                  {normalSlip.length > 0 &&
                    normalSlip.map((item, i) => {
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
                            {item?.user_name}
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            {item?.reference}
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

export default withAuth(normalSlipCompelete, {
  isProtectedRoute: true,
  show: false,
});
