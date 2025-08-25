import React, { useState, useCallback } from 'react';
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
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = useCallback(async (values, { setSubmitting, setFieldError }) => {
    if (isLoggingIn) return; // Prevent multiple submissions
    
    try {
      setIsLoggingIn(true);
      setSubmitting(true);
      
      // Optimize API call with timeout and better error handling
      const response = await axios.post(`${process.env.API_URL}/login`, values, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });
      
      if (response.data.status === "success") {
        // Set cookies efficiently
        const cookiesToSet = [
          { name: 'token', value: response.data.access_token, options: { secure: true, sameSite: 'strict' } },
          { name: 'user', value: JSON.stringify(response.data.user), options: { secure: true, sameSite: 'strict' } },
          { name: 'role', value: response.data.role, options: { secure: true, sameSite: 'strict' } }
        ];
        
        cookiesToSet.forEach(({ name, value, options }) => {
          Cookies.set(name, value, options);
        });
        
        toast.success("Login Successful");
        
        // Use router.push instead of window.location for better performance
        router.push('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.code === 'ECONNABORTED') {
        toast.error('Login timeout. Please check your connection and try again.');
      } else if (error.response?.data?.message?.error?.[0]) {
        toast.error(error.response.data.message.error[0]);
      } else if (error.response?.status === 401) {
        toast.error('Invalid email or password');
      } else if (error.response?.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setIsLoggingIn(false);
      setSubmitting(false);
    }
  }, [isLoggingIn, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-[500px] rounded-3xl border-2 bg-white p-7 shadow-lg">
        <h2 className="text-center text-3xl font-semibold text-gray-800">
          {router.pathname === '/login' && 'User'} - Login
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnChange={false}
          validateOnBlur={true}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="mt-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter Your Email"
                  className={`mt-2 w-full rounded-lg py-3 px-4 border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email && touched.email 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                  autoComplete="email"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  placeholder="Enter Your Password"
                  className={`mt-2 w-full rounded-lg py-3 px-4 border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password && touched.password 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                  autoComplete="current-password"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoggingIn || isSubmitting}
                  className="w-full rounded-lg bg-orange-400 py-3 px-5 text-lg font-medium text-white hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoggingIn ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    'Login'
                  )}
                </Button>
              </div>
            </Form>
          )}
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
