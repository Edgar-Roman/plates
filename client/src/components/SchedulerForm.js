import React, { useState } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Button, TextField } from '@mui/material';

function SchedulerForm({ onSubmit, username, setPrefComplete}) {
  const [selectedDate, setSelectedDate] = useState(dayjs());


  function addSchedule() {
    const requestOptions = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
        "username": username,
        "date": selectedDate,
    })
    };

    fetch('http://127.0.0.1:5000/date', requestOptions).then((res) => {

    if (res.status === 200) {
      // successfuly finished preferences for a user so edit fetch to do that
      const confirmOptions = {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "username": username,
          "change": "true" })};
      fetch('http://127.0.0.1:5000/completePref', confirmOptions).then((res) => {
        if (res.status !== 200) {
          alert("could not connect to server");
          return
        } else {
          setPrefComplete(true)
        }
      })

      onSubmit(selectedDate);
    } else {
      res.json().then((json) => {
        alert(json["message"])
      })
    }
    }) 
  }

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
  };

  const handleSubmit = () => {
    addSchedule()
    //onSubmit(selectedDate); // Pass the selected date/time to the parent component on submit
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
