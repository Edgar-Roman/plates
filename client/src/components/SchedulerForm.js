import React, { useState } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Button, TextField, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function SchedulerForm({ onSubmit, username }) {
  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());

  const addSchedule = () => {
    const newSchedule = { date: selectedDate, startTime, endTime };
    setSchedules([...schedules, newSchedule]);
    // Reset form fields
    setSelectedDate(dayjs());
    setStartTime(dayjs());
    setEndTime(dayjs());
  };

  const removeSchedule = (index) => {
    const newSchedules = schedules.filter((_, i) => i !== index);
    setSchedules(newSchedules);
  };

  const handleSubmit = () => {
    // Handle the final submission of all schedules
    onSubmit(schedules);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%', maxWidth: '480px' }}> {/* Increased container width */}
        {/* Form to add a new schedule */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}> {/* Added flexWrap and justifyContent for better responsiveness */}
        <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={setSelectedDate}
            renderInput={(params) => <TextField {...params} fullWidth />} // Ensure proper JSX syntax
            />

            <TimePicker
            label="Start Time"
            value={startTime}
            onChange={setStartTime}
            renderInput={(params) => <TextField {...params} fullWidth />} // Repeat the correct structure for TimePicker
            />

            <TimePicker
            label="End Time"
            value={endTime}
            onChange={setEndTime}
            renderInput={(params) => <TextField {...params} fullWidth />} // And for the second TimePicker
            />
          <Button variant="contained" onClick={addSchedule} sx={{ mt: 1, width: '100%' }}>Add</Button> {/* Button styling for better layout */}
        </Box>

        {/* List of added schedules */}
        <List dense sx={{ width: '100%' }}> {/* Adjusted list width */}
          {schedules.map((schedule, index) => (
            <ListItem key={index} sx={{ pl: 2, pr: 2 }}> {/* Added padding for ListItem */}
              <ListItemText
                primary={`Date: ${schedule.date.format('YYYY-MM-DD')}, Time: ${schedule.startTime.format('HH:mm')} - ${schedule.endTime.format('HH:mm')}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => removeSchedule(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 1, width: '100%' }}>Submit All</Button> {/* Button styling for better layout */}
      </Box>
    </LocalizationProvider>
  );
}

export default SchedulerForm;
