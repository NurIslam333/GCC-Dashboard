/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState, useCallback } from 'react';
import { NextSeo } from 'next-seo';
import Button from '@/components/ui/button';
import RootLayout from '@/layouts/_root-layout';
import Link from 'next/link';
import KsaSlip from '@/components/KsaSlip/KsaSlip';
import { Tab } from '@headlessui/react';
import KuetSlip from '@/components/KuetSlip/KuetSlip';
import axios from 'axios';
import { headers } from '@/utls/auth';
import Pusher from 'pusher-js';

const payment = () => {
  const [cards, setCards] = useState([]);
  const [type, setType] = useState('ksa');
  const [paymentList, setPaymentList] = useState([]);
  const [slots, setSlots] = useState([]);
  const [fetch, setfetch] = useState(false);
  const [active, setActive] = useState(false);
  const [slotsId, setSlotsId] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  // const [pusherConnected, setPusherConnected] = useState(false);
  // let pusher;

  const handelSelectVlue = (value) => {
    setType(value);
    setSelectedItems([]);
  };
  const handleFetchNormalUser = useCallback(async () => {
    try {
      const values = {
        slot_id: slotsId,
      };
      const response = await axios.get(
        `${process.env.API_URL}/admin/payment-slips`,
        {
          headers: headers,
          params: values,
        }
      );
      if (response.data.status === 'success') {
        setPaymentList(response.data.payment_slips);
        setCards(response.data.payment_slips);
      }
      setfetch(false);
    } catch (err) {}
  }, [slotsId, fetch]);

  const handleFetchSlot = useCallback(async () => {
    try {
      const values = {
        city: 2032,
        type: type,
      };
      const response = await axios.get(`${process.env.API_URL}/admin/slots`, {
        headers: headers,
        params: values,
      });
      if (response.data.status === 'success') {
        setSlots(response.data.slots);
        setSlotsId(response.data.slots[0].id);
      }
    } catch (err) {}
  }, [type, fetch]);

  useEffect(() => {
    handleFetchSlot();
  }, [handleFetchSlot]);

  useEffect(() => {
    handleFetchNormalUser();
  }, [handleFetchNormalUser]);
  const handelfetch = () => {
    setfetch(true);
  };
  return (
    <>
      <NextSeo
        title="GCC Payment Slip"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <div className="">
        <div className="rounded-tl-lg rounded-tr-lg bg-white px-4 pt-6 dark:bg-light-dark md:px-8 md:pt-8">
          <div className="flex flex-col items-center justify-between border-b border-dashed border-gray-200 pb-5 dark:border-gray-700 md:flex-row">
            <h2 className="mb-3 shrink-0 text-lg font-medium uppercase text-black dark:text-white sm:text-xl md:mb-0 md:text-2xl">
            Comilla Payment Slip
            </h2>
          </div>

          <div className="mt-5">
            <Tab.Group>
              <Tab.List className="flex gap-4">
                <Button
                  className={`rounded-md border-0 ${
                    type === 'ksa' && '!bg-[#7c3aed]'
                  }`}
                  onClick={() => handelSelectVlue('ksa')}
                >
                  KSA Slip
                </Button>
                <Button
                  className={`rounded-md border-0 ${
                    type === 'kuet' && '!bg-[#4f46e5]'
                  }`}
                  onClick={() => handelSelectVlue('kuet')}
                >
                  Kuet Slip
                </Button>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  {/* <KuetSlip /> */}
                  <KsaSlip
                    slots={slots}
                    city={2032}
                    type={type}
                    slotsId={slotsId}
                    setSlotsId={setSlotsId}
                    paymentList={paymentList}
                    setCards={setCards}
                    cards={cards}
                    handelfetch={handelfetch}
                    setSelectedItems={setSelectedItems}
                    selectedItems={selectedItems}
                  />
                </Tab.Panel>
                <Tab.Panel>
                  {/* <KuetSlip /> */}
                  <KsaSlip
                    slots={slots}
                    city={2032}
                    type={type}
                    slotsId={slotsId}
                    setSlotsId={setSlotsId}
                    paymentList={paymentList}
                    setCards={setCards}
                    cards={cards}
                    handelfetch={handelfetch}
                    setSelectedItems={setSelectedItems}
                    selectedItems={selectedItems}
                  />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(payment, {
  isProtectedRoute: true,
  show: false,
  requireAdmin: true,
});