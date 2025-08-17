import React from 'react';

const MedicalList = ({data ,handlePriceUpdate}) => {
  return (
    <tr
      key={data.serial}
      className="mb-3 items-center rounded-lg bg-white uppercase shadow-card last:mb-0 hover:shadow-large dark:bg-light-dark"
    >
      <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
        {data?.serial}
      </td>
      <td className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
        <h4 className="font-medium text-orange-400">{data?.name}</h4>
      </td>
      <td className="w-32 px-2 py-2 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8">
        <input
          type="text"
          key={Math.random()}
          defaultValue={data?.ksa_price}
          id="large-input"
          style={{ width: '100px' }}
          className="sm:text-md block rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="Enter Medical Price"
          onKeyDown={(event) => handlePriceUpdate(event, data?.serial, 'ksa')}
        />
      </td>
      <td
        key={data?.serial}
        className="w-32 px-2 py-2 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8"
      >
        <input
          type="text"
          key={Math.random()+ data.serial}
          defaultValue={data?.kuet_price}
          id="large-input"
          style={{ width: '100px' }}
          className="sm:text-md block rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="Enter Medical Price"
          onKeyDown={(event) => handlePriceUpdate(event, data?.serial, 'kuet')}
        />
      </td>
    </tr>
  );
};

export default MedicalList;
