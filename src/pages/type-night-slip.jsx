/* eslint-disable react-hooks/rules-of-hooks */
import Button from '@/components/ui/button';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import withAuth from '@/hook/PrivateRoute';
import { headers } from '@/utls/auth';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import toast from 'react-hot-toast';
import axios from 'axios';
import DatePickerForm from '@/components/Form/DatePickerForm';
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
  national_id: Yup.string().when('tcountry', {
    is: 'KW',
    then: Yup.string().required('National ID is required for Kuwait'),
    otherwise: Yup.string().notRequired(),
  }),
  reference: Yup.string(),
});

const typeNormalSlip = () => {
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
      const response = await axios.post(
        `${process.env.API_URL}/create-normal`,
        values,
        {
          headers: headers,
        }
      );
      if (response.data.status === 'success') {
        toast.success('Night Slip Created   Successfully !');
        router.push('/night-slip');
      }
      if (response.data.status === 'error') {
        Object.keys(response.data.message.error).forEach((key) => {
          const errorMessage = response?.data?.message.error[key][0];
          toast.error(errorMessage);
        });
        // console.log('Error submitting form:', response.data.message.error);
      }

   
      setSubmitting(false);
    } catch (error) {
      if (error.response) {
        console.log(
          'Error submitting form:',
          error.response.data.message.error[0]
        );
        Object.keys(error?.response?.data?.message).forEach((key) => {
          const errorMessage = error?.response?.data?.msg[key][0];
          toast.error(errorMessage);
        });
      }
      console.error('Submission error:', error);
      setSubmitting(false);
    }
  };

  return (
    <>
      <NextSeo
        title="GCC Normal Slip"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <div className="">
        <div className="rounded-tl-lg rounded-tr-lg bg-white px-4 pt-6 dark:bg-light-dark md:px-8 md:pt-8">
          <div className="flex flex-col items-center justify-between border-b border-dashed border-gray-200 pb-5 dark:border-gray-700 md:flex-row">
            <h2 className="mb-3 shrink-0 text-lg font-medium uppercase text-black dark:text-white sm:text-xl md:mb-0 md:text-2xl">
              Type Night Slip
            </h2>
          </div>
        </div>
      </div>

      <div className="rounded-md bg-white py-3 px-7">
        <Formik
          initialValues={{
            first_name: '',
            last_name: '',
            passport: '',
            gender: '',
            dob: '',
            marital_status: '',
            passport_issue_date: '',
            passport_expiry_on: '',
            national_id: '',
            reference: '',
            applied_position: '31',
            tcountry: '',
            city: '',
            slip_type: 'night',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, value, setFieldValue }) => (
            <Form>
              <div className="flex items-start gap-8">
                {/* left */}
                <div className="">
                  {/* item */}
                  <div className="">
                    <label>First Name</label>
                    <Field
                      name="first_name"
                      type="text"
                      placeholder="First Name"
                      className="mt-1 w-full rounded-lg border border-slate-400 py-2 text-sm"
                    />
                    <ErrorMessage
                      name="first_name"
                      component="div"
                      className="text-red-500"
                    />
                  </div>

                  {/* item */}
                  <div className="mt-3">
                    <label>Last Name</label>
                    <Field
                      name="last_name"
                      type="text"
                      placeholder="Last Name"
                      className="mt-1 w-full rounded-lg border border-slate-400 py-2 text-sm"
                    />
                    <ErrorMessage
                      name="last_name"
                      component="div"
                      className="text-red-500"
                    />
                  </div>

                  {/* item */}
                  <div className="mt-3">
                    <label>Passport No</label>
                    <Field
                      name="passport"
                      type="text"
                      placeholder="Passport No"
                      className="mt-1 w-full rounded-lg border border-slate-400 py-2 text-sm"
                    />
                    <ErrorMessage
                      name="passport"
                      component="div"
                      className="text-red-500"
                    />
                  </div>

                  {/* item */}
                  <div className="mt-3">
                    <label>Gender</label>
                    <Field
                      as="select"
                      name="gender"
                      className="mt-1 w-full rounded-lg border border-slate-400 py-2 text-sm"
                    >
                      <option value="">Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </Field>
                    <ErrorMessage
                      name="gender"
                      component="div"
                      className="text-red-500"
                    />
                  </div>

                  {/* item */}
                  <div className="mt-3">
                    <label> Meritial Status </label>
                    <Field
                      as="select"
                      name="marital_status"
                      className="mt-1 w-full rounded-lg border border-slate-400 py-2 text-sm"
                    >
                      <option value="">Marital Status</option>
                      <option value="married">Married</option>
                      <option value="unmarried">Unmarried</option>
                    </Field>
                    <ErrorMessage
                      name="marital_status"
                      component="div"
                      className="text-red-500"
                    />
                  </div>

                  {/* item */}
                  <div className="mt-3">
                    <label>Date of Birth</label>
                    {/* <Field
                      type="date"
                      name="dob"
                      placeholder="dd/mm/yyyy"
                      className="mt-1 w-full rounded-lg border border-slate-400 py-2 text-sm"
                    /> */}
                    <DatePickerForm
                      value={value?.dob}
                      name="dob"
                      setFieldValue={setFieldValue}
                      className="mt-1 w-full rounded-lg border border-slate-400 py-2 text-sm"
                    />
                    <ErrorMessage
                      name="dob"
                      component="div"
                      className="text-red-500"
                    />
                  </div>

                  {/* item */}
                  <div className="mt-3">
                    <label>Passport Issue Date</label>
                    <div className="flex gap-1">
                      <div>
                        {/* <Field
                          type="date"
                          name="passport_issue_date"
                          placeholder=""
                          className="mt-1 w-full rounded-lg border border-slate-400 py-2 text-sm"
                        /> */}

                        <DatePickerForm
                          value={value?.passport_issue_date}
                          name="passport_issue_date"
                          setFieldValue={setFieldValue}
                          className="mt-1 w-full rounded-lg border border-slate-400 py-1 text-sm"
                        />
                        <ErrorMessage
                          name="passport_issue_date"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      <div>
                        <Field
                          as="select"
                          name="passport_expiry_on"
                          className="mt-1 w-full rounded-lg border border-slate-400 py-2 text-sm"
                        >
                          <option value="">--Expiration--</option>
                          <option value="5"> 5 year</option>
                          <option value="10">10 years</option>
                        </Field>
                        <ErrorMessage
                          name="passport_expiry_on"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* item */}
                  <div className="mt-3">
                    <label>Position Applied For</label>
                    <Field
                      as="select"
                      name="applied_position"
                      className="mt-1 w-full rounded-lg border border-slate-400 py-2 text-sm"
                    >
                      <option value="31" selected>
                        Labour
                      </option>
                      <option value="59">House Maid</option>
                      <option value="65">Driver</option>
                      <option value="76">Worker</option>
                      <option value="77">House Boy </option>
                    </Field>
                    <ErrorMessage
                      name="applied_position"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                </div>

                {/* right */}
                <div className="">
                  {/* item */}
                  <div className="">
                    <label>City</label>
                    <Field
                      as="select"
                      name="city"
                      className="mt-1 w-full rounded-lg border border-slate-400 py-2 text-sm"
                    >
                      <option value="">Select your City</option>
                      {/* <option value="81">Chitagong</option> */}
                      <option value="80">Dhaka</option>
                      {/* <option value="83">Sylhet</option> */}
                    </Field>
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="text-red-500"
                    />
                  </div>

                  {/* item */}
                  <div className="mt-3">
                    <label>Countryt Travelling To</label>
                    <Field
                      as="select"
                      name="tcountry"
                      className="mt-1 w-full rounded-lg border border-slate-400 py-2 text-sm"
                    >
                      <option value="Single">Select GCC country</option>
                      {/* <option value="BH">Bahrain</option> */}
                      <option value="KW">Kuwait</option>
                      {/* <option value="OM">Oman</option> */}
                      {/* <option value="QA">Qatar</option> */}
                      <option value="SA">Saudi Areabia</option>
                      {/* <option value="UAE">UAE</option> */}
                      {/* <option value="YEM">Yemen</option> */}
                    </Field>
                    <ErrorMessage
                      name="tcountry"
                      component="div"
                      className="text-red-500"
                    />
                  </div>

                  {/* item */}
                  <div className="mt-3">
                    <label>National ID</label>
                    <Field
                      type="text"
                      name="national_id"
                      placeholder="National ID"
                      className="mt-1 w-full rounded-lg border border-slate-400 py-2 text-sm"
                    />
                    <ErrorMessage
                      name="national_id"
                      component="div"
                      className="text-red-500"
                    />
                  </div>

                  {/* item */}
                  <div className="mt-3">
                    <label>Refarence</label>
                    <Field
                      type="text"
                      name="reference"
                      placeholder="Refarence"
                      className="mt-1 w-full rounded-lg border border-slate-400 py-2 text-sm"
                    />
                  </div>
                  <ErrorMessage
                    name="reference"
                    component="div"
                    className="text-red-500"
                  />
                </div>
              </div>

              {/* submin */}
              <div className="text-center">
                <Button className="w-1/4 !bg-orange-500 text-2xl">
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

// export default typeNormalSlip;
export default withAuth(typeNormalSlip, {
  isProtectedRoute: true,
  show: false,
});
