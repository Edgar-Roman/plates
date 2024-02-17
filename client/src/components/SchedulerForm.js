import React, { useState } from 'react';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Box, Button, TextField } from '@mui/material';




function SchedulerForm() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
  };

  const handleSubmit = () => {
    // Logic to handle submission, e.g., store the selected date/time or move to the next step
    console.log('Selected Date and Time:', selectedDate);
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
