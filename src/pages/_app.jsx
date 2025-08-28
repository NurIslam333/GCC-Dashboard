/* eslint-disable react-hooks/exhaustive-deps */

import Head from 'next/head';
import { useState, useCallback, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import ModalsContainer from '@/components/modal-views/container';
import DrawersContainer from '@/components/drawer-views/container';
import SettingsButton from '@/components/settings/settings-button';
import SettingsDrawer from '@/components/settings/settings-drawer';
import { WalletProvider } from '@/lib/hooks/use-connect';
import { AuthProvider } from '@/components/auth/AuthContext';
import 'overlayscrollbars/css/OverlayScrollbars.css';
// base css file
import 'swiper/css';
import '@/assets/css/scrollbar.css';
import '@/assets/css/globals.css';
import '@/assets/css/range-slider.css';
import 'react-tooltip/dist/react-tooltip.css';

import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';
import RootLayout from '@/layouts/_root-layout';
import { isTokenExpired } from '@/utls/auth';
import Cookies from 'js-cookie';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Pusher from 'pusher-js';

import { Tooltip } from '@mui/material';
import CountDown from '../components/drag-and-drop/CountDown';
import { createRoot } from 'react-dom/client';
import Button from '@/components/ui/button';
import { headers } from '@/utls/auth';
import axios from 'axios';
import Otp from '../components/drag-and-drop/Otp';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import PerformanceDashboard from '@/components/PerformanceDashboard';


// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function CustomApp({ Component, pageProps }) {
  const token = Cookies.get('token');
  const getRole = Cookies.get('role');
  const [pusherConnected, setPusherConnected] = useState(false);
  const [paymentId, setPaymentId] = useState({ card_no: '', id: '' });
  const [selectedItems, setSelectedItems] = useState([]);
  let pusher;
  let elms = {};

  const updateElms = (newKey, newValue) => {
    elms[newKey] = newValue;
  };

  const getElms = (searchKey) => {
    return elms[searchKey] ?? null;
  };

  const handleShowMedical = async (data, id, payId) => {
    try {
      const values = {
        card_no: data,
        slip_url_id: payId,
      };
      const response = await axios.post(
        `${process.env.API_URL}/admin/show-medical/${id}`,
        values,
        {
          headers: headers,
        }
      );
      if (response.data.status === 'success') {
        const successMessage = response?.data?.message.success[0];
        toast.success(successMessage);
        setSelectedItems([]);
        setPaymentId({});
      }
      if (response.data.status === 'error') {
        Object.keys(response.data.message.error).forEach((key) => {
          const errorMessage = response?.data?.message.error[key];
          toast.error(errorMessage);
          setPaymentId({});
        });
      }
    } catch (error) {
      console.error('Error updating card index:', error);
    }
  };

  const handleComplete = async (data, id, payId) => {
    try {
      const values = {
        card_no: data,
        slip_url_id: payId,
      };
      const response = await axios.post(
        `${process.env.API_URL}/admin/complete-payment/${id}`,
        values,
        {
          headers: headers,
        }
      );
      if (response.data.status === 'success') {
        const successMessage = response?.data?.message.success[0];
        toast.success(successMessage);
        setSelectedItems([]);
        setPaymentId({});
      }
      if (response.data.status === 'error') {
        Object.keys(response.data.message.error).forEach((key) => {
          const errorMessage = response?.data?.message.error[key];
          toast.error(errorMessage);
          setPaymentId({});
        });
      }
    } catch (error) {
      console.error('Error updating card index:', error);
    }
  };

  const router = useRouter();

  useEffect(() => {
    if (pusherConnected) {
      return () => {};
    }

    pusher = new Pusher('2bfc2087a04334d5cf49', {
      cluster: 'ap1',
      encrypted: true,
    });

    let user = Cookies.get('user');

    try {
      user = JSON.parse(user);
    } catch (error) {
      user = {};
    }

    const channelName =
      getRole == 'admin'
        ? 'update-pay-page'
        : `update-link.${user?.id}`;

    const channel = pusher?.subscribe(channelName);

    const handlePaymentUpdate = (data) => {

      let pay_slip_id = data.id || null,
        event_type = data.type,
        slip_data = data.data;

      if (pay_slip_id == null) return;

      let target_slip = document.querySelector(
        '[data-pay-slip-id="' + pay_slip_id + '"]'
      );

      if (target_slip == null) return;

      let replaceElm = null;

      if (event_type == 'update_medical') {
        let targetElm = target_slip.querySelector('td:nth-child(8)');

        replaceElm = getElms(pay_slip_id + '-7') ?? createRoot(targetElm);
        updateElms(pay_slip_id + '-7', replaceElm);

        replaceElm?.render(
          <Tooltip title={slip_data} placement="top-start">
            <span>
              {slip_data !== null && slip_data.length < 12 ? (
                <span>{slip_data !== null && slip_data}</span>
              ) : (
                slip_data !== null && (
                  <span>
                    {slip_data !== null && slip_data?.slice(0, 13)}
                    ...
                  </span>
                )
              )}
            </span>
          </Tooltip>
        );
      } else if (event_type == 'update_notice') {
        target_slip.querySelector('td:nth-child(11)').innerHTML = slip_data;
      } else if (event_type == 'update_timer') {
        let targetElm = target_slip.querySelector('td:nth-child(10)');

        if (slip_data !== null) {
          replaceElm = getElms(pay_slip_id + '-9') ?? createRoot(targetElm);
          updateElms(pay_slip_id + '-9', replaceElm);
          replaceElm?.render(<CountDown time={slip_data} />);
        } else {
          targetElm.innerHTML = '';
        }
      } else if (event_type == 'update_slip') {
        let tds = target_slip.querySelectorAll('td'),
          city = slip_data?.city,
          tcountry = slip_data?.tcountry,
          passport = slip_data?.passport;

        tds[2].innerHTML = `<p>${passport}</p><p>${tcountry}</p><p>${city}</p>`;
        tds[4].innerHTML = slip_data?.type;

        replaceElm = getElms(pay_slip_id + '-5') ?? createRoot(tds[5]);
        updateElms(pay_slip_id + '-5', replaceElm);

        replaceElm?.render(
          <Tooltip
            title={
              slip_data?.medical_list !== null
                ? slip_data?.medical_list?.map((item, index) => {
                    return (
                      <ul key={'ml-' + slip_data.id + '-' + index}>
                        <li>
                          {' '}
                          {index + 1} .{item}
                        </li>
                      </ul>
                    );
                  })
                : 'N/A'
            }
            placement="top-start"
          >
            <span
              style={{
                display: 'flex',
                alignItem: 'center',
                justifyContent: 'center',
              }}
            >
              {slip_data?.medical_list !== null &&
              slip_data?.medical_list[0]?.length < 15 ? (
                <span>{slip_data?.medical_list[0]}</span>
              ) : (
                slip_data?.medical_list !== null && (
                  <span>
                    {slip_data?.medical_list !== null &&
                      slip_data?.medical_list[0]?.slice(0, 13)}
                    ...
                  </span>
                )
              )}
            </span>
          </Tooltip>
        );

        replaceElm = getElms(pay_slip_id + '-6') ?? createRoot(tds[6]);
        updateElms(pay_slip_id + '-6', replaceElm);

        replaceElm?.render(
          <h4 className="flex gap-2 font-medium text-orange-400">
            <p>{slip_data?.medical_id}.</p>
            <Tooltip title={slip_data?.medical_name} placement="top-start">
              <span>
                {slip_data?.medical_name?.length < 12 ? (
                  <span>{slip_data?.medical_name}</span>
                ) : (
                  <span>
                    {slip_data?.medical_name?.slice(0, 13)}
                    ...
                  </span>
                )}
              </span>
            </Tooltip>
          </h4>
        );

        replaceElm = getElms(pay_slip_id + '-7') ?? createRoot(tds[7]);
        updateElms(pay_slip_id + '-7', replaceElm);

        replaceElm?.render(
          <h4 className="flex gap-2 font-medium ">
            <Tooltip
              title={
                slip_data?.slip_medical !== null && slip_data?.slip_medical
              }
              placement="top-start"
            >
              <span>
                {slip_data?.slip_medical !== null &&
                slip_data?.slip_medical.length < 12 ? (
                  <span>
                    {slip_data?.slip_medical !== null &&
                      slip_data?.slip_medical}
                  </span>
                ) : (
                  slip_data?.slip_medical !== null && (
                    <span>
                      {slip_data?.slip_medical !== null &&
                        slip_data?.slip_medical?.slice(0, 13)}
                      ...
                    </span>
                  )
                )}
              </span>
            </Tooltip>
          </h4>
        );

        replaceElm = getElms(pay_slip_id + '-8') ?? createRoot(tds[8]);
        updateElms(pay_slip_id + '-8', replaceElm);

        replaceElm?.render(
          <>
            {slip_data?.pay_one !== null && (
              <Button
                onClick={() => {
                  setPaymentId({
                    card_no: 1,
                    id: slip_data.id,
                  });
                  handleComplete(1, slip_data?.id, slip_data?.pay_one);
                }}
                className={`max-w-28 flex-1 rounded-sm ${
                  paymentId.id === slip_data.id && paymentId.card_no === 1
                    ? 'bg-orange-500'
                    : 'bg-blue-500'
                } p-1 text-center text-white`}
              >
                Pay 1
              </Button>
            )}
            {slip_data?.pay_two !== null && (
              <Button
                onClick={() => {
                  setPaymentId({
                    card_no: 2,
                    id: slip_data.id,
                  });
                  handleComplete(2, slip_data?.id, slip_data?.pay_two);
                }}
                className={`max-w-28 flex-1 rounded-sm ${
                  paymentId.id === slip_data.id && paymentId.card_no === 2
                    ? 'bg-orange-500'
                    : 'bg-blue-500'
                } p-2 text-center text-white`}
              >
                Pay 2
              </Button>
            )}
            {slip_data?.pay_three !== null && (
              <Button
                onClick={() => {
                  setPaymentId({
                    card_no: 3,
                    id: slip_data.id,
                  });
                  handleComplete(1, slip_data?.id, slip_data?.pay_three);
                }}
                className={`max-w-28 flex-1 rounded-sm ${
                  paymentId.id === slip_data.id && paymentId.card_no === 3
                    ? 'bg-orange-500'
                    : 'bg-blue-500'
                } p-2 text-center text-white`}
              >
                Pay 3
              </Button>
            )}

            {slip_data?.pay_four !== null && (
              <Button
                onClick={() => {
                  setPaymentId({
                    card_no: 2,
                    id: slip_data.id,
                  });
                  handleComplete(2, slip_data?.id, slip_data?.pay_four);
                }}
                className={`max-w-28 flex-1 rounded-sm ${
                  paymentId.id === slip_data.id && paymentId.card_no === 4
                    ? 'bg-orange-500'
                    : 'bg-blue-500'
                } p-2 text-center text-white`}
              >
                Pay 4
              </Button>
            )}
            {slip_data?.show_one !== null && (
              <Button
                onClick={() => {
                  setPaymentId({
                    card_no: 5,
                    id: slip_data.id,
                  });
                  handleShowMedical(1, slip_data?.id, slip_data?.show_one);
                }}
                className={`max-w-28 flex-1 rounded-sm ${
                  paymentId.id === slip_data.id && paymentId.card_no === 5
                    ? 'bg-orange-500'
                    : 'bg-blue-500'
                } p-2 text-center text-white`}
              >
                Show 1
              </Button>
            )}
            {slip_data?.show_two !== null && (
              <Button
                onClick={() => {
                  setPaymentId({
                    card_no: 6,
                    id: slip_data.id,
                  });
                  handleShowMedical(1, slip_data?.id, slip_data?.show_two);
                }}
                className={`max-w-28 flex-1 rounded-sm ${
                  paymentId.id === slip_data.id && paymentId.card_no === 6
                    ? 'bg-orange-500'
                    : 'bg-blue-500'
                } p-2 text-center text-white`}
              >
                Show 2
              </Button>
            )}

            {slip_data?.show_three !== null && (
              <Button
                onClick={() => {
                  setPaymentId({
                    card_no: 7,
                    id: slip_data.id,
                  });
                  handleShowMedical(1, slip_data?.id, slip_data?.show_three);
                }}
                className={`max-w-28 flex-1 rounded-sm ${
                  paymentId.id === slip_data.id && paymentId.card_no === 7
                    ? 'bg-orange-500'
                    : 'bg-blue-500'
                } p-2 text-center text-white`}
              >
                Show 3
              </Button>
            )}
            {slip_data?.show_four !== null && (
              <Button
                onClick={() => {
                  setPaymentId({
                    card_no: 8,
                    id: slip_data.id,
                  });
                  handleShowMedical(1, slip_data?.id, slip_data?.show_four);
                }}
                className={`max-w-28 flex-1 rounded-sm ${
                  paymentId.id === slip_data.id && paymentId.card_no === 8
                    ? 'bg-orange-500'
                    : 'bg-blue-500'
                } p-2 text-center text-white`}
              >
                Show 4
              </Button>
            )}
          </>
        );

        if (slip_data.timer !== null) {
          replaceElm = getElms(pay_slip_id + '-9') ?? createRoot(tds[9]);
          updateElms(pay_slip_id + '-9', replaceElm);

          replaceElm?.render(<CountDown time={slip_data.timer} />);
        } else {
          tds[9].innerHTML = '';
        }

        tds[10].innerHTML = slip_data?.notice;
        tds[11].innerHTML = slip_data?.user_name;
        tds[12].innerHTML = slip_data?.slip_price;

        toast.success('New slip shifted');
      } else if (event_type == 'update_buttons') {
        let tds = target_slip.querySelectorAll('td');

        replaceElm = getElms(pay_slip_id + '-8') ?? createRoot(tds[8]);
        updateElms(pay_slip_id + '-8', replaceElm);

        replaceElm?.render(
          <>
            {slip_data?.pay_one !== null && (
              <Button
                data-pay={data?.pay_one}
                onClick={() => {
                  setPaymentId({
                    card_no: 1,
                    id: slip_data.id,
                  });
                  handleComplete(1, slip_data?.id, slip_data?.pay_one);
                }}
                className={`max-w-28 flex-1 rounded-sm ${
                  paymentId.id === slip_data.id && paymentId.card_no === 1
                    ? 'bg-orange-500'
                    : 'bg-blue-500'
                } p-1 text-center text-white`}
              >
                Pay 1
              </Button>
            )}
            {slip_data?.pay_two !== null && (
              <Button
                data-pay={data?.pay_two}
                onClick={() => {
                  setPaymentId({
                    card_no: 2,
                    id: slip_data.id,
                  });
                  handleComplete(2, slip_data?.id, slip_data?.pay_two);
                }}
                className={`max-w-28 flex-1 rounded-sm ${
                  paymentId.id === slip_data.id && paymentId.card_no === 2
                    ? 'bg-orange-500'
                    : 'bg-blue-500'
                } p-2 text-center text-white`}
              >
                Pay 2
              </Button>
            )}
            {slip_data?.pay_three !== null && (
              <Button
                data-pay={data?.pay_three}
                onClick={() => {
                  setPaymentId({
                    card_no: 3,
                    id: slip_data.id,
                  });
                  handleComplete(1, slip_data?.id, slip_data?.pay_three);
                }}
                className={`max-w-28 flex-1 rounded-sm ${
                  paymentId.id === slip_data.id && paymentId.card_no === 3
                    ? 'bg-orange-500'
                    : 'bg-blue-500'
                } p-2 text-center text-white`}
              >
                Pay 3
              </Button>
            )}

            {slip_data?.pay_four !== null && (
              <Button
                data-pay={data?.pay_four}
                onClick={() => {
                  setPaymentId({
                    card_no: 2,
                    id: slip_data.id,
                  });
                  handleComplete(2, slip_data?.id, slip_data?.pay_four);
                }}
                className={`max-w-28 flex-1 rounded-sm ${
                  paymentId.id === slip_data.id && paymentId.card_no === 4
                    ? 'bg-orange-500'
                    : 'bg-blue-500'
                } p-2 text-center text-white`}
              >
                Pay 4
              </Button>
            )}
            {slip_data?.show_one !== null && (
              <Button
                data-show={data?.show_one}
                onClick={() => {
                  setPaymentId({
                    card_no: 5,
                    id: slip_data.id,
                  });
                  handleShowMedical(1, slip_data?.id, slip_data?.show_one);
                }}
                className={`max-w-28 flex-1 rounded-sm ${
                  paymentId.id === slip_data.id && paymentId.card_no === 5
                    ? 'bg-orange-500'
                    : 'bg-blue-500'
                } p-2 text-center text-white`}
              >
                Show 1
              </Button>
            )}
            {slip_data?.show_two !== null && (
              <Button
                data-show={data?.show_two}
                onClick={() => {
                  setPaymentId({
                    card_no: 6,
                    id: slip_data.id,
                  });
                  handleShowMedical(1, slip_data?.id, slip_data?.show_two);
                }}
                className={`max-w-28 flex-1 rounded-sm ${
                  paymentId.id === slip_data.id && paymentId.card_no === 6
                    ? 'bg-orange-500'
                    : 'bg-blue-500'
                } p-2 text-center text-white`}
              >
                Show 2
              </Button>
            )}

            {slip_data?.show_three !== null && (
              <Button
                data-show={data?.show_three}
                onClick={() => {
                  setPaymentId({
                    card_no: 7,
                    id: slip_data.id,
                  });
                  handleShowMedical(1, slip_data?.id, slip_data?.show_three);
                }}
                className={`max-w-28 flex-1 rounded-sm ${
                  paymentId.id === slip_data.id && paymentId.card_no === 7
                    ? 'bg-orange-500'
                    : 'bg-blue-500'
                } p-2 text-center text-white`}
              >
                Show 3
              </Button>
            )}
            {slip_data?.show_four !== null && (
              <Button
                data-show={data?.show_four}
                onClick={() => {
                  setPaymentId({
                    card_no: 8,
                    id: slip_data.id,
                  });
                  handleShowMedical(1, slip_data?.id, slip_data?.show_four);
                }}
                className={`max-w-28 flex-1 rounded-sm ${
                  paymentId.id === slip_data.id && paymentId.card_no === 8
                    ? 'bg-orange-500'
                    : 'bg-blue-500'
                } p-2 text-center text-white`}
              >
                Show 4
              </Button>
            )}

            <Otp key={data.id} data={slip_data} />
          </>
        );
      }
    };

    const handleLinkUpdate = (data) => {

      let link_slip_id = data.id || null,
        event_type = data.type,
        slip_data = data.data;

      if (link_slip_id == null) return;

      let target_slip = document.querySelector(
        '[data-link-slip-id="' + link_slip_id + '"]'
      );

      if (target_slip == null) return;

      if (event_type == 'update_medical') {
        let targetElm = target_slip.querySelector('td:nth-child(4)');
        targetElm.innerHTML = slip_data;
      } else if (event_type == 'update_notice') {
        target_slip.querySelector('td:nth-child(7)').innerHTML = slip_data;
      } else if (event_type == 'update_timer') {
        let targetElm = target_slip.querySelector('td:nth-child(6)');

        if (slip_data !== null) {
          createRoot(targetElm).render(<CountDown time={slip_data} />);
        } else {
          targetElm.innerHTML = '';
        }
      } else if (event_type == 'update_slip') {
        toast.success('New slip available');
      }
    };

    // Bind the event only once
    if (getRole == 'admin') {
      channel.bind('App\\Events\\PaymentUpdate', handlePaymentUpdate);
    } else {
      channel.bind('update-link', handleLinkUpdate);
    }

    // Set the state to indicate that Pusher is now connected
    setPusherConnected(true);
    // Cleanup function to unsubscribe when the component unmounts
    return () => {};
  }, [pusherConnected]);
  // useEffect(() => {
  //   if (!token || isTokenExpired(token)) {
  //     Cookies.remove('user');
  //     Cookies.remove('role');
  //     // if (getRole === 'user') {
  //     //   router.push('/login');
  //     // } else {
  //     //   router.push('/admin/login');
  //     // }
  //     // Cookies.remove('token');
  //   }
  // }, []);

  // Check if the current route starts with "/login"
  const isLoginPage =
    router.pathname.startsWith('/secure-login') ||
    router.pathname.startsWith('/login') ||
    router.pathname.startsWith('/404');
  //could remove this if you don't need to page level layout
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        {/* maximum-scale 1 meta tag need to prevent ios input focus auto zooming */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1 maximum-scale=1"
        />
        <meta name="description" content="GCCHMC Site Description" />
        <meta name="keywords" content="GCCHMC, gcc, hmc, medical" />
        <title>Dashboard - GCCHMC</title>
      </Head>
      <ThemeProvider
        attribute="class"
        enableSystem={false}
        defaultTheme="light"
      >
        <AuthProvider>
          <WalletProvider>
            {isLoginPage ? (
              // If it's the login page
              <>
                <DndProvider backend={HTML5Backend}>
                  <Toaster position="top-center" reverseOrder={false} />
                  <Component {...pageProps} />
                </DndProvider>
              </>
            ) : (
              // Otherwise, wrap in Layout
              <RootLayout>
                <DndProvider backend={HTML5Backend}>
                  <Toaster position="top-center" reverseOrder={false} />
                  <Component {...pageProps} />
                </DndProvider>
              </RootLayout>
            )}
            {/* {getLayout(
            <Component {...pageProps} />
            )} */}

            <SettingsButton />
            <SettingsDrawer />
            <ModalsContainer />
            <DrawersContainer />
          </WalletProvider>
        </AuthProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      {process.env.NODE_ENV === 'development' && <PerformanceDashboard />}
    </QueryClientProvider>
  );
}

export default CustomApp;
