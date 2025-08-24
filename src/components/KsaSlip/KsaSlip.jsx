/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback } from 'react';
import Button from '@/components/ui/button';
import Scrollbar from '@/components/ui/scrollbar';
import Link from 'next/link';
import { Tab } from '@headlessui/react';
import KuetSlipDraggable from '../drag-and-drop/KuetSlipDraggable';
import update from 'immutability-helper';
import { headers } from '@/utls/auth';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Refresh } from '../icons/refresh';

const KsaSlip = ({
  slots,
  type,
  slotsId,
  setSlotsId,
  setCards,
  cards,
  handelfetch,
  selectedItems,
  setSelectedItems,
  city
}) => {
  {
    const [paymentId, setPaymentId] = useState({
      card_no: '',
      id: '',
    });
    const moveCard = useCallback((dragIndex, hoverIndex) => {
      setCards((prevCards) => {
        const updatedCards = update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        });
        const movedCard = prevCards[dragIndex];
        updateCardIndex(
          movedCard.slot_id,
          movedCard.id,
          movedCard?.slip_type,
          hoverIndex
        );

        return updatedCards;
      });
    }, []);
    const updateCardIndex = async (slot_id, pay_slip_id, type, newIndex) => {
      try {
        const values = {
          slot_id,
          pay_slip_id,
          slip_type: type,
          new_index: newIndex + 1,
        };
        const response = await axios.post(
          `${process.env.API_URL}/admin/payment-slips/update-sorting`,
          values,
          {
            headers: headers,
          }
        );
        if (response.data.status === 'success') {
          const successMessage = response?.data?.message.success[0];
          toast.success(successMessage);
          handelfetch();
        }
        if (response.data.status === 'error') {
          Object.keys(response.data.message.error).forEach((key) => {
            const errorMessage = response?.data?.message.error[key];
            toast.error(errorMessage);
            handelfetch();
          });
        }
      } catch (error) {
        console.error('Error updating card index:', error);
      }
    };

    const handleSelectChange = async (e, id) => {
      const newValue = e.target.value;
      try {
        const response = await axios.post(
          `${process.env.API_URL}/admin/payment-slips/switch-slot/${id}`,
          {
            slot_id: newValue,
          },
          {
            headers: headers,
          }
        );

        if (response.data.status == 'success') {
          toast.success(response.data.message.success[0]);
          handelfetch();
        }
        if (response.data.status === 'error') {
          Object.keys(response.data.message.error).forEach((key) => {
            const errorMessage = response?.data?.message.error[key];
            toast.error(errorMessage);
          });
          // console.log('Error submitting form:', response.data.message.error);
        }
      } catch (error) {
        console.error('Error making API call:', error);
      }
    };
    const handleReadyForPayment = async () => {
      try {
        const values = {
          pay_slip_ids: selectedItems,
        };
        const response = await axios.post(
          `${process.env.API_URL}/admin/ready-for-payment`,
          values,
          {
            headers: headers,
          }
        );
        if (response.data.status === 'success') {
          const successMessage = response?.data?.message.success[0];
          toast.success(successMessage);
          setSelectedItems([]);
          handelfetch();
          setPaymentId({});
        }
        if (response.data.status === 'error') {
          Object.keys(response.data.message.error).forEach((key) => {
            const errorMessage = response?.data?.message.error[key];
            toast.error(errorMessage);
            handelfetch();
            setPaymentId({});
          });
        }
      } catch (error) {
        // Handle error as needed
        console.error('Error updating card index:', error);
      }
    };
    const handleSloatsRefresh = async () => {
      try {
        const values = {
          slip_type: type,
        };
        const response = await axios.post(
          `${process.env.API_URL}/admin/refresh-slots`,
          values,
          {
            headers: headers,
            params: {city},
          }
        );
        if (response.data.status === 'success') {
          const successMessage = response?.data?.message.success[0];
          toast.success(successMessage);
          setSelectedItems([]);
          handelfetch();
          setPaymentId({});
        }
        if (response.data.status === 'error') {
          Object.keys(response.data.message.error).forEach((key) => {
            const errorMessage = response?.data?.message.error[key];
            toast.error(errorMessage);
            handelfetch();
            setPaymentId({});
          });
        }
      } catch (error) {
        // Handle error as needed
        console.error('Error updating card index:', error);
      }
    };

    const handleSentToComplete = async () => {
      try {
        if (selectedItems.length > 0) {
          const values = {
            pay_slip_ids: selectedItems,
          };
          const response = await axios.post(
            `${process.env.API_URL}/admin/send-to-complete`,
            values,
            {
              headers: headers,
            }
          );
          if (response.data.status === 'success') {
            const successMessage = response?.data?.message.success[0];
            toast.success(successMessage);
            setSelectedItems([]);
            handelfetch();
            setPaymentId({});
          }
          if (response.data.status === 'error') {
            Object.keys(response.data.message.error).forEach((key) => {
              const errorMessage = response?.data?.message.error[key];
              toast.error(errorMessage);
              handelfetch();
              setPaymentId({});
            });
          }
        }
      } catch (error) {
        // Handle error as needed
        console.error('Error updating card index:', error);
      }
    };

    const handleUseReserve = async () => {
      try {
        if (selectedItems.length > 0) {
          const values = {
            pay_slip_ids: selectedItems,
          };
          const response = await axios.post(
            `${process.env.API_URL}/admin/ues-reserves`,
            values,
            {
              headers: headers,
            }
          );
          if (response.data.status === 'success') {
            const successMessage = response?.data?.message.success[0];
            toast.success(successMessage);
            setSelectedItems([]);
            handelfetch();
            setPaymentId({});
          }
          if (response.data.status === 'error') {
            Object.keys(response.data.message.error).forEach((key) => {
              const errorMessage = response?.data?.message.error[key];
              toast.error(errorMessage);
              handelfetch();
              setPaymentId({});
            });
          }
        }
      } catch (error) {
        // Handle error as needed
        console.error('Error updating card index:', error);
      }
    };


    const handleInputFalseAndNormal = async (type) => {
      try {
        if (selectedItems.length > 0) {
          const values = {
            slip_type: type,
            pay_slip_ids: selectedItems,
          };
          const response = await axios.post(
            `${process.env.API_URL}/admin/bulk-send-to-payment`,
            values,
            {
              headers: headers,
            }
          );
          if (response.data.status === 'success') {
            const successMessage = response?.data?.message.success[0];
            toast.success(successMessage);
            setSelectedItems([]);
            handelfetch();
            setPaymentId({});
          }
          if (response.data.status === 'error') {
            Object.keys(response.data.message.error).forEach((key) => {
              const errorMessage = response?.data?.message.error[key];
              toast.error(errorMessage);
              handelfetch();
              setPaymentId({});
            });
          }
        }
      } catch (error) {
        // Handle error as needed
        console.error('Error updating card index:', error);
      }
    };

    const handleDelete = async () => {
      try {
        if (selectedItems.length > 0) {
          const values = {
            slip_type: type,
            pay_slip_ids: selectedItems,
          };
          const response = await axios.post(
            `${process.env.API_URL}/admin/delete-pay-slips`,
            values,
            {
              headers: headers,
            }
          );
          if (response.data.status === 'success') {
            const successMessage = response?.data?.message.success[0];
            toast.success(successMessage);
            setSelectedItems([]);
            handelfetch();
            setPaymentId({});
          }
          if (response.data.status === 'error') {
            Object.keys(response.data.message.error).forEach((key) => {
              const errorMessage = response?.data?.message.error[key];
              toast.error(errorMessage);
              handelfetch();
              setPaymentId({});
            });
          }
        }
      } catch (error) {
        // Handle error as needed
        console.error('Error updating card index:', error);
      }
    };
    const handleComplete = async (data, id,payId) => {
      try {
        const values = {
          card_no: data,
          slip_url_id: payId,
        };
        const response = await axios.post(
          `${process.env.API_URL}/admin/complete-payment/${id}`,
          values,
          {
            headers: headers,
          }
        );
        if (response.data.status === 'success') {
          const successMessage = response?.data?.message.success[0];
          toast.success(successMessage);
          setSelectedItems([]);
          setPaymentId({});
          // handelfetch();
        }
        if (response.data.status === 'error') {
          Object.keys(response.data.message.error).forEach((key) => {
            const errorMessage = response?.data?.message.error[key];
            toast.error(errorMessage);
            // handelfetch();
            setPaymentId({});
          });
        }
      } catch (error) {
        // Handle error as needed
        console.error('Error updating card index:', error);
      }
    };
    const handleShowMedical = async (data, id,payId) => {
      try {
        const values = {
          card_no: data,
          slip_url_id: payId,
        };
        const response = await axios.post(
          `${process.env.API_URL}/admin/show-medical/${id}`,
          values,
          {
            headers: headers,
          }
        );
        if (response.data.status === 'success') {
          const successMessage = response?.data?.message.success[0];
          toast.success(successMessage);
          setSelectedItems([]);
          setPaymentId({});
          // handelfetch();
        }
        if (response.data.status === 'error') {
          Object.keys(response.data.message.error).forEach((key) => {
            const errorMessage = response?.data?.message.error[key];
            toast.error(errorMessage);
            // handelfetch();
            setPaymentId({});
          });
        }
      } catch (error) {
        // Handle error as needed
        console.error('Error updating card index:', error);
      }
    };
    const handleReversible = async ( id) => {
      try {
     
        const response = await axios.post(
          `${process.env.API_URL}/admin/ues-reserve/${id}`,
         {},
          {
            headers: headers,
          }
        );
        if (response.data.status === 'success') {
          const successMessage = response?.data?.message.success[0];
          toast.success(successMessage);
          setSelectedItems([]);
          setPaymentId({});
          // handelfetch();
        }
        if (response.data.status === 'error') {
          Object.keys(response.data.message.error).forEach((key) => {
            const errorMessage = response?.data?.message.error[key];
            toast.error(errorMessage);
            // handelfetch();
            setPaymentId({});
          });
        }
      } catch (error) {
        // Handle error as needed
        console.error('Error updating card index:', error);
      }
    };

    const handleHeaderCheckboxChange = (event) => {
      if (event.target.checked) {
        const allItems = cards.map((data) => data.id);
        setSelectedItems(allItems);
      } else {
        setSelectedItems([]);
      }
    };

    const handleRowCheckboxChange = (event, id) => {
      if (event.target.checked) {
        setSelectedItems((prevSelectedItems) => [...prevSelectedItems, id]);
      } else {
        setSelectedItems((prevSelectedItems) =>
          prevSelectedItems.filter((item) => item !== id)
        );
      }
    };

    const handleSubmit = async (otp, card_no, id, slip_url_id) => {
      try {
        const values = {
          otp: otp,
          card_no: card_no,
          slip_url_id: slip_url_id,
        };

        // Make the API request
        const response = await axios.post(
          `${process.env.API_URL}/admin/process-otp/${id}`,
          values,
          {
            headers: headers,
          }
        );
  
        // Set the success message based on the API response
        if (response.status === 200) { // Check for successful response
          setSuccessMessage('OTP verification successful!');
        } else {
          setSuccessMessage('OTP verification failed. Please try again.');
        }
      } catch (error) {
        setSuccessMessage(
          'Error verifying OTP. Please check your network and try again.'
        );
      }
    };
    const handleKeyDown = async (e, card_no, id, slip_url_id) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const otp = e.target.value;

        
       
        await handleSubmit(otp, card_no, id, slip_url_id);
      }
    };
    const renderCard = useCallback(
      (card, index, slots) => {
        return (
          <KuetSlipDraggable
            key={card.id}
            data={card}
            index={index}
            id={card.id}
            moveCard={moveCard}
            slots={slots}
            handleSelectChange={handleSelectChange}
            selectedItems={selectedItems}
            setPaymentId={setPaymentId}
            paymentId={paymentId}
            handleRowCheckboxChange={handleRowCheckboxChange}
            handleComplete={handleComplete}
            handleShowMedical={handleShowMedical}
            handleReversible={handleReversible}
            handleKeyDown={handleKeyDown}

          />
        );
      },
      [moveCard, handleRowCheckboxChange, handleSelectChange, slots]
    );

    return (
      <div className="py-5">
        <h2 className="mb-3 shrink-0 pb-5 text-lg font-medium uppercase text-black dark:text-white sm:text-xl md:mb-0 md:text-2xl">
          {type === 'ksa' ? ' KSA' : 'Kuet'} SLIP
        </h2>

        <Tab.Group>
          <Tab.List className="flex gap-4">
            {slots.length > 0 &&
              slots.map((item, i) => {
                return (
                  <Button
                    key={'btn' + i}
                    className={`rounded-md border-0 ${
                      slotsId === item?.id && '!bg-orange-500'
                    }`}
                    onClick={() => setSlotsId(item?.id)}
                  >
                    {item?.name}
                  </Button>
                );
              })}
          </Tab.List>
          <Tab.Panels>
            {slots.length > 0 &&
              slots.map((item, i) => {
                return (
                  <Tab.Panel key={'tab' + i}>
                    <div className="mt-5">
                      {/* header */}
                      <div className="flex items-center justify-between ">
                        {/* left */}
                        <div className="flex items-center gap-4">
                          <Button
                            onClick={() => handleInputFalseAndNormal('normal')}
                            className="rounded-md !bg-blue-500"
                          >
                            Normal Slip Input
                          </Button>
                          <Button
                            onClick={() => handleInputFalseAndNormal('false')}
                            className="rounded-md !bg-blue-500"
                          >
                            False Slip Input
                          </Button>
                          <Button
                            onClick={() => handleDelete()}
                            className="rounded-md !bg-red-500"
                          >
                            Delete
                          </Button>
                          <Button
                            onClick={() => handleSloatsRefresh()}
                            // className="rounded-md !bg-red-500"
                          >
                            Refresh Slot
                          </Button>
                          {/* <Button
                            onClick={() => handleUseReserve()}
                            // className="rounded-md !bg-red-500"
                          >
                            Use Reserve
                          </Button> */}
                        </div>

                        {/* right */}
                        <div className="">
                          <Button
                            className="rounded-md !bg-green-600"
                            onClick={handleReadyForPayment}
                          >
                            Ready for Payment
                          </Button>
                        </div>
                      </div>

                      <div className="my-5">
                        <Button
                          className="rounded-md !bg-[#ec4899]"
                          onClick={handleSentToComplete}
                        >
                          Complete
                        </Button>
                      </div>

                      {/* table */}
                      <div className="-mx-0.5">
                        <Scrollbar style={{ width: '100%' }} autoHide="never">
                          <div className="px-0.5">
                            <table className="transaction-table w-full border-separate border-0">
                              <thead className="text-sm text-gray-500 dark:text-gray-300">
                                <tr>
                                  <th className="px-2 py-4 ">
                                    <input
                                      name="selection-th"
                                      type="checkbox"
                                      onChange={handleHeaderCheckboxChange}
                                    />
                                  </th>
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
                                    Slip Category
                                  </th>

                                  <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                    Choice Center
                                  </th>

                                  <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                    Medical Center Serial
                                  </th>

                                  <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                    Slip Complete Center
                                  </th>
                                  <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                    Pay Now
                                  </th>

                                  <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                    Timer
                                  </th>

                                  <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                    Message
                                  </th>

                                  <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                    User
                                  </th>
                                  <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                                    Price
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm">
                                {cards.map((card, i) =>
                                  renderCard(
                                    card,
                                    i,
                                    slots
                                    //  handleSelectChange ,
                                    //  selectedItems,
                                    //  handleRowCheckboxChange
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </Scrollbar>
                      </div>
                    </div>
                  </Tab.Panel>
                );
              })}
          </Tab.Panels>
        </Tab.Group>
      </div>
    );
  }
};

export default KsaSlip;
