/* eslint-disable react/no-unescaped-entities */
import withAuth from '@/hook/PrivateRoute';
import { useState, useCallback, useEffect } from 'react';
import { textFormate } from '@/utls/capitalized';
import toast from 'react-hot-toast';
import FilterSelector from '@/components/KsaSlip/FilterSelector';
import UDateRangePicker from '@/components/KsaSlip/UDateRangePicker';
import { useAuth } from '@/components/auth/AuthContext';

const formatDate = (inputDate) => {
  return inputDate?.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
};

const HomePage = () => {
  const { role, isLoading, isAuthenticated } = useAuth();
  const [normalUserSlip, setNormalUserSlip] = useState([]);
  const [adminUserSlip, setAdminUserSlip] = useState([]);
  const [csp_date, setCsp_date] = useState('today');
  const [tea_date, setTea_date] = useState('today');
  const [tcs_date, setTcs_date] = useState('today');
  const [tcs_start_date, setTcs_start_date] = useState('');
  const [tcs_end_date, setTcs_end_date] = useState('');
  const [tea_start_date, setTea_start_date] = useState('');
  const [tea_end_date, setTea_end_date] = useState('');

  const [nnp_date, setNnp_date] = useState('today');
  const [nsp_date, setNsp_date] = useState('today');
  const [fsp_date, setFsp_date] = useState('today');
  const [tsp_date, setTsp_date] = useState('today');
  const [csc_date, setCsc_date] = useState('today');
  const [nsc_date, setNsc_date] = useState('today');
  const [csc_start_date, setCsc_start_date] = useState('');
  const [csc_end_date, setCsc_end_date] = useState('');
  const [nsc_start_date, setNsc_start_date] = useState('');
  const [nsc_end_date, setNsc_end_date] = useState('');

  // EXTREMELY AGGRESSIVE: Debug logging and immediate data fetching for role changes
  useEffect(() => {
    // IMMEDIATE DATA FETCHING: If role changes and we have authentication, fetch data immediately
    if (role && isAuthenticated) {
      // First check if we have pre-fetched stats data from login
      if (role === 'admin') {
        const preFetchedAdminStats = localStorage.getItem('adminStats');
        if (preFetchedAdminStats) {
          try {
            const stats = JSON.parse(preFetchedAdminStats);
            setAdminUserSlip(stats);
            // Clear the pre-fetched data after using it
            localStorage.removeItem('adminStats');
          } catch (error) {
            // If parsing fails, fetch fresh data
            handleFetchAdminUser();
          }
        } else {
          handleFetchAdminUser();
        }
      } else if (role === 'user') {
        const preFetchedUserStats = localStorage.getItem('userStats');
        if (preFetchedUserStats) {
          try {
            const stats = JSON.parse(preFetchedUserStats);
            setNormalUserSlip(stats);
            // Clear the pre-fetched data after using it
            localStorage.removeItem('userStats');
          } catch (error) {
            // If parsing fails, fetch fresh data
            handleFetchNormalUser();
          }
        } else {
          handleFetchNormalUser();
        }
      }
    }
  }, [role, isLoading, isAuthenticated, handleFetchNormalUser, handleFetchAdminUser]);

    const handleFetchNormalUser = useCallback(async () => {
    try {
      if (role === 'user') {
        const params = {
          nsc_date,
          csc_date,
        };
        if (csc_date === 'custom') {
          if (csc_start_date && csc_end_date) {
            params['csc_start_date'] = formatDate(csc_start_date);
            params['csc_end_date'] = formatDate(csc_end_date);
          }
        }
        if (nsc_date === 'custom') {
          if (nsc_start_date && nsc_end_date) {
            params['nsc_start_date'] = formatDate(nsc_start_date);
            params['nsc_end_date'] = formatDate(nsc_end_date);
          }
        }
   
        const response = await fetch(`/api/stats?role=user&${new URLSearchParams(params)}`);
        const data = await response.json();
        if (data.status === 'success') {
          setNormalUserSlip(data.statistics);
        }
      }
    } catch (err) {}
  }, [
    role,
    csc_date,
    nsc_date,
    csc_end_date,
    csc_start_date,
    nsc_end_date,
    nsc_start_date,
    
  ]);
    const handleFetchAdminUser = useCallback(async () => {
    try {
      if (role === 'admin') {
        const params = {
          csp_date,
          nnp_date,
          nsp_date,
          fsp_date,
          tsp_date,
          nsc_date,
          csc_date,
          tea_date,
          tcs_date

        };
        if (csc_date === 'custom') {
          if (csc_start_date && csc_end_date) {
            params['csc_start_date'] = formatDate(csc_start_date);
            params['csc_end_date'] = formatDate(csc_end_date);
          }
        }
        if (nsc_date === 'custom') {
          if (nsc_start_date && nsc_end_date) {
            params['nsc_start_date'] = formatDate(nsc_start_date);
            params['nsc_end_date'] = formatDate(nsc_end_date);
          }
        }
        if (tcs_date === 'custom') {
          if (tcs_start_date && tcs_end_date) {
            params['tcs_start_date'] = formatDate(tcs_start_date);
            params['tcs_end_date'] = formatDate(tcs_end_date);
          }
        }
        if (tea_date === 'custom') {
          if (tea_start_date && tea_end_date) {
            params['tea_start_date'] = formatDate(tea_start_date);
            params['tea_end_date'] = formatDate(tea_end_date);
          }
        }
        if (role === 'admin') {
          const response = await fetch(`/api/stats?role=admin&${new URLSearchParams(params)}`);
          const data = await response.json();
          if (data.status === 'success') {
            setAdminUserSlip(data.statistics);
          }
        }
      }
    } catch (err) {}
  }, [
    role,
    csp_date,
    nnp_date,
    nsp_date,
    fsp_date,
    tsp_date,
    nsc_date,
    csc_date,
    csc_end_date,
    csc_start_date,
    nsc_end_date,
    nsc_start_date,
    tcs_date,
    tcs_end_date,
    tcs_start_date,
    tea_date,
    tea_end_date,
    tea_start_date,
  ]);

    useEffect(() => {
    // EXTREMELY AGGRESSIVE: Fetch data immediately when we have a role, regardless of isLoading
    if (role && isAuthenticated) {
      if (role === 'user') {
        handleFetchNormalUser();
      } else if (role === 'admin') {
        handleFetchAdminUser();
      }
    }
  }, [role, isAuthenticated, handleFetchNormalUser, handleFetchAdminUser]);

    // FORCE DATA FETCHING: Start fetching data immediately when component mounts if we have a role
  useEffect(() => {
    if (role) {
      if (role === 'user') {
        handleFetchNormalUser();
      } else if (role === 'admin') {
        handleFetchAdminUser();
      }
    }
  }, [role, handleFetchNormalUser, handleFetchAdminUser]);

  // INSTANT API CALL: Direct API call when role is detected (bypassing any delays)
  useEffect(() => {
    if (role === 'admin') {
      // Direct API call without waiting for any other conditions
      const fetchAdminStats = async () => {
        try {
          const params = {
            csp_date,
            nnp_date,
            nsp_date,
            fsp_date,
            tsp_date,
            nsc_date,
            csc_date,
            tea_date,
            tcs_date
          };
          
          if (csc_date === 'custom') {
            if (csc_start_date && csc_end_date) {
              params['csc_start_date'] = formatDate(csc_start_date);
              params['csc_end_date'] = formatDate(csc_end_date);
            }
          }
          if (nsc_date === 'custom') {
            if (nsc_start_date && nsc_end_date) {
              params['nsc_start_date'] = formatDate(nsc_start_date);
              params['nsc_end_date'] = formatDate(nsc_end_date);
            }
          }
          if (tcs_date === 'custom') {
            if (tcs_start_date && tcs_end_date) {
              params['tcs_start_date'] = formatDate(tcs_start_date);
              params['tcs_end_date'] = formatDate(tcs_end_date);
            }
          }
          if (tea_date === 'custom') {
            if (tea_start_date && tea_end_date) {
              params['tea_start_date'] = formatDate(tea_start_date);
              params['tea_end_date'] = formatDate(tea_end_date);
            }
          }

          const apiUrl = `/api/stats?role=admin&${new URLSearchParams(params)}`;
          
          const response = await fetch(apiUrl);
          const data = await response.json();
          
          if (data.status === 'success') {
            setAdminUserSlip(data.statistics);
          }
        } catch (error) {
          // Handle error silently
        }
      };
      
      // Execute immediately
      fetchAdminStats();
    } else if (role === 'user') {
      // Direct API call without waiting for any other conditions
      const fetchUserStats = async () => {
        try {
          const params = {
            nsc_date,
            csc_date,
          };
          
          if (csc_date === 'custom') {
            if (csc_start_date && csc_end_date) {
              params['csc_start_date'] = formatDate(csc_start_date);
              params['csc_end_date'] = formatDate(csc_end_date);
            }
          }
          if (nsc_date === 'custom') {
            if (nsc_start_date && nsc_end_date) {
              params['nsc_start_date'] = formatDate(nsc_start_date);
              params['nsc_end_date'] = formatDate(nsc_end_date);
            }
          }

          const apiUrl = `/api/stats?role=user&${new URLSearchParams(params)}`;
          
          const response = await fetch(apiUrl);
          const data = await response.json();
          
          if (data.status === 'success') {
            setNormalUserSlip(data.statistics);
          }
        } catch (error) {
          // Handle error silently
        }
      };
      
      // Execute immediately
      fetchUserStats();
    }
  }, [role, csp_date, nnp_date, nsp_date, fsp_date, tsp_date, nsc_date, csc_date, csc_end_date, csc_start_date, nsc_end_date, nsc_start_date, tcs_date, tcs_end_date, tcs_start_date, tea_date, tea_end_date, tea_start_date]);

    // INSTANT API TRIGGER: Listen for custom event to trigger immediate API call
  useEffect(() => {
    const handleApiFetchStats = (event) => {
      const { role: eventRole } = event.detail;
      
      if (eventRole === 'admin') {
        // Force immediate admin API call
        const fetchAdminStats = async () => {
          try {
            const params = {
              csp_date,
              nnp_date,
              nsp_date,
              fsp_date,
              tsp_date,
              nsc_date,
              csc_date,
              tea_date,
              tcs_date
            };
            
            if (csc_date === 'custom') {
              if (csc_start_date && csc_end_date) {
                params['csc_start_date'] = formatDate(csc_start_date);
                params['csc_end_date'] = formatDate(csc_end_date);
              }
            }
            if (nsc_date === 'custom') {
              if (nsc_start_date && nsc_end_date) {
                params['nsc_start_date'] = formatDate(nsc_start_date);
                params['nsc_end_date'] = formatDate(nsc_end_date);
              }
            }
            if (tcs_date === 'custom') {
              if (tcs_start_date && tcs_end_date) {
                params['tcs_start_date'] = formatDate(tcs_start_date);
                params['tcs_end_date'] = formatDate(tcs_end_date);
              }
            }
            if (tea_date === 'custom') {
              if (tea_start_date && tea_end_date) {
                params['tea_start_date'] = formatDate(tea_start_date);
                params['tea_end_date'] = formatDate(tea_end_date);
              }
            }

            const apiUrl = `/api/stats?role=admin&${new URLSearchParams(params)}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            if (data.status === 'success') {
              setAdminUserSlip(data.statistics);
            }
          } catch (error) {
            // Handle error silently
          }
        };
        
        fetchAdminStats();
      } else if (eventRole === 'user') {
        // Force immediate user API call
        const fetchUserStats = async () => {
          try {
            const params = {
              nsc_date,
              csc_date,
            };
            
            if (csc_date === 'custom') {
              if (csc_start_date && csc_end_date) {
                params['csc_start_date'] = formatDate(csc_start_date);
                params['csc_end_date'] = formatDate(csc_end_date);
              }
            }
            if (nsc_date === 'custom') {
              if (nsc_start_date && nsc_end_date) {
                params['nsc_start_date'] = formatDate(nsc_start_date);
                params['nsc_end_date'] = formatDate(nsc_end_date);
              }
            }

            const apiUrl = `/api/stats?role=user&${new URLSearchParams(params)}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            if (data.status === 'success') {
              setNormalUserSlip(data.statistics);
            }
          } catch (error) {
            // Handle error silently
          }
        };
        
        fetchUserStats();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('api:fetch-stats', handleApiFetchStats);
      
      return () => {
        window.removeEventListener('api:fetch-stats', handleApiFetchStats);
      };
    }
  }, [csp_date, nnp_date, nsp_date, fsp_date, tsp_date, nsc_date, csc_date, csc_end_date, csc_start_date, nsc_end_date, nsc_start_date, tcs_date, tcs_end_date, tcs_start_date, tea_date, tea_end_date, tea_start_date]);

  // EXTREMELY AGGRESSIVE: Show loading state ONLY when we have absolutely nothing
  // If we have ANY role or authentication, NEVER show loading - render immediately
  if (!role && !isAuthenticated && isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If we have a role and are authenticated, render immediately (even if data is still loading)
  if (role && isAuthenticated) {
    // Role and auth confirmed, rendering dashboard immediately
  }

  // FORCE RENDER: If we have a role, render immediately regardless of any other conditions
  if (role) {
    // Role exists, rendering immediately
  }

  return (
    <>
      <div className=" grid grid-cols-3 gap-7">
        {role === 'user' ? (
          <>
            <div className="">
              <div className="rounded-lg bg-[#DBE3FF] p-6 xl:p-8">
                <h3>Due</h3>
                <h4 className="mt-3 text-lg font-semibold">
                  {' '}
                  {normalUserSlip?.balance_due}
                </h4>
              </div>
            </div>
            <div className="">
              <div className="rounded-lg bg-[#DBE3FF] p-6 xl:p-8">
                <h3>Normal Slip Pending</h3>
                <h4 className="mt-3 text-lg font-semibold">
                  {' '}
                  {normalUserSlip?.normal_pending}
                </h4>
              </div>
            </div>

            <div className="">
              <div className="rounded-lg bg-[#DBE3FF] p-4 xl:p-5">
                <div className="grid grid-cols-12 gap-2">
                  <div
                    className={
                      nsc_date === 'custom' ? `col-span-6` : `col-span-8`
                    }
                  >
                    <h3>Normal Slip Complete</h3>
                  </div>
                  {nsc_date === 'custom' && (
                    <div className="col-span-3">
                      <UDateRangePicker
                        setStartDate={setNsc_start_date}
                        setEndDate={setNsc_end_date}
                        endDate={nsc_end_date}
                        startDate={nsc_start_date}
                      />
                    </div>
                  )}

                  <div
                    className={
                      nsc_date === 'custom' ? `col-span-3` : `col-span-4`
                    }
                  >
                    <FilterSelector setSelectData={setNsc_date} custom={true} />
                  </div>
                </div>
                <h4 className="mt-3 text-lg font-semibold">
                  {normalUserSlip?.normal_complete}
                </h4>
              </div>
            </div>

            <div className="">
              <div className="rounded-lg bg-[#DBE3FF] p-6 xl:p-8">
                <h3>Paid Amount</h3>
                <h4 className="mt-3 text-lg font-semibold">
                  {' '}
                  {normalUserSlip?.paid_amount}
                </h4>
              </div>
            </div>
            <div className="">
              <div className="rounded-lg bg-[#DBE3FF] p-6 xl:p-8">
                <h3>Choice Slip Pending</h3>
                <h4 className="mt-3 text-lg font-semibold">
                  {' '}
                  {normalUserSlip?.choice_pending}
                </h4>
              </div>
            </div>

            <div className="">
              <div className="rounded-lg bg-[#DBE3FF] p-4 xl:p-5">
                <div className="grid grid-cols-12 gap-2">
                  <div
                    className={
                      csc_date === 'custom' ? `col-span-6` : `col-span-8`
                    }
                  >
                    <h3>Choice Slip Complete</h3>
                  </div>
                  {csc_date === 'custom' && (
                    <div className="col-span-3">
                      <UDateRangePicker
                        setStartDate={setCsc_start_date}
                        setEndDate={setCsc_end_date}
                        endDate={csc_end_date}
                        startDate={csc_start_date}
                      />
                    </div>
                  )}

                  <div
                    className={
                      csc_date === 'custom' ? `col-span-3` : `col-span-4`
                    }
                  >
                    <FilterSelector setSelectData={setCsc_date} custom={true} />
                  </div>
                </div>
                <h4 className="mt-3 text-lg font-semibold">
                  {normalUserSlip?.choice_complete}
                </h4>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="">
              <div className="rounded-lg bg-[#DBE3FF] p-6 xl:p-8">
                <h3>Normal Slip Pending</h3>
                <h4 className="mt-3 text-lg font-semibold">
                  {' '}
                  {adminUserSlip?.normal_slip_pending}
                </h4>
              </div>
            </div>
            <div className="">
              <div className="rounded-lg bg-[#DBE3FF] p-6 xl:p-8">
                <h3>Choice Slip Pending</h3>
                <h4 className="mt-3 text-lg font-semibold">
                  {' '}
                  {adminUserSlip?.choice_slip_pending}
                </h4>
              </div>
            </div>
            <div className="">
              <div className="rounded-lg bg-[#DBE3FF] p-4 xl:p-5">
                <div className="grid grid-cols-12 gap-2">
                  <div
                    className={
                      nsc_date === 'custom' ? `col-span-6` : `col-span-8`
                    }
                  >
                    <h3>Normal Slip Complete</h3>
                  </div>
                  {nsc_date === 'custom' && (
                    <div className="col-span-3">
                      <UDateRangePicker
                        setStartDate={setNsc_start_date}
                        setEndDate={setNsc_end_date}
                        endDate={nsc_end_date}
                        startDate={nsc_start_date}
                      />
                    </div>
                  )}
                  <div
                    className={
                      nsc_date === 'custom' ? `col-span-3` : `col-span-4`
                    }
                  >
                    <FilterSelector setSelectData={setNsc_date} custom={true} />
                  </div>
                </div>

                <h4 className="mt-3 text-lg font-semibold">
                  {' '}
                  {adminUserSlip?.normal_slip_complete}
                </h4>
              </div>
            </div>

            <div className="">
              <div className="rounded-lg bg-[#DBE3FF] p-6 xl:p-8">
                <h3>Choice Slip Processing</h3>
                <h4 className="mt-3 text-lg font-semibold">
                  {' '}
                  {adminUserSlip?.choice_slip_processing}
                </h4>
              </div>
            </div>

            <div className="">
              <div className="rounded-lg bg-[#DBE3FF] p-6 xl:p-8">
                <h3>Choice Ready Payment</h3>
                <h4 className="mt-3 text-lg font-semibold">
                  {' '}
                  {adminUserSlip?.choice_ready_payment}
                </h4>
              </div>
            </div>

            <div className="">
              <div className="rounded-lg bg-[#DBE3FF] p-4 xl:p-5">
                <div className="grid grid-cols-12 gap-2">
                  <div
                    className={
                      csc_date === 'custom' ? `col-span-6` : `col-span-8`
                    }
                  >
                    <h3>Choice Slip Complete</h3>
                  </div>
                  {csc_date === 'custom' && (
                    <div className="col-span-3">
                      <UDateRangePicker
                        setStartDate={setCsc_start_date}
                        setEndDate={setCsc_end_date}
                        endDate={csc_end_date}
                        startDate={csc_start_date}
                      />
                    </div>
                  )}

                  <div
                    className={
                      csc_date === 'custom' ? `col-span-3` : `col-span-4`
                    }
                  >
                    <FilterSelector setSelectData={setCsc_date} custom={true} />
                  </div>
                </div>
                <h4 className="mt-3 text-lg font-semibold">
                  {adminUserSlip?.choice_slip_complete}
                </h4>
              </div>
            </div>
            <div className="">
              <div className="rounded-lg bg-[#DBE3FF] p-6 xl:p-8">
                <h3>Total Due </h3>
                <h4 className="mt-3 text-lg font-semibold">
                  {' '}
                  ৳ {adminUserSlip?.total_balance_due}
                </h4>
              </div>
            </div>

            <div className="">
              <div className="rounded-lg bg-[#DBE3FF] p-6 xl:p-8">
                <h3>Total User </h3>
                <h4 className="mt-3 text-lg font-semibold">
                  {adminUserSlip?.total_users}
                </h4>
              </div>
            </div>

            <div className="">
              <div className="rounded-lg bg-[#DBE3FF] p-6 xl:p-8">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-8">
                    <h3>Total Payment Received</h3>
                  </div>
                  <div className="col-span-4">{/* <FilterSelector /> */}</div>
                </div>

                <h4 className="mt-3 text-lg font-semibold">
                  ৳ {adminUserSlip?.total_payment_received}
                </h4>
              </div>
            </div>

            <div className="">
              <div className="rounded-lg bg-[#DBE3FF] p-4 xl:p-5">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-8">
                    <h3>Total Slip Payment </h3>
                  </div>
                  <div className="col-span-4">
                    <FilterSelector setSelectData={setTsp_date} />
                  </div>
                </div>
                <h4 className="mt-3 text-lg font-semibold">
                  {adminUserSlip?.total_slip_payment}
                </h4>
              </div>
            </div>
            <div className="">
              <div className="rounded-lg bg-[#DBE3FF] p-4 xl:p-5">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-8">
                    <h3>False Slip Payment </h3>
                  </div>
                  <div className="col-span-4">
                    <FilterSelector setSelectData={setFsp_date} />
                  </div>
                </div>
                <h4 className="mt-3 text-lg font-semibold">
                  {adminUserSlip?.false_slip_payment}
                </h4>
              </div>
            </div>
            <div className="">
              <div className="rounded-lg bg-[#DBE3FF] p-4 xl:p-5">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-8">
                    <h3>Normal Slip Payment </h3>
                  </div>
                  <div className="col-span-4">
                    <FilterSelector setSelectData={setNsp_date} />
                  </div>
                </div>
                <h4 className="mt-3 text-lg font-semibold">
                  {adminUserSlip?.normal_slip_payment}
                </h4>
              </div>
            </div>

            <div className="">
              <div className="rounded-lg bg-[#DBE3FF] p-4 xl:p-5">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-8">
                    <h3>Normal Night Payment</h3>
                  </div>
                  <div className="col-span-4">
                    <FilterSelector setSelectData={setNnp_date} />
                  </div>
                </div>
                <h4 className="mt-3 text-lg font-semibold">
                  {adminUserSlip?.normal_night_payment}
                </h4>
              </div>
            </div>

            <div className="">
              <div className="rounded-lg bg-[#DBE3FF] p-4 xl:p-5">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-8">
                    <h3>Choice Slip Payment</h3>
                  </div>
                  <div className="col-span-4">
                    <FilterSelector setSelectData={setCsp_date} />
                  </div>
                </div>
                <h4 className="mt-3 text-lg font-semibold">
                  {adminUserSlip?.choice_slip_payment}
                </h4>
              </div>
            </div>
            <div className="">
              <div className="rounded-lg bg-[#DBE3FF] p-6 xl:p-8">
                <h3>Available Doller</h3>
                <h4 className="mt-3 text-lg font-semibold">
                  $ {adminUserSlip?.available_dollar}
                </h4>
              </div>
            </div>

            <div className="">
              <div className="rounded-lg bg-[#DBE3FF] p-4 xl:p-5">
                <div className="grid grid-cols-12 gap-2">
                  <div     className={
                      tea_date === 'custom' ? `col-span-6` : `col-span-8`
                    }>
                    <h3> Total Earnings Amount</h3>
                  </div>
                  {tea_date === 'custom' && (
                    <div className="col-span-3">
                      <UDateRangePicker
                        setStartDate={setTea_start_date}
                        setEndDate={setTea_end_date}
                        endDate={tea_end_date}
                        startDate={tea_start_date}
                      />
                    </div>
                  )}
                  <div     className={
                      tea_date === 'custom' ? `col-span-3` : `col-span-4`
                    }
                    >
                    <FilterSelector setSelectData={setTea_date} />
                  </div>
                </div>
                <h4 className="mt-3 text-lg font-semibold">
                  ৳ {adminUserSlip?.total_earnings_amount}
                </h4>
              </div>
            </div>

            <div className="">
              <div className="rounded-lg bg-[#DBE3FF] p-4 xl:p-5">
                <div className="grid grid-cols-12 gap-2">
                  <div     className={
                      tcs_date === 'custom' ? `col-span-6` : `col-span-8`
                    }>
                  <h3>Total Choice Success</h3>
                  </div>
                  {tcs_date === 'custom' && (
                    <div className="col-span-3">
                      <UDateRangePicker
                        setStartDate={setTcs_start_date}
                        setEndDate={setTcs_end_date}
                        endDate={tcs_end_date}
                        startDate={tcs_start_date}   
                      />
                    </div>
                  )}
                  <div     className={
                      tcs_date === 'custom' ? `col-span-3` : `col-span-4`
                    }>
                    <FilterSelector setSelectData={setTcs_date} />
                  </div>
                </div>
                <h4 className="mt-3 text-lg font-semibold">
                  {adminUserSlip?.total_choice_success}
                </h4>
              </div>
            </div>
            <div className="">
              <div className="rounded-lg bg-[#DBE3FF] p-6 xl:p-8">
          
                <h3>Total Payment Received</h3>
                <h4 className="mt-3 text-lg font-semibold">
                ৳ {adminUserSlip?.total_payment_received}
                </h4>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

// export default HomePage;
export default withAuth(HomePage, {
  isProtectedRoute: true,
  show: true,
  requireAdmin: false, // Only admins can access this page
});
