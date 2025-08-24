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
  city: Yup.string().required('City is required'),
  tcountry: Yup.string().required('Country Travelling To is required'),
  limit: Yup.string().required('Limit is required'),
});

const TypeNormalSlip = () => {
  const router = useRouter();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${process.env.API_URL}/admin/generate-fake`, values, {
        headers: headers,
      });

      if (response.data.status === 'success') {
        toast.success('False Slip Created Successfully!');
        router.push('/false-slip');
      } else if (response.data.status === 'error') {
        Object.keys(response.data.message.error).forEach((key) => {
          const errorMessage = response?.data?.message.error[key][0];
          toast.error(errorMessage);
        });
      }


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
        <Formik
          initialValues={{
            limit: '',
            tcountry: '',
            city: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                    City
                  </label>
                  <Field
                    as="select"
                    name="city"
                    className="w-full border rounded-lg py-2 px-3 text-sm"
                  >
                    <option value="">Select your City</option>
                    <option value="2031">Barishal</option>
                    <option value="81">Chitagong</option>
                    <option value="2033">Cox&apos;s Bazar</option>
                    <option value="2032">Comilla</option>
                    <option value="80">Dhaka</option>
                    <option value="2030">Rajshahi</option>
                    <option value="83">Sylhet</option>
                  </Field>
                  <ErrorMessage name="city" component="div" className="text-red-500" />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tcountry">
                    Country Travelling To
                  </label>
                  <Field
                    as="select"
                    name="tcountry"
                    className="w-full border rounded-lg py-2 px-3 text-sm"
                  >
                    <option value="">Select GCC country</option>
                    <option value="BH">Bahrain</option>
                    <option value="KW">Kuwait</option>
                    <option value="OM">Oman</option>
                    <option value="QA">Qatar</option>
                    <option value="SA">Saudi Arabia</option>
                    <option value="UAE">UAE</option>
                    <option value="YEM">Yemen</option>
                  </Field>
                  <ErrorMessage name="tcountry" component="div" className="text-red-500" />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="limit">
                    Limit
                  </label>
                  <Field
                    type="text"
                    name="limit"
                    placeholder="Limit"
                    className="w-full border rounded-lg py-2 px-3 text-sm"
                  />
                  <ErrorMessage name="limit" component="div" className="text-red-500" />
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
