/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { NextSeo } from 'next-seo';
import Scrollbar from '@/components/ui/scrollbar';
import withAuth from '@/hook/PrivateRoute';
import { UserSlipRate } from '../components/UserSlipRate/UserSlipRate';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { headers } from '@/utls/auth';
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
  const handleFetchNormalUser = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.API_URL}/medicals`,
        {
          headers: headers,
          params: {
            search: search,
            city: activeTab,
          },
        }
      );
      if (response.data.status === 'success') {
        setNormalUserSlip(response.data.medicals);
        // setTotalPages(response.data.medicals.last_page);
      }
    } catch (err) {}
  }, [search ,activeTab]);

  useEffect(() => {
    handleFetchNormalUser();
  }, [handleFetchNormalUser]);


  // console.log("normalUserSlip" , normalUserSlip)
  
  return (
    // <>
    //   <NextSeo
    //     title="GCC Choice Slip"
    //     description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
    //   />
    //   <div className="">
    //     <div className="rounded-tl-lg rounded-tr-lg bg-white px-4 pt-6 dark:bg-light-dark md:px-8 md:pt-8">
    //       <div className="flex flex-col items-center justify-between border-b border-dashed border-gray-200 pb-5 dark:border-gray-700 md:flex-row">
    //         <h2 className="mb-3 shrink-0 text-lg font-medium uppercase text-black dark:text-white sm:text-xl md:mb-0 md:text-2xl">
    //           Slip Pricing
    //         </h2>
    //         <h2 className="mb-3 shrink-0 text-lg font-medium uppercase text-black dark:text-white sm:text-xl md:mb-0 md:text-2xl">
    //         <input
    //           type="text"
    //           // defaultValue={data?.price}
    //           id="large-input"
    //           // style={{ width: '100px' }}
    //           className="sm:text-md block rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
    //           placeholder="Search..."
    //           onChange={(e) => {
    //             setSearch(e.target.value);
    //           }}
    //         />
    //         </h2>
    //       </div>
    //     </div>
    //     <div className="-mx-0.5">
    //       <Scrollbar style={{ width: '100%' }} autoHide="never">
    //         <div className="px-0.5">
    //           <table className="transaction-table w-full border-separate border-0">
    //             <thead className="text-sm text-gray-500 dark:text-gray-300">
    //               <tr>
    //                 <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
    //                   SL No
    //                 </th>

    //                 <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
    //                   Medical Center Serial
    //                 </th>

    //                 <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
    //                 KSA Price
    //                 </th>
    //                 <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
    //                 KUET Price
    //                 </th>
    //               </tr>
    //             </thead>
    //             <tbody className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm">
    //               {/* item */}
    //               {normalUserSlip?.map((data, i) => (
    //                 <tr
    //                   key={i}
    //                   className="mb-3 items-center rounded-lg bg-white uppercase shadow-card last:mb-0 hover:shadow-large dark:bg-light-dark"
    //                 >
    //                   <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
    //                     {i + 1}
    //                   </td>
    //                   <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
    //                     <h4 className="font-medium text-orange-400">
    //                       {data.name}
    //                     </h4>
    //                   </td>
    //                   <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
    //                     <h4 className="font-medium text-orange-400">
    //                       {/* {parseFloat(data.price + 1500).toLocaleString()} */}
    //                       {data?.ksa_price}
    //                     </h4>
    //                   </td>
    //                   <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
    //                     <h4 className="font-medium text-orange-400">
    //                       {/* {parseFloat(data.price + 1500).toLocaleString()} */}
    //                       {data?.kuet_price}
    //                     </h4>
    //                   </td>
    //                 </tr>
    //               ))}
    //             </tbody>
    //           </table>
    //         </div>
    //       </Scrollbar>
    //     </div>
    //   </div>
    // </>
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
            <Tab.List className="flex gap-4">
              <Tab>
                <Button
                  className={cn('rounded-md border-0', {
                    '!bg-yellow-500': activeTab === 'dhaka',
                    'bg-gray-200': activeTab !== 'dhaka',
                  })}
                  onClick={() => setActiveTab('80')}
                >
                  Dhaka
                </Button>
              </Tab>
              <Tab>
                <Button
                  className={cn('rounded-md border-0', {
                    '!bg-orange-500': activeTab === 'cumilla',
                    'bg-gray-200': activeTab !== 'cumilla',
                  })}
                  onClick={() => setActiveTab('2032')}
                >
                  Comilla
                </Button>
              </Tab>
            </Tab.List>
            <Tab.Panels>
              {/* panding */}
              <Tab.Panel>
                <div className="-mx-0.5">
                <Scrollbar style={{ width: '100%' }} autoHide="never">
            <div className="px-0.5">
              <table className="transaction-table w-full border-separate border-0">
                <thead className="text-sm text-gray-500 dark:text-gray-300">
                  <tr>
                    <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      SL No
                    </th>

                    <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Medical Center Serial
                    </th>

                    <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                    KSA Price
                    </th>
                    <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                    KUET Price
                    </th>
                  </tr>
                </thead>
                <tbody className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm">
                  {/* item */}
                  {normalUserSlip?.map((data, i) => (
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
                          {/* {parseFloat(data.price + 1500).toLocaleString()} */}
                          {data?.ksa_price}
                        </h4>
                      </td>
                      <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                        <h4 className="font-medium text-orange-400">
                          {/* {parseFloat(data.price + 1500).toLocaleString()} */}
                          {data?.kuet_price}
                        </h4>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                    <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      SL No
                    </th>

                    <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Medical Center Serial
                    </th>

                    <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                    KSA Price
                    </th>
                    <th className="group bg-white px-2 py-5 font-medium text-blue-300 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                    KUET Price
                    </th>
                  </tr>
                </thead>
                <tbody className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm">
                  {/* item */}
                  {normalUserSlip?.map((data, i) => (
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
                          {/* {parseFloat(data.price + 1500).toLocaleString()} */}
                          {data?.ksa_price}
                        </h4>
                      </td>
                      <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                        <h4 className="font-medium text-orange-400">
                          {/* {parseFloat(data.price + 1500).toLocaleString()} */}
                          {data?.kuet_price}
                        </h4>
                      </td>
                    </tr>
                  ))}
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
  show: false,
});
