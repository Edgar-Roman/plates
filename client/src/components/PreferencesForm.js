import React, { useState } from 'react';
import { Box, Typography, FormGroup, FormControlLabel, Checkbox, Slider, RadioGroup, Radio, FormControl, FormLabel, ToggleButton, ToggleButtonGroup, MenuItem, Select, InputLabel, Button } from '@mui/material';


function PreferencesForm({ onSubmit, username }) {  // Accept onSubmit as a prop
    const [selectedCuisines, setSelectedCuisines] = useState([]);
    const [distance, setDistance] = useState(5);
    const [price, setPrice] = useState('');
    const [groupSize, setGroupSize] = useState('');
  
    // List of cuisines
    const cuisines = [
      "American", "Chinese", "Cuban", "Greek", "Indian", "Italian", "Japanese", "Korean", "Mexican", "Thai", "Vietnamese",
    ];
  
    const handleCuisineChange = (_, newCuisines) => {
        setSelectedCuisines(newCuisines);
    };

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


//   const handleCuisineChange = (event) => {
//     const { name, checked } = event.target;
//     setCuisines(prev => checked ? [...prev, name] : prev.filter(cuisine => cuisine !== name));
//   };

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
  
    // Immediately navigate to the next step, don't wait for submission to complete
    onSubmit(); // Assuming `onSubmit` navigates the user to the next step
  
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
  
        // Asynchronously send the data to the backend
        fetch('http://127.0.0.1:5000/preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(preferencesData),
        })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          // Handle success (optional, since we've already navigated away)
        })
        .catch((error) => {
          console.error('Error:', error);
          // Handle error (optional, might log this error or send it to an error tracking service)
        });
  
      }, (error) => {
        console.error("Error obtaining location: ", error);
        // Optionally handle the error (e.g., log it or notify the user in some non-intrusive way)
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
      // Optionally handle the unsupported case
    }
  };
  

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6">Select Your Preferences</Typography>

      {/* Updated Cuisine Preferences using ToggleButtonGroup */}
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>Cuisine Preferences</Typography>
        <ToggleButtonGroup
        value={selectedCuisines}
        onChange={handleCuisineChange}
        aria-label="cuisine preferences"
        orientation="vertical"
        fullWidth
        sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
            gap: 1,
            '& .MuiToggleButton-root': { // Default styles for ToggleButton
            borderColor: 'primary.main', // Use the primary color for border
            },
            '& .MuiToggleButton-root.Mui-selected': { // Styles for selected ToggleButton
            color: 'primary.contrastText', // Text color for selected state
            backgroundColor: 'primary.main', // Background color for selected state
            '&:hover': {
                backgroundColor: 'primary.dark', // Darken the button slightly on hover
            },
            },
        }}
        >
        {cuisines.map((cuisine) => (
            <ToggleButton key={cuisine} value={cuisine} aria-label={cuisine}>
            {cuisine}
            </ToggleButton>
        ))}
        </ToggleButtonGroup>


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
      <Button type="submit" variant="contained" color="primary">Submit Preferences</Button>
    </Box>
  );
}

export default PreferencesForm;