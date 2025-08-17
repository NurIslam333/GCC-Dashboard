import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '@/components/ui/button';
import withAuth from '@/hook/PrivateRoute';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useToast } from "@/hook/useToast";
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const Index = () => {
  const showToast = useToast();
  const router = useRouter();
  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${process.env.API_URL}/login`, values, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if(response.data.status === "success"){
        toast.success("login Successfully")
        Cookies.set('token', response.data.access_token)
        Cookies.set('user', JSON.stringify(response.data.user))
        Cookies.set('role', response.data.role)
        window.location.href = "/";
        router.push('/')
      }
 

    } catch (error) {
      toast.error(error.response.data.message.error[0])
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-[500px] rounded-3xl border-2 bg-white p-7 shadow-md">
        <h2 className="text-center text-3xl font-semibold">
         {router.pathname === '/login'  && 'User'} - Login
          </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="mt-5">
            <div>
              <label>Email</label>
              <Field
                type="text"
                name="email"
                placeholder="Enter Your Email"
                className="mt-2 w-full rounded-lg py-2 px-5"
              />
              <ErrorMessage name="email" component="div" className="text-red-500" />
            </div>

            <div className="mt-5">
              <label>Password</label>
              <Field
                type="password"
                name="password"
                placeholder="Enter Your Password"
                className="mt-2 w-full rounded-lg py-2 px-5"
              />
              <ErrorMessage name="password" component="div" className="text-red-500" />
            </div>

            <div className="mt-5">
              <Button
                type="submit"
                className="w-full rounded-lg bg-orange-400 py-3 px-5 text-lg font-medium"
              >
                Login
              </Button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};



export default withAuth(Index, {
  isProtectedRoute: false,
  redirectIfNotAuthenticated: "/login",
  redirectIfAuthenticated: "/",
});
