/* eslint-disable react-hooks/exhaustive-deps */
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState ,useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { headers } from '@/utls/auth';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
    card_holder_name: Yup.string().required('Required'),
    card_number: Yup.string().required('Required'),
    expiry_month: Yup.string().required('Required'),
    expiry_year: Yup.string().required('Required'),
    card_security_code: Yup.string().required('Required'),
  });

const SubmissionForm = () => {
    const router = useRouter();
    const [cardInfo, setCardInfo] = useState({});
  const initialValues = {
    card_holder_name: '',
    card_number:  '',
    expiry_month:  '',
     expiry_year: '',
     card_security_code: '',
  };

 


  const handleFetchNormalUser = async () => {
    try {
  if(router?.query?.id){
      const response = await axios.get(
        `${process.env.API_URL}/admin/payment-settings`,
        {
          headers: headers,
          // params: values,
        }
      );
      if (response.data.status === 'success') {
        const filteredData = response?.data?.slots.filter(item => item.id == router?.query?.id);
        initialValues.card_holder_name = filteredData[0].card_holder_name
        initialValues.card_number = filteredData[0].card_number
        initialValues.expiry_month = filteredData[0].expiry_month
        initialValues.expiry_year = filteredData[0].expiry_year
        initialValues.card_security_code = filteredData[0].card_security_code
        console.log(filteredData)
      }
    } 

  }
  catch (err) {}
  }

  useEffect(() => {
    handleFetchNormalUser();
  }, [initialValues, router?.query?.id]);



  const handleSubmit = async (values, actions) => {
    try {
        const response = await axios.post(
          `${process.env.API_URL}/admin/payment-settings/update/${router?.query?.id}`,
          values,
          {
            headers: headers,
          }
        );
        if (response.data.status) {
          toast.success('Payment Info  Update Successfully !');
          actions.resetForm();
          router.push('/settings');
        }
        if (response.data.status === 'error') {
          Object.keys(response.data.message.error).forEach((key) => {
            const errorMessage = response?.data?.message.error[key][0];
            toast.error(errorMessage);
          });
          // console.log('Error submitting form:', response.data.message.error);
        }
  
        console.log('Form submitted:', values);
        setSubmitting(false);
      } catch (error) {
        if (error.response) {
          console.log(
            'Error submitting form:',
            error?.response?.data?.message.error
          );
          Object.keys(error?.response?.data?.message.error).forEach((key) => {
            const errorMessage = error?.response?.data?.message.error[key][0];
            toast.error(errorMessage);
          });
        }
        console.error('Submission error:', error);
        setSubmitting(false);
      }

  
  };
 if (router?.query?.id){
  return (
    <div className="container mx-auto my-8">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-4">Submit Card Information</h2>
          <div className="mb-4">
            <label htmlFor="cardHolderName" className="block text-sm font-medium text-gray-600">
              Card Holder Name
            </label>
            <Field
              type="text"
              id="cardHolderName"
              name="card_holder_name"
              className="mt-1 p-2 w-full border rounded-md"
            />
            <ErrorMessage name="card_holder_name" component="div" className="text-red-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-600">
              Card Number
            </label>
            <Field
              type="text"
              id="cardNumber"
              name="card_number"
              className="mt-1 p-2 w-full border rounded-md"
            />
            <ErrorMessage name="card_number" component="div" className="text-red-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-600">
                Expiry Month
              </label>
              <Field
                type="text"
                id="expiryMonth"
                name="expiry_month"
                className="mt-1 p-2 w-full border rounded-md"
              />
              <ErrorMessage name="expiry_month" component="div" className="text-red-500" />
            </div>
            <div className="mb-4">
              <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-600">
                Expiry Year
              </label>
              <Field
                type="text"
                id="expiryYear"
                name="expiry_year"
                className="mt-1 p-2 w-full border rounded-md"
              />
              <ErrorMessage name="expiry_year" component="div" className="text-red-500" />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-600">
              CVV
            </label>
            <Field
              type="text"
              id="cvv"
              name="card_security_code"
              className="mt-1 p-2 w-full border rounded-md"
            />
            <ErrorMessage name="card_security_code" component="div" className="text-red-500" />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </Form>
      </Formik>
    </div>
  );
}
};

export default SubmissionForm;
