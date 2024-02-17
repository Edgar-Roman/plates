import { React, useState} from 'react';
import { TextField, Button, Box } from '@mui/material';

function RegistrationForm({ onAuthSuccess }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function addUser() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
        "username": username,
        "password": password
    })
    };

    fetch('http://127.0.0.1:5000/register', requestOptions).then((res) => {

    if (res.status === 200) {
      onAuthSuccess();
    } else {
      res.json().then((json) => {
        alert(json["message"])
      })
    }


    })

    
  }

  return (
    <Box component="form" onSubmit={(e) => { e.preventDefault(); addUser();}} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField label="Username" variant="outlined" onChange={e => setUsername(e.target.value)}/>
      <TextField label="Password" type="password" variant="outlined" onChange={e => setPassword(e.target.value)}/>
      <Button type="submit" variant="contained" color="primary">Register</Button>
    </Box>
  );
}

export default RegistrationForm;
