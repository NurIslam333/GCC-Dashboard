/* eslint-disable react-hooks/rules-of-hooks */
import { NextSeo } from 'next-seo';

import Scrollbar from '@/components/ui/scrollbar';
import withAuth from '@/hook/PrivateRoute';
import axios from 'axios';
import { headers } from '@/utls/auth';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import Button from '@/components/ui/button';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const addUser = () => {
  const router = useRouter();
  const getRole = Cookies.get('role');
  const handleSubmit = async ({ name, email, password }, { setSubmitting }) => {
    try {
    
        const userData = { name, email, password };
        const response = await axios.post(
          `${process.env.API_URL}/admin/register`,
          userData,
          {
            headers: headers,
          }
        );
        if (response.data.status === 'success') {
          toast.success('User Created   Successfully !');
          router.push('/total-user');
        }
        if (response.data.status === 'error') {
          Object.keys(response.data.message.error).forEach((key) => {
            const errorMessage = response?.data?.message.error[key][0];
            toast.error(errorMessage);
          });
          // console.log('Error submitting form:', response.data.message.error);
        }
    
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <NextSeo
        title="GCC Total User"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <div className="">
        <div className="rounded-tl-lg rounded-tr-lg bg-white px-4 pt-6 dark:bg-light-dark md:px-8 md:pt-8">
          <div className="flex flex-col items-center justify-between border-b border-dashed border-gray-200 pb-5 dark:border-gray-700 md:flex-row">
            <h2 className="mb-3 shrink-0 text-lg font-medium uppercase text-black dark:text-white sm:text-xl md:mb-0 md:text-2xl">
              Add User
            </h2>
          </div>
        </div>
        <div className="-mx-0.5">
          <Scrollbar style={{ width: '100%' }} autoHide="never">
            <div className="mt-5 bg-white p-5">
              <div className="m-auto w-2/5">
                {/* Formik form */}
                <Formik
                  initialValues={{
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  <Form>
                    {/* Name */}
                    <div className="">
                      <label>Name</label>
                      <Field
                        type="text"
                        name="name"
                        className="mt-1 w-full rounded-lg border border-slate-400 py-2 text-sm"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500"
                      />
                    </div>

                    {/* Email */}
                    <div className="mt-3">
                      <label>Email</label>
                      <Field
                        type="text"
                        name="email"
                        className="mt-1 w-full rounded-lg border border-slate-400 py-2 text-sm"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500"
                      />
                    </div>

                    {/* Password */}
                    <div className="mt-3">
                      <label>Password</label>
                      <Field
                        type="password"
                        name="password"
                        className="mt-1 w-full rounded-lg border border-slate-400 py-2 text-sm"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500"
                      />
                    </div>

                    {/* Confirm Password */}
                    <div className="mt-3">
                      <label>Confirm Password</label>
                      <Field
                        type="password"
                        name="confirmPassword"
                        className="mt-1 w-full rounded-lg border border-slate-400 py-2 text-sm"
                      />
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-red-500"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="mt-3">
                      <Button
                        type="submit"
                        className="rounded-none !bg-orange-400"
                      >
                        Add User
                      </Button>
                    </div>
                  </Form>
                </Formik>
              </div>
            </div>
          </Scrollbar>
        </div>
      </div>
    </>
  );
};

export default withAuth(addUser, {
  isProtectedRoute: true,
  show: false,
});
