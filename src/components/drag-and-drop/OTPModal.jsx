import React, { useState } from 'react';

const OTPModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [otp, setOtp] = useState('');

  // Function to open the modal
  const openModal = () => {
    setIsOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsOpen(false);
    setOtp('');
  };

  // Handle the submit button click
  const handleSubmit = () => {
    alert(`OTP submitted: ${otp}`);
    closeModal();
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {/* Button to open the modal */}
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Open OTP Modal
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          {/* Modal Container */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-semibold mb-4">Enter OTP</h2>
            
            {/* Input Box */}
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="border border-gray-300 rounded-lg p-2 w-full mb-4 focus:border-blue-500 focus:outline-none"
            />

            {/* Submit Button */}
            <div className="flex justify-between">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Submit
              </button>
              
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTPModal;
