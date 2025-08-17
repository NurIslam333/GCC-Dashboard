import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '@/components/ui/button';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import axios from 'axios';
import { headers } from '@/utls/auth';

const validationSchema = Yup.object().shape({
  slip_url: Yup.string().required('Payment URL is required'),
  remarks: Yup.string().required('Remerks is required'),

});

const TypeNormalSlip = () => {
  const router = useRouter();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${process.env.API_URL}/store-link`, values, {
        headers: headers,
      });

      if (response.data.status === 'success') {
        toast.success('Link Payment Created Successfully!');
        router.push('/choice-slip');
      } else if (response.data.status === 'error') {
        // console.log('Error' , response.data.message.error);
        // Object.keys(response.data.message.error).forEach((key) => {
        //   const errorMessage = response?.data?.message.error[key][0];
          toast.error(response?.data?.message?.error);
        // });
      }

      console.log('Form submitted:', values);
      setSubmitting(false);
    } catch (error) {
      if (error.response) {
        Object.keys(error?.response?.data?.message).forEach((key) => {
          const errorMessage = error?.response?.data?.message[key][0];
          toast.error(errorMessage);
        });
      }
      console.error('Submission error:', error);
      setSubmitting(false);
    }
  };

  return (
    <>
      <NextSeo title="GCC Normal Slip" description="Criptic - React Next Web3 NFT Crypto Dashboard Template" />

      <div className="container mx-auto mt-8 p-8 bg-white rounded-md shadow-md">
        <div>
          <h2 className="text-2xl font-bold mb-4">Link Payment</h2>
        </div>
        <Formik
          initialValues={{
            slip_url: '',
            remarks: '',
           
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
                 <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="limit">
                    GCC Payment URL
                  </label>
                  <Field
                    type="text"
                    name="slip_url"
                    placeholder="GCC Payment URL"
                    className="w-full border rounded-lg py-2 px-3 text-sm"
                  />
                  <ErrorMessage name="slip_url" component="div" className="text-red-500" />
                </div>
                
              

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="limit">
                    Remerks
                  </label>
                  <Field
                    type="text"
                    name="remarks"
                    placeholder="Your Own Remerks"
                    className="w-50 border rounded-lg py-2 px-3 text-sm"
                  />
                  <ErrorMessage name="remarks" component="div" className="text-red-500" />
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button
                  type="submit"
                  className={`w-1/4 bg-orange-500 text-2xl py-2 rounded-lg ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default TypeNormalSlip;
