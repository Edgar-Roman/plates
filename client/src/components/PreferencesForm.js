import React, { useState } from 'react';
import { Box, Typography, FormGroup, FormControlLabel, Checkbox, Slider, RadioGroup, Radio, FormControl, FormLabel, MenuItem, Select, InputLabel, Button } from '@mui/material';

function PreferencesForm({ onSubmit, username }) {  // Accept onSubmit as a prop
  const [cuisines, setCuisines] = useState([]);
  const [distance, setDistance] = useState(5);
  const [price, setPrice] = useState('');
  const [groupSize, setGroupSize] = useState('');

  function addPreferences() {
    const requestOptions = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
        "username": username,
        "cuisines": cuisines,
        "distance": distance,
        "price": price,
        "groupSize": groupSize
    })
    };

    fetch('http://127.0.0.1:5000/preferences', requestOptions).then((res) => {

    if (res.status === 200) {
      onSubmit();
    } else {
      res.json().then((json) => {
        alert(json["message"])
      })
    }
    }) 
  }


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

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        const preferencesData = {
          cuisines,
          distance,
          price,
          groupSize,
          location,
        };

        // Use fetch to send the data to your Flask backend
        fetch('http://127.0.0.1:5000/preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(preferencesData),
        })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          onSubmit(); // You can still call onSubmit here if needed
        })
        .catch((error) => {
          console.error('Error:', error);
        });

      }, (error) => {
        console.error("Error obtaining location: ", error);
        // Handle the error case or set default location values as needed
      });
    } else {
      console.log("Geolocation is notsupported by this browser.");
      // Handle the unsupported case
    }
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
