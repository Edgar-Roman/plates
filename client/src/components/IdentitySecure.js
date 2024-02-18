import {React, useState} from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { TextField, Button, Box } from '@mui/material';

function IdentitySecure({onSubmit, username}) {

  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <h1 style={{"textAlign": "center"}}>Help us keep everyone safe!</h1>

      <form style={{"textAlign": "center"}} target="_blank" onClick={() => {
        setTimeout(() => {
          onSubmit();
       }, 2000);
      }} action={"http://localhost:4242/create-verification-session?username=" + username} method="POST">
            <Button sx={{backgroundColor:"#ed5f74", color:"white"}} type="submit">Verify User</Button>
      </form>
    </Box>
  );
}

export default IdentitySecure;
