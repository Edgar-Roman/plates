import React, { useState } from 'react';
import { Card, CardContent, Typography, CardActions, Button, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

function OptionsForm({ onSubmit, selectedTime, username, goToSchedule }) {
  const [acceptedOptions, setAcceptedOptions] = useState([]);
  const [declinedOptions, setDeclinedOptions] = useState([]);

  const handleAcceptOption = (option) => {
    setAcceptedOptions(prev => [...prev, option.name]);

    const requestOptions = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
        "username": username,
        "id": option["id"]
    })
    };

    fetch('http://127.0.0.1:5000/locationChoose', requestOptions).then((res) => {

      if (res.status === 200) {
      } else {
        res.json().then((json) => {
          alert(json["message"])
        })
      }
      
    })

  };

  const handleDeclineOption = (option) => {
    setDeclinedOptions(prev => [...prev, option.name]);

    const requestOptions = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
        "username": username,
        "id": option["id"]
    })
    };

    fetch('http://127.0.0.1:5000/locationRemove', requestOptions).then((res) => {

      if (res.status === 200) {
      } else {
        res.json().then((json) => {
          alert(json["message"])
        })
      }
      
    })
  };

  // Assuming restaurantOptions is defined within this component
  const restaurantOptions = [
    { id: 0, name: 'Italian Bistro', address: '123 Pasta Lane', imageUrl: 'https://www.mashed.com/img/gallery/italian-chain-restaurants-ranked-from-worst-to-best/l-intro-1618597744.jpg' },
    { id: 1, name: 'Sushi Place', address: '456 Sashimi Blvd', imageUrl: 'https://nypost.com/wp-content/uploads/sites/2/2015/10/sushi-main.jpg?quality=75&strip=all' },
    { id: 2, name: 'Taco Stand', address: '789 Taco Terrace', imageUrl: 'https://ewscripps.brightspotcdn.com/dims4/default/326f992/2147483647/strip/true/crop/1235x694+1+517/resize/1280x720!/quality/90/?url=http%3A%2F%2Fewscripps-brightspot.s3.amazonaws.com%2F97%2Ff0%2F27627e46429fa3797788a34e48a6%2Fthe-taco-stand-la-jolla-tacos.jpeg' },
  ];

  const filteredOptions = restaurantOptions.filter(option => !declinedOptions.includes(option.name));

  
return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>

      {filteredOptions.length > 0 ? (
        filteredOptions.map((option, index) => (
          <Card key={index} sx={{
            minWidth: 275,
            maxWidth: 400,
            mb: 2,
            backgroundColor: acceptedOptions.includes(option.name) ? 'yellow' : 'white',
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${option.imageUrl})`, // Add your background image with opacity
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            border: "1.5px solid #ffffff", borderColor: acceptedOptions.includes(option.name) ? 'rgba(116, 237, 95, 0.8)' : 'none' 
          }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {option.name}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {option.address}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleAcceptOption(option)} startIcon={<CheckCircleIcon style={{ color: 'green' }} />}>
                Accept
              </Button>
              <Button size="small" onClick={() => handleDeclineOption(option)} startIcon={<CancelIcon style={{ color: 'red' }} />}>
                Decline
              </Button>
            </CardActions>
          </Card>
        ))
      ) : (
        <Box>
          
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          No Upcoming Plates!
        </Typography>
        <br></br>
        <Button onClick={goToSchedule} variant="contained" color="primary">Edit Schedule</Button>
        </Box>
      )}
    </Box>
  );
}

export default OptionsForm;