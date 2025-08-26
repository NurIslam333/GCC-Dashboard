/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState , useCallback, useEffect} from 'react';
import { NextSeo } from 'next-seo';
import Scrollbar from '@/components/ui/scrollbar';
import Link from 'next/link';
import axios from 'axios';
import { headers } from '@/utls/auth';
import withAuth from '@/hook/PrivateRoute';
import moment from 'moment';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import Pagination from '@/components/gcc-component/Pagination';

const choiceSlipProcessing= () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [normalSlip, setNormalSlip] = useState([]);
  
  // New state for selection
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const handleFetchNormalUser = useCallback(async () => {
    try {
      const values = {
        page: currentPage,
        perPage: limit,
        status: "processing",
        search: search,
      };
      const response = await axios.get(
        `${process.env.API_URL}/admin/choice-slips`,
        {
          headers: headers,
          params: values,
        }
      );
      if (response.data.status === 'success') {
        setNormalSlip(response.data.slips.data);
        setTotalPages(response.data.slips.last_page);
      }
    } catch (err) {}
  }, [currentPage,search, limit]);
  
  // Handle individual item selection
  const handleItemSelect = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Handle select all toggle
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(normalSlip.map(item => item.id));
    }
    setSelectAll(!selectAll);
  };

  // Update selectAll state when individual items are selected
  useEffect(() => {
    if (normalSlip.length > 0) {
      setSelectAll(selectedItems.length === normalSlip.length);
    }
  }, [selectedItems, normalSlip]);

  // Export selected items
  const handleExportSelected = async () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item to export');
      return;
    }
  
    setIsExporting(true);
    
    try {
      const response = await axios.post(
        `${process.env.API_URL}/admin/export/slips/selected`,
        {
          ids: selectedItems,
          type: 'choice' // Include slip type
        },
        {
          headers: {
            ...headers,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          responseType: 'blob'
        }
      );
  
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `choice-slips-processing-selected-${moment().format('YYYY-MM-DD-HH-mm-ss')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
  
      toast.success('Export completed successfully!');
      
      // Clear selection after successful export
      setSelectedItems([]);
      setSelectAll(false);
      
    } catch (error) {
      console.error('Export error:', error);
      
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
      } else if (error.response?.status === 422) {
        toast.error('Invalid data selected. Please try again.');
      } else if (error.response?.status === 404) {
        toast.error('No valid slips found for export.');
      } else {
        toast.error('Error exporting data. Please try again.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  // Export single item
  const handleExportSingle = async (itemId) => {
    setIsExporting(true);
    try {
      const response = await axios.post(
        `${process.env.API_URL}/admin/export/slips/single`,
        {
          id: itemId,
          type: 'choice' // Include slip type
        },
        {
          headers: {
            ...headers,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `choice-slip-processing-${itemId}-${moment().format('YYYY-MM-DD-HH-mm-ss')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Export completed successfully!');
    } catch (error) {
      console.error('Export error:', error);
      
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
      } else if (error.response?.status === 404) {
        toast.error('Slip not found.');
      } else {
        toast.error('Error exporting data. Please try again.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  // Export all data
  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      const response = await axios.get(
        `${process.env.API_URL}/admin/export/slips/all`,
        {
          headers: headers,
          params: { 
            type: 'choice',
            status: 'processing' // Add status filter for processing
          },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `choice-slips-processing-all-${moment().format('YYYY-MM-DD-HH-mm-ss')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Export completed successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Error exporting data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  const slipDelete = async (id) => {
    try {
      Swal.fire({
        iconHtml: '<img src="https://i.ibb.co/HXqMCgx/delete.png/images/delete.png">',
        customClass: {
          icon: "no-border",
          border: "0",
        },
        text: "Are you sure you want to delete this Slip?",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#894BCA",
        cancelButtonColor: "#d33",
        confirmButtonText: "yes, delete",
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          const response = await axios.post(
            `${process.env.API_URL}/admin/delete-slip/${id}`,
            {},
            {
              headers: headers,
            }
          );
    
          if (response.data.status) {
            setNormalSlip((pd) => {
              const filter = normalSlip.filter((prod) => {
                return prod.id !== id;
              });
              return [...filter];
            });
            // Remove from selected items if it was selected
            setSelectedItems(prev => prev.filter(itemId => itemId !== id));
            toast.success('Slip deleted successfully!');
          }
       
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Error deleting blog. Please try again.');
    } finally {
    }
  };

  useEffect(() => {
    handleFetchNormalUser();
  }, [handleFetchNormalUser]);
  
  return (
    <>
      <NextSeo
        title="GCC Choice Slip Processing"
        description="MaxAuto"
      />
      <div className="">
        <div className="rounded-tl-lg rounded-tr-lg bg-white px-4 pt-6 dark:bg-light-dark md:px-8 md:pt-8">
          <div className="flex flex-col items-center justify-between border-b border-dashed border-gray-200 pb-5 dark:border-gray-700 md:flex-row">
            <h2 className="mb-3 shrink-0 text-lg font-medium uppercase text-black dark:text-white sm:text-xl md:mb-0 md:text-2xl">
              Choice Slip Processing
            </h2>
            
            {/* Export buttons */}
            <div className="flex gap-2 mb-3 md:mb-0">
              {/* Export Selected Button */}
              <button
                onClick={handleExportSelected}
                disabled={selectedItems.length === 0 || isExporting}
                className={`flex items-center gap-2 rounded px-3 py-2 text-white transition-colors ${
                  selectedItems.length === 0 || isExporting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12"
                  />
                </svg>
                {isExporting ? 'Exporting...' : `Export Selected (${selectedItems.length})`}
              </button>

              {/* Export All Button */}
              <button
                onClick={handleExportAll}
                disabled={isExporting}
                className={`flex items-center gap-2 rounded px-3 py-2 text-white transition-colors ${
                  isExporting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12"
                  />
                </svg>
                {isExporting ? 'Exporting...' : 'Export All'}
              </button>
            </div>
            
            <input
              type="text"
              // defaultValue={data?.price}
              id="large-input"
              // style={{ width: '100px' }}
              className="sm:text-md block rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Search..."
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="-mx-0.5">
          <Scrollbar style={{ width: '100%' }} autoHide="never">
            <div className="px-0.5">
              <table className="transaction-table w-full border-separate border-0">
                <thead className="text-sm text-gray-500 dark:text-gray-300">
                  <tr>
                    {/* Select All Checkbox */}
                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                      />
                    </th>
                    
                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      SL No
                    </th>

                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Name
                    </th>

                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Passport No, Travel County, City
                    </th>

                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Choice Center
                    </th>

                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Pay Now
                    </th>

                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Submit Date, Time
                    </th>

                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      User Name
                    </th>
                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Reference
                    </th>
                    <th className="group bg-white px-2 py-5 font-semibold text-green-600 first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm">
                  {/* item */}
                 
                  {normalSlip.length > 0 &&
                              normalSlip.map((item, i) => {
                                return (
                                  <tr key={i} className="mb-3 items-center rounded-lg bg-white uppercase shadow-card last:mb-0 hover:shadow-large dark:bg-light-dark">
                                  {/* Individual Checkbox */}
                                  <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                    <input
                                      type="checkbox"
                                      checked={selectedItems.includes(item.id)}
                                      onChange={() => handleItemSelect(item.id)}
                                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                                    />
                                  </td>
                                  
                                  <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">{i+1 + currentPage * 25 - 25}</td>
                                  <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">{item.first_name} {item.last_name}</td>
                                  <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">  {item?.passport} 
                                    <br />
                                    {item?.tcountry}
                                    <br />
                                    {item?.city
                                    }</td>
                                  <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                  {item?.medical_list?.map((item, i, array) => (
                                      <React.Fragment key={i}>
                                        <p>{item}</p>
                                        {i < array.length - 1 && ','}
                                      </React.Fragment>
                                    ))}
                    
                    </td>
                                  <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                  {
                            item.pay_url !==null &&
                            <button    onClick={() => {
                              window.open(item.pay_url, '_blank');
                            }}  className="block w-[80px] rounded-sm bg-orange-400 p-2 text-center text-white">
                            Pay Now
                          </button>

                           }
                                  </td>
                                  <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">     {   moment(item?.created_at).format('DD/MM/YYYY')}
                <br/>
                {moment(item?.created_at).format('hh:mm A')}</td>
                                  <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">  {item.user_name} </td>
                                  <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">{item?.reference}</td>
                                  <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
                                    <div className="flex gap-2">
                                      {/* Export Single Button */}
                                      <button
                                        onClick={() => handleExportSingle(item.id)}
                                        disabled={isExporting}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs disabled:bg-gray-400 transition-colors"
                                      >
                                        Export
                                      </button>
                                      
                                      {/* Delete Button */}
                                      <button 
                                        onClick={()=>slipDelete(item.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </td>
                                  
                                </tr>
                              
                                  
                                );
                              })}

               
                </tbody>
              </table>
              <div className=" flex  justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  fetchData={setCurrentPage}
                />
              </div>
            </div>
          </Scrollbar>
        </div>
      </div>
    </>
  );
};




export default withAuth(choiceSlipProcessing, {
  isProtectedRoute: true,
  show: false,
  requireAdmin: true,
});