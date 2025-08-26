/* eslint-disable react-hooks/rules-of-hooks */
import withAuth from '@/hook/PrivateRoute';
import { headers } from '@/utls/auth';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import { NextSeo } from 'next-seo';
import { useCallback, Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Data = [
  {
    cardHolderName: 'Jafrul Hasan Rasel',
    cartNUmber: 123456789,
    cartNo: 1,
    expiryDate: '25-11-25',
    CVV: 782,
  },
  {
    cardHolderName: 'Jafrul Hasan Rasel',
    cartNUmber: 123456789,
    cartNo: 2,
    expiryDate: '25-11-25',
    CVV: 782,
  },
];

const settings = () => {
  const [cardInfo, setCardInfo] = useState([]);
  const router = useRouter();

  const handleFetchNormalUser = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.API_URL}/admin/payment-settings`,
        {
          headers: headers,
          // params: values,
        }
      );
      if (response.data.status === 'success') {
        setCardInfo(response.data.slots);
      }
    } catch (err) {}
  }, []);

  useEffect(() => {
    handleFetchNormalUser();
  }, [handleFetchNormalUser]);

  return (
    <>
      <NextSeo
        title="GCC Settings"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <div className="">
        <div className="rounded-tl-lg rounded-tr-lg bg-white px-4 pt-6 dark:bg-light-dark md:px-8 md:pt-8">
          <div className="flex flex-col items-center justify-between border-b border-dashed border-gray-200 pb-5 dark:border-gray-700 md:flex-row">
            <h2 className="mb-3 shrink-0 text-lg font-medium uppercase text-black dark:text-white sm:text-xl md:mb-0 md:text-2xl">
              Settings
            </h2>
          </div>

          <div className=" grid grid-cols-3 gap-7">
            {cardInfo?.map((data, i) => (
              <div className="" key={i}>
                <div className="rounded-lg bg-[#DBE3FF] p-6 xl:p-8">
                  <h5 className="text-2xl font-medium">{data.cartNo}</h5>
                  <h3 className="mt-2 text-3xl font-semibold">
                    {data.card_holder_name}
                  </h3>
                  <h4 className="my-4 space-x-1 text-4xl font-semibold text-orange-400">
                    {data.card_number}
                  </h4>
                  <h5 className="mt-2 text-xl font-medium text-red-500">
                    Expiry-Date: {data.expiry_month} -{data.expiry_year}
                  </h5>
                  <h5 className="mt-2 text-xl font-medium">
                    CVV:{data.card_security_code}
                  </h5>
                  <button
                    onClick={() => {
                      router.push(`/update-info?id=${data?.id}`);
                    }}
                    className="block w-[80px] rounded-sm bg-orange-400 p-2 text-center text-white"
                  >
                    Update Info
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(settings, {
  isProtectedRoute: true,
  show: false,
  requireAdmin: true,
});
