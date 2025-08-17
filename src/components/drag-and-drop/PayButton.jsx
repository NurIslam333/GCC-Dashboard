import React from 'react';
import Button from '@/components/ui/button';
import OTPModal from '@/components/drag-and-drop/OTPModal';
import Otp from '@/components/drag-and-drop/Otp';

const PayButton = ({ data, setPaymentId, paymentId, handleComplete, handleShowMedical }) => {
  // Function to handle right-click (copy link to clipboard)
  const handleRightClick = (event, link) => {
    event.preventDefault();
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  return (
    <td className="flex space-x-2 px-2 py-1 md:px-8">
      {data?.pay_one !== null && (
          <Button
            data-pay={data?.pay_one}
            onClick={() => {
              setPaymentId({
                card_no: 1,
                id: data.id,
              });
              handleComplete(1, data?.id, data?.pay_one);
            }}
            onContextMenu={(e) => handleRightClick(e, data.pay_one_link)}
            className={`max-w-28 flex-1 rounded-sm ${
              paymentId.id === data.id && paymentId.card_no === 1
                ? 'bg-orange-500'
                : 'bg-blue-500' // Set your default background color
            } p-1 text-center text-white`}
          >
            Pay 1
          </Button>
        )}
        {data?.pay_two !== null && (
          <Button
            data-pay={data?.pay_two}
            onClick={() => {
              setPaymentId({
                card_no: 2,
                id: data.id,
              });
              handleComplete(2, data?.id, data?.pay_two);
            }}
            onContextMenu={(e) => handleRightClick(e, data.pay_two_link)}
            className={`max-w-28 flex-1 rounded-sm ${
              paymentId.id === data.id && paymentId.card_no === 2
                ? 'bg-orange-500'
                : 'bg-blue-500' // Set your default background color
            } p-2 text-center text-white`}
          >
            Pay 2
          </Button>
        )}
        {data?.pay_three !== null && (
          <Button
            data-pay={data?.pay_three}
            onClick={() => {
              setPaymentId({
                card_no: 3,
                id: data.id,
              });
              handleComplete(1, data?.id, data?.pay_three);
            }}
            onContextMenu={(e) => handleRightClick(e, data.pay_three_link)}
            className={`max-w-28 flex-1 rounded-sm ${
              paymentId.id === data.id && paymentId.card_no === 3
                ? 'bg-orange-500'
                : 'bg-blue-500' // Set your default background color
            } p-2 text-center text-white`}
          >
            Pay 3
          </Button>
        )}

        {data?.pay_four !== null && (
          <Button
            data-pay={data?.pay_four}
            onClick={() => {
              setPaymentId({
                card_no: 4,
                id: data.id,
              });
              handleComplete(2, data?.id, data?.pay_four);
            }}
            onContextMenu={(e) => handleRightClick(e, data.pay_four_link)}
            className={`max-w-28 flex-1 rounded-sm ${
              paymentId.id === data.id && paymentId.card_no === 4
                ? 'bg-orange-500'
                : 'bg-blue-500' // Set your default background color
            } p-2 text-center text-white`}
          >
            Pay 4
          </Button>
        )}
        {data?.show_one !== null && (
          <Button
            data-show={data?.show_one}
            onClick={() => {
              setPaymentId({
                card_no: 5,
                id: data.id,
              });
              handleShowMedical(1, data?.id, data?.show_one);
            }}
            className={`max-w-28 flex-1 rounded-sm ${
              paymentId.id === data.id && paymentId.card_no === 5
                ? 'bg-green-500' 
                : 'bg-gray-500' 
            } p-2 text-center text-white`}
          >
            Show 1
          </Button>
        )}
        {data?.show_two !== null && (
          <Button
            data-show={data?.show_two}
            onClick={() => {
              setPaymentId({
                card_no: 6,
                id: data.id,
              });
              handleShowMedical(1, data?.id, data?.show_two);
            }}
            className={`max-w-28 flex-1 rounded-sm ${
              paymentId.id === data.id && paymentId.card_no === 6
              ? 'bg-green-500' 
              : 'bg-gray-500'  // Set your default background color
            } p-2 text-center text-white`}
          >
            Show 2
          </Button>
        )}

        {data?.show_three !== null && (
          <Button
            data-show={data?.show_three}
            onClick={() => {
              setPaymentId({
                card_no: 7,
                id: data.id,
              });
              handleShowMedical(1, data?.id, data?.show_three);
            }}
            className={`max-w-28 flex-1 rounded-sm ${
              paymentId.id === data.id && paymentId.card_no === 7
              ? 'bg-green-500' 
              : 'bg-gray-500'  // Set your default background color
            } p-2 text-center text-white`}
          >
            Show 3
          </Button>
        )}
        {data?.show_four !== null && (
          <Button
            data-show-four={data?.show_four}
            onClick={() => {
              setPaymentId({
                card_no: 8,
                id: data.id,
              });
              handleShowMedical(1, data?.id, data?.show_four);
            }}
            className={`max-w-28 flex-1 rounded-sm ${
              paymentId.id === data.id && paymentId.card_no === 8
              ? 'bg-green-500' 
              : 'bg-gray-500'  // Set your default background color
            } p-2 text-center text-white`}
          >
            Show 4
          </Button>
        )}
        
        <Otp key={data.id} data={data} />

      </td>
  );
};

export default PayButton;
