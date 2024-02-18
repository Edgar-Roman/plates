import React, { useState } from 'react';
import { Card, CardContent, Typography, CardActions, Button, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

function OptionsForm({ onSubmit, selectedTime, username, goToSchedule }) {
  const [acceptedOptions, setAcceptedOptions] = useState([]);
  const [declinedOptions, setDeclinedOptions] = useState([]);

  const [opt1, setOpt1] = useState(0);
  const [opt2, setOpt2] = useState(0);
  const [opt3, setOpt3] = useState(0);
  let choicesTwo = [opt1, opt2, opt3]
  let choicesOne = [setOpt1, setOpt2, setOpt3]

  const handleAcceptOption = (option, i) => {

    console.log(restaurantOptions[i])

    //restaurantOptions[i]["count"] += 1;

    choicesOne[i](1);

    console.log(restaurantOptions[i])

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

  const handleDeclineOption = (option, i) => {

    //restaurantOptions[i]["count"] -= 1;

    choicesOne[i](0);

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
  // const restaurantOptions = [
  //   { id: 0, name: 'Italian Bistro', 
  //             address: '123 Pasta Lane', 
  //             imageUrl: 'https://www.mashed.com/img/gallery/italian-chain-restaurants-ranked-from-worst-to-best/l-intro-1618597744.jpg',
  //             time: '',
  //             count: 'sd'},
  //   { id: 1, name: 
  //           'Sushi Place', 
  //           address: '456 Sashimi Blvd', 
  //           imageUrl: 'https://nypost.com/wp-content/uploads/sites/2/2015/10/sushi-main.jpg?quality=75&strip=all',
  //           time: '',
  //           count: 'sd'},
  //   { id: 2, name: 
  //           'Taco Stand',
  //           address: '789 Taco Terrace', 
  //           imageUrl: 'https://ewscripps.brightspotcdn.com/dims4/default/326f992/2147483647/strip/true/crop/1235x694+1+517/resize/1280x720!/quality/90/?url=http%3A%2F%2Fewscripps-brightspot.s3.amazonaws.com%2F97%2Ff0%2F27627e46429fa3797788a34e48a6%2Fthe-taco-stand-la-jolla-tacos.jpeg',
  //           time: '',
  //           count: 'sd' },
  // ];

  const restaurantOptions = [
    { id: 0, name: 'Nobu Restaurant Palo Alto', 
              address: '180 Hamilton Ave, Palo Alto, CA 94301', 
              imageUrl: 'https://s3-media0.fl.yelpcdn.com/bphoto/vuHew7o7g9597v-bJKB1gQ/o.jpg',
              time: 'Monday, Feb 19th 5:00-5:30PM',
              count: 1},
    { id: 1, name: 
            'Reposado', 
            address: '236 Hamilton Ave, Palo Alto, CA 94301', 
            imageUrl: 'https://s3-media0.fl.yelpcdn.com/bphoto/M7j8qDf3v_DrN8zysxiyKw/o.jpg',
            time: 'Monday, Feb 19th 5:00-5:30PM',
            count: 5},
    { id: 2, name: 
            'TAVERNA',
            address: '800 Emerson St, Palo Alto, CA 94301', 
            imageUrl: 'https://s3-media0.fl.yelpcdn.com/bphoto/Rp2QbdyHJdTXLpmHgNDCEg/o.jpg',
            time: 'Monday, Feb 19th 5:00-5:30PM',
            count: 3 },
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
              <Typography sx={{}} color="text.secondary">
                {option.address}
              </Typography>
              <Typography sx={{  }} color="text.secondary">
                {option.time} 
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleAcceptOption(option, index)} startIcon={<CheckCircleIcon style={{ color: 'green' }} />}>
                Accept
              </Button>
              <Button size="small" onClick={() => handleDeclineOption(option, index)} startIcon={<CancelIcon style={{ color: 'red' }} />}>
                Decline
              </Button>
              <Button variant='primary'>{option.count + choicesTwo[index]} Signed Up </Button>
            </CardActions>
          </Card>
        ))
      ) : (
        <Box>
          
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          No Upcoming Plates!
        </Typography>
        <br></br>
        </Box>
      )}
      <Button onClick={goToSchedule} variant="contained" color="primary">Edit Schedule</Button>
    </Box>
  );
}

export default OptionsForm;