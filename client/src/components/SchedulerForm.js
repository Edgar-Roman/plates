import React, { useState } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Button, TextField } from '@mui/material';

function SchedulerForm({ onSubmit }) {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
  };

  const handleSubmit = () => {
    onSubmit(selectedDate); // Pass the selected date/time to the parent component on submit
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <DateTimePicker
          label="Select Date and Time"
          value={selectedDate}
          onChange={handleDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </LocalizationProvider>
  );
}

export default SchedulerForm;
