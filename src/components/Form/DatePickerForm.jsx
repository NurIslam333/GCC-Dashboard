import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';

const DatePickerForm = ({value, setFieldValue , className , name}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        className={className}
        // label="Basic date picker"
        format="DD/MM/YYYY" // Specify the desired format
        value={value}
        onChange={(date) => setFieldValue(name, date)}
        renderInput={(props) => (
          <TextField {...props} variant="outlined" placeholder="dd/mm/yyyy" />
        )}
        dateRangeDelimiter="/"
      />
    </LocalizationProvider>
  );
};

export default DatePickerForm;
