/* eslint-disable react-hooks/rules-of-hooks */
import { NextSeo } from 'next-seo';
import { MedicalCenter } from '@/components/KsaSlip/MedicalCenter';
import withAuth from '@/hook/PrivateRoute';
import Button from '@/components/ui/button';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { medicalseData } from '@/utls/Data';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import DatePickerForm from '@/components/Form/DatePickerForm';

function shuffleArray(array) {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required('First Name is required'),
  last_name: Yup.string().required('Last Name is required'),
  passport: Yup.string().required('Passport No is required'),
  gender: Yup.string().required('Gender is required'),
  marital_status: Yup.string().required('Marital Status is required'),
  dob: Yup.date().required('Date of Birth is required'),
  passport_issue_date: Yup.date().required('Passport Issue Date is required'),
  passport_expiry_on: Yup.string().required('Passport Expiry is required'),
  applied_position: Yup.string().required('Position Applied For is required'),
  city: Yup.string().required('City is required'),
  tcountry: Yup.string().required('Country Travelling To is required'),
  visa_type: Yup.string().required('Visa Type is required'),
  medicals: Yup.string().required('Medical Center is required'),
  national_id: Yup.string().when('tcountry', {
    is: 'KW',
    then: Yup.string().required('National ID is required for Kuwait'),
    otherwise: Yup.string().notRequired(),
  }),
  reference: Yup.string(),
});

const animatedComponents = makeAnimated();
const typeChoicSlip = () => {
  const [city , setCity] = useState('80') // Default to Dhaka
  const [shuffledItems, setShuffledItems] = useState([]);
  const [normalUserSlip, setNormalUserSlip] = useState([]);
  const [slipPrice, setSlipPrice] = useState("SA"); // Default to Saudi Arabia
  const router = useRouter();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (values.dob) {
        const dobDate = new Date(values.dob);
        values.dob = dobDate.toLocaleDateString('en-US'); // Adjust the locale as needed
      }
      if (values.passport_issue_date) {
        const dobDate = new Date(values.passport_issue_date);
        values.passport_issue_date = dobDate.toLocaleDateString('en-US'); // Adjust the locale as needed
      }
      const response = await fetch('/api/create-choice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        toast.success('User Choice Slip Created   Successfully !');
        router.push('/choice-slip');
      }
      if (data.status === 'error') {
        Object.keys(data.message.error).forEach((key) => {
          const errorMessage = data?.message?.error[key][0];
          toast.error(errorMessage);
        });
        // console.log('Error submitting form:', data.message.error);
      }


      setSubmitting(false);
    } catch (error) {
      if (error.response) {

        Object.keys(error?.response?.data?.message.error).forEach((key) => {
          const errorMessage = error?.response?.data?.message.error[key][0];
          toast.error(errorMessage);
        });
      }
      console.error('Submission error:', error);
      setSubmitting(false);
    }
  };

  const handleFetchNormalUser = useCallback(async () => {
    try {
      const params = new URLSearchParams({ city });
      
      const response = await fetch(`/api/medicals?${params}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setNormalUserSlip(data.medicals);

        // const formattedData = data?.medicals?.map(({ name, price }) => ({
        //   // value: name.toLowerCase().replace(/\s/g, '_'),
        //   value: name,
        //   label: `${name} - ${price} BDT`,
        // }));

        // setShuffledItems(formattedData);
        // setTotalPages(data.medicals.last_page);
      }
    } catch (err) {}
  }, [city]);

  useEffect(() => {
    handleFetchNormalUser();
  }, [handleFetchNormalUser]);
  useEffect(() => {
    const shuffledData = shuffleArray(normalUserSlip);
    const formattedData = shuffledData.map(({ name, ksa_price,kuet_price}) => ({
      value: name,
      label: `${name} - ${ slipPrice !== "KW" ? ksa_price
      :kuet_price} BDT`,
    }));
    setShuffledItems(formattedData);
  }, [normalUserSlip,slipPrice]);
  return (
    <>
      <NextSeo
        title="GCC Choice Slip"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      
      {/* Header Section */}
      <div className="mb-8">
        <div className="rounded-tl-lg rounded-tr-lg bg-white px-6 pt-6 dark:bg-light-dark md:px-8 md:pt-8">
          <div className="flex flex-col items-center justify-between border-b border-dashed border-gray-200 pb-6 dark:border-gray-700 md:flex-row">
            <div className="text-center md:text-left">
              <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                Choice Slip Application
            </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Complete the form below to create a new choice slip
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-3 text-white shadow-lg">
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="font-semibold">New Application</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="mx-auto max-w-7xl">
        <Formik
          initialValues={{
            first_name: '',
            last_name: '',
            passport: '',
            gender: 'male',
            dob: '',
            marital_status: 'married',
            passport_issue_date: '',
            passport_expiry_on: '',
            national_id: '',
            reference: '',
            applied_position: '76',
            tcountry: 'SA',
            city: '80',
            visa_type: 'wv',
            medicals: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-8">
              {/* Personal Information Section */}
              <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-light-dark">
                <div className="mb-6 flex items-center">
                  <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                    <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Information</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="first_name"
                      type="text"
                      placeholder="Enter first name"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    />
                    <ErrorMessage
                      name="first_name"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="last_name"
                      type="text"
                      placeholder="Enter last name"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    />
                    <ErrorMessage
                      name="last_name"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      name="gender"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </Field>
                    <ErrorMessage
                      name="gender"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Marital Status */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Marital Status <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      name="marital_status"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Status</option>
                      <option value="married">Married</option>
                      <option value="unmarried">Unmarried</option>
                    </Field>
                    <ErrorMessage
                      name="marital_status"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <DatePickerForm
                      value={values?.dob}
                      name="dob"
                      setFieldValue={setFieldValue}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <ErrorMessage
                      name="dob"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Passport Information Section */}
              <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-light-dark">
                <div className="mb-6 flex items-center">
                  <div className="mr-3 rounded-full bg-green-100 p-2 dark:bg-green-900">
                    <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Passport Information</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  

                  {/* Passport Number */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Passport Number <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="passport"
                      type="text"
                      placeholder="Enter passport number"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    />
                    <ErrorMessage
                      name="passport"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                  {/* Passport Issue Date */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Passport Issue Date <span className="text-red-500">*</span>
                    </label>
                      <DatePickerForm
                          value={values?.passport_issue_date}
                          name="passport_issue_date"
                          setFieldValue={setFieldValue}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        <ErrorMessage
                          name="passport_issue_date"
                          component="div"
                      className="text-sm text-red-500"
                        />
                      </div>

                  {/* Passport Expiry */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Passport Expiry <span className="text-red-500">*</span>
                    </label>
                        <Field
                          as="select"
                          name="passport_expiry_on"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                      <option value="">Select Expiry Period</option>
                      <option value="5">5 years</option>
                          <option value="10">10 years</option>
                        </Field>
                        <ErrorMessage
                          name="passport_expiry_on"
                          component="div"
                      className="text-sm text-red-500"
                        />
                      </div>
                    </div>
                  </div>

              {/* Job & Travel Information Section */}
              <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-light-dark">
                <div className="mb-6 flex items-center">
                  <div className="mr-3 rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                    <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Job & Travel Information</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* Position Applied For */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Position Applied For <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      name="applied_position"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Position</option>
                      <option value="31">Labour</option>
                      <option value="59">House Maid</option>
                      <option value="65">Driver</option>
                      <option value="76">Worker</option>
                      <option value="77">House Boy</option>
                      <option value="108">Other</option>
                    </Field>
                    <ErrorMessage
                      name="applied_position"
                      component="div"
                      className="text-sm text-red-500"
                    />
                </div>

                  {/* City */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      City <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      name="city"
                      onChange={(e) => {
                        setFieldValue('city', e.target.value);
                        setCity(e.target.value)
                      }}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select your City</option>
                      <option value="2031">Barisal</option>
                      <option value="81">Chittagong</option>
                      <option value="2032">Cumilla</option>
                      <option value="2033">Coxs Bazar</option>
                      <option value="2030">Rajshahi</option>
                      <option value="80">Dhaka</option>
                      <option value="83">Sylhet</option>
                    </Field>
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Country Travelling To */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Country Travelling To <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      onChange={(e) => {
                        setFieldValue('tcountry', e.target.value);
                        setSlipPrice(e.target.value)
                      }}
                      value={values.tcountry || ''}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select GCC country</option>
                      <option value="SA">Saudi Arabia</option>
                      <option value="UAE">UAE</option>
                      <option value="KW">Kuwait</option>
                      <option value="QA">Qatar</option>
                      <option value="BH">Bahrain</option>
                      <option value="OM">Oman</option>
                      <option value="YEM">Yemen</option>
                    </Field>
                    <ErrorMessage
                      name="tcountry"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Visa Type */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Visa Type <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      name="visa_type"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Visa Type</option>
                      <option value="wv">Work Visa</option>
                      <option value="fv">Family Visa</option>
                    </Field>
                    <ErrorMessage
                      name="visa_type"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Medical Center */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Medical Center <span className="text-red-500">*</span>
                    </label>
                    <Select
                      name="medicals"
                      closeMenuOnSelect={true}
                      components={animatedComponents}
                      isMulti={false}
                      isSearchable={true}
                      placeholder="Search and select Medical Center"
                      options={shuffledItems}
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setFieldValue('medicals', selectedOption.value);
                        } else {
                          setFieldValue('medicals', '');
                        }
                      }}
                      className="mt-1"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          minHeight: '48px',
                          boxShadow: 'none',
                          '&:hover': {
                            borderColor: '#3b82f6',
                          },
                          '&:focus-within': {
                            borderColor: '#3b82f6',
                            boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
                          },
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
                          color: state.isSelected ? 'white' : '#374151',
                          '&:hover': {
                            backgroundColor: state.isSelected ? '#3b82f6' : '#eff6ff',
                          },
                        }),
                      }}
                    />
                    <ErrorMessage
                      name="medicals"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-light-dark">
                <div className="mb-6 flex items-center">
                  <div className="mr-3 rounded-full bg-orange-100 p-2 dark:bg-orange-900">
                    <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Additional Information</h3>
                  </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* National ID */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      National ID {values.tcountry === 'KW' && <span className="text-red-500">*</span>}
                    </label>
                    <Field
                      type="text"
                      name="national_id"
                      placeholder="Enter National ID"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    />
                    <ErrorMessage
                      name="national_id"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Reference */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Reference
                    </label>
                    <Field
                      type="text"
                      name="reference"
                      placeholder="Enter reference"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button Section */}
              <div className="flex justify-center">
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full max-w-md transform rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:from-orange-600 hover:to-orange-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="mr-2 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Submit Application
                    </div>
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

// export default typeChoicSlip;
export default withAuth(typeChoicSlip, {
  isProtectedRoute: true,
  show: false,
});
