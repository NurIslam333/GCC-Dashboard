/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useCallback, useEffect } from 'react';
import { NextSeo } from 'next-seo';
import Scrollbar from '@/components/ui/scrollbar';
import withAuth from '@/hook/PrivateRoute';
import axios from 'axios';
import { headers } from '@/utls/auth';
import moment from 'moment';
import Link from 'next/link';
import Pagination from '@/components/gcc-component/Pagination';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const normalSlipPending = () => {
  const [limit, setLimit] = useState(25);
  const [normalSlip, setNormalSlip] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const handleFetchNormalUser = useCallback(async () => {
    try {
      const values = {
        page: currentPage,
        perPage: limit,
        status: 'pending',
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

  const paymentPageRedriect = async (values, url_id) => {
    try {
      const data = {
        slip_id: values,
        new: url_id,
      };
      const response = await axios.post(
        `${process.env.API_URL}/admin/send-to-payment`,
        data,
        {
          headers: headers,
        }
      );


      if (response.data.status === 'success') {
        toast.success('Payment page  redriect   Successfully !');
        router.push('/payment');
      }
      if (response.data.status === 'error') {
        Object.keys(response.data.message.error).forEach((key) => {
          const errorMessage = response?.data?.message.error[key][0];
          toast.error(errorMessage);
        });
        // console.log('Error submitting form:', response.data.message.error);
      }
    } catch (error) {
      if (error.response) {

        Object.keys(error?.response?.data?.message.error).forEach((key) => {
          const errorMessage = error?.response?.data?.message.error[key][0];
          toast.error(errorMessage);
        });
      }
      console.error('Submission error:', error);
    }
  };

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
        title="GCC Normal Slip Pending"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <div className="">
        <div className="rounded-tl-lg rounded-tr-lg bg-white px-4 pt-6 dark:bg-light-dark md:px-8 md:pt-8">
          <div className="flex flex-col items-center justify-between border-b border-dashed border-gray-200 pb-5 dark:border-gray-700 md:flex-row">
            <h2 className="mb-3 shrink-0 text-lg font-medium uppercase text-black dark:text-white sm:text-xl md:mb-0 md:text-2xl">
              Normal Slip Pending
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
                      Passport No, Travel County, City
                    </th>

                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Shift
                    </th>

                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Status
                    </th>

                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Pay Now
                    </th>

                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Submit Date, Time
                    </th>

                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Message
                    </th>

                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      User Name
                    </th>

                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Reference
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
                        <tr
                          key={i}
                          className="mb-3 items-center rounded-lg bg-white uppercase shadow-card last:mb-0 hover:shadow-large dark:bg-light-dark"
                        >
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            {i + 1}
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            {item?.passport}
                            <br />
                            {item?.tcountry}
                            <br />
                            {item?.city}
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            {item.pay_url !== null && item?.shiftable && (
                              <button
                                onClick={(e) =>
                                  paymentPageRedriect(item.id, item?.pay_url)
                                }
                                className="block w-[100px] rounded-sm bg-orange-400 p-2 text-center text-white"
                              >
                                Paymeny Page
                              </button>
                            )}
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            {item?.status}
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            {item?.pay_url !== null && (
                              <button
                                onClick={() => {
                                  window.open(item.pay_url, '_blank');
                                }}
                                className="block w-[80px] rounded-sm bg-orange-400 p-2 text-center text-white"
                              >
                                Pay Now
                              </button>
                            )}
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            {moment(item?.created_at).format('DD/MM/YYYY')}
                            <br />
                            {moment(item?.created_at).format('hh:mm A')}
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            {item?.notice}
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            {' '}
                            {item.user_name}
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            {' '}
                            {item?.reference}
                          </td>
                          <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                            <button
                              onClick={() => slipDelete(item.id)}
                              className=""
                            >
                              Delete
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

export default withAuth(normalSlipPending, {
  isProtectedRoute: true,
  show: false,
  requireAdmin: true,
});
