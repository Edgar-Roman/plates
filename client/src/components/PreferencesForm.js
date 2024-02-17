import React, { useState } from 'react';
import { Box, Typography, FormGroup, FormControlLabel, Checkbox, Slider, RadioGroup, Radio, FormControl, FormLabel, MenuItem, Select, InputLabel, Button } from '@mui/material';

function PreferencesForm({ onSubmit }) {  // Accept onSubmit as a prop
  const [cuisines, setCuisines] = useState([]);
  const [distance, setDistance] = useState(5);
  const [price, setPrice] = useState('');
  const [groupSize, setGroupSize] = useState('');

  const handleCuisineChange = (event) => {
    const { name, checked } = event.target;
    setCuisines(prev => checked ? [...prev, name] : prev.filter(cuisine => cuisine !== name));
  };

  const handleDistanceChange = (event, newValue) => {
    setDistance(newValue);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleGroupSizeChange = (event) => {
    setGroupSize(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();  // Call onSubmit prop function when the form is submitted
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6">Select Your Preferences</Typography>

      {/* Cuisine Preferences */}
      <FormGroup>
        <Typography variant="subtitle1">Cuisine Preferences</Typography>
        {['Italian', 'Chinese', 'Japanese', 'Indian'].map((cuisine) => (
          <FormControlLabel
            key={cuisine}
            control={<Checkbox name={cuisine} onChange={handleCuisineChange} />}
            label={cuisine}
          />
        ))}
      </FormGroup>

      {/* Distance Willing to Travel */}
      <Typography variant="subtitle1">Distance Willing to Travel (miles)</Typography>
      <Slider value={distance} onChange={handleDistanceChange} step={1} marks min={1} max={20} valueLabelDisplay="auto" />

      {/* Price Range */}
      <FormControl>
        <FormLabel>Price Range</FormLabel>
        <RadioGroup row value={price} onChange={handlePriceChange}>
          {['$', '$$', '$$$', '$$$$'].map((range) => (
            <FormControlLabel key={range} value={range} control={<Radio />} label={range} />
          ))}
        </RadioGroup>
      </FormControl>

      {/* Group Size Preference */}
      <FormControl fullWidth>
        <InputLabel>Preferred Group Size</InputLabel>
        <Select value={groupSize} label="Preferred Group Size" onChange={handleGroupSizeChange}>
          {['1-2', '3-4', '5-6', '7+'].map((size) => (
            <MenuItem key={size} value={size}>{size}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary">Submit Preferences</Button>
    </Box>
  );
}

export default PreferencesForm;
