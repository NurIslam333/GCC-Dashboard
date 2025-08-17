import React from 'react';

const FilterSelector = ({ setSelectData }) => {
  return (
    <select name="" className="w-full rounded-lg border py-2 px-4"   onChange={(e) => setSelectData(e.target.value)}>
      <option value="today">Today</option>
      <option value="yesterday">Yesterday</option>
      <option value="month">This Month</option>
      <option value="custom">Custom</option>
    </select>
  );
};

export default FilterSelector;
