import { React, useState} from 'react';
import { TextField, Button, Box } from '@mui/material';

function RegistrationForm({ onAuthSuccess, setUsername, username, setLoginVsRegister}) {

  const [localUser, setLocalUser] = useState("");
  const [password, setPassword] = useState("");

  function addUser() {
    const requestOptions = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
        "username": localUser,
        "password": password
    })
    };

    fetch('http://127.0.0.1:5000/register', requestOptions).then((res) => {

    if (res.status === 200) {
      onAuthSuccess("register");
      setUsername(localUser)
    } else {
      res.json().then((json) => {
        alert(json["message"])
      })
    }


    }) 
  }

  return (
    <Box component="form" onSubmit={(e) => { e.preventDefault(); addUser();}} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField label="Username" variant="outlined" onChange={e => setLocalUser(e.target.value)}/>
      <TextField label="Password" type="password" variant="outlined" onChange={e => setPassword(e.target.value)}/>
      <Button type="submit" variant="contained" color="primary">Register</Button>
    </Box>
  );
}

export default RegistrationForm;
