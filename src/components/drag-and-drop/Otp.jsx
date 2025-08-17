import { headers } from '@/utls/auth';
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const OtpInput = ({ placeholder, onKeyDown, dataOtp }) => {
  const [otp, setOtp] = useState('');

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  return (
      <input
        type="text"
        name="otp"
        placeholder={placeholder}
        data-otp={dataOtp}
        value={otp}
        onChange={handleChange} // Handle input value changes
        onKeyDown={onKeyDown} // Handle Enter key press
        className="h-12 w-20 rounded-md border-2 border-gray-300 p-2 text-center focus:border-blue-500 focus:outline-none"
      />
  );
};

const Otp = ({ data  }) => {
  // Function to handle the API call
  const handleSubmit = async (otp, card_no, id, slip_url_id) => {
    try {
      const values = {
        otp_code: otp,
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
      if (response.data.status === 'success') {
        const successMessage = response?.data?.message.success[0];
        toast.success(successMessage);
      }
      if (response.data.status === 'error') {
        Object.keys(response.data.message.error).forEach((key) => {
          const errorMessage = response?.data?.message.error[key];
          toast.error(errorMessage);
          
        });
      }
    } catch (error) {
      console.log(error);

      toast.error(error.message);
    }
  };

  const handleKeyDown = async (e, card_no, id, slip_url_id) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const otp = e.target.value;
      await handleSubmit(otp, card_no, id, slip_url_id);
    }
  };

  return (
    <>
      {data?.otp_one  !== null && (
        <OtpInput
          dataOtp={data?.otp_one}
          placeholder="OTP 1"
          onKeyDown={(e) => handleKeyDown(e,1, data?.id, data?.otp_one)}
        />
      )}
      {data?.otp_two  !== null && (
        <OtpInput
          dataOtp={data?.otp_two}
          placeholder="OTP 2"
          onKeyDown={(e) => handleKeyDown(e,2 ,data?.id, data?.otp_two)}
        />
      )}
      {data?.otp_three  !== null && (
        <OtpInput
          dataOtp={data?.otp_three}
          placeholder="OTP 3"
          onKeyDown={(e) => handleKeyDown(e,1, data?.id, data?.otp_three)}
        />
      )}
      {data?.otp_four !== null && (
        <OtpInput
          dataOtp={data?.otp_four}
          placeholder="OTP 4"
          onKeyDown={(e) => handleKeyDown(e, 2, data?.id, data?.otp_four)}
        />
      )}
    </>
  );
};

export default Otp;
