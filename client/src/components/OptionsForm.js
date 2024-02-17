import React, { useState } from 'react';
import { Card, CardContent, Typography, CardActions, Button, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

function OptionsForm({ onSubmit, selectedTime }) {
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

  const handleDeclineOption = (optionName) => {
    setDeclinedOptions(prev => [...prev, optionName]);
  };

  // Assuming restaurantOptions is defined within this component
  const restaurantOptions = [
    { id: 0, name: 'Italian Bistro', address: '123 Pasta Lane' },
    { id: 1, name: 'Sushi Place', address: '456 Sashimi Blvd' },
    { id: 2, name: 'Taco Stand', address: '789 Taco Terrace' },
  ];

  const filteredOptions = restaurantOptions.filter(option => !declinedOptions.includes(option.name));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
      {filteredOptions.map((option, index) => (
        <Card key={index} sx={{ minWidth: 275, maxWidth: 400, mb: 2, backgroundColor: acceptedOptions.includes(option.name) ? 'yellow' : 'white' }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {option.name}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {option.address}
            </Typography>
            <Typography variant="body2">
              Selected Time: {selectedTime.format('dddd, MMMM D, YYYY h:mm A')}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => handleAcceptOption(option)} startIcon={<CheckCircleIcon style={{ color: 'green' }} />}>
              Accept
            </Button>
            <Button size="small" onClick={() => handleDeclineOption(option.name)} startIcon={<CancelIcon style={{ color: 'red' }} />}>
              Decline
            </Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
}

export default OptionsForm;
