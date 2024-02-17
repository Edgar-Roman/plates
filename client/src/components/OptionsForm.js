import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, Box } from '@mui/material';

function OptionsForm({ selectedTime }) {
  // Example static restaurant options
  const restaurantOptions = [
    { name: 'Italian Bistro', address: '123 Pasta Lane' },
    { name: 'Sushi Place', address: '456 Sashimi Blvd' },
    { name: 'Taco Stand', address: '789 Taco Terrace' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
      {restaurantOptions.map((option, index) => (
        <Card key={index} sx={{ minWidth: 275, maxWidth: 400, mb: 2 }}>
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
            <Button size="small">Choose This Option</Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
}

export default OptionsForm;
