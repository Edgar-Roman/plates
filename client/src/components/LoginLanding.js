import {React, useState} from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { TextField, Button, Box } from '@mui/material';

function LoginLanding({onAuthSuccess, setUsername, username, prefComplete, handleLoginLandingClick}) {

  const [anchorEl, setAnchorEl] = useState(null)

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);


  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Button onClick={(e) => { e.preventDefault(); handleLoginLandingClick("preferences");}} variant="contained" color="primary">Edit Preferences</Button>

      {prefComplete == "true" ?  <Button variant="contained" color="primary" onClick={(e) => { e.preventDefault(); handleLoginLandingClick("matches");}}>Upcoming Plates</Button>
       : 

       <div>
      <Typography
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
    <Button disabled={true} type="submit" variant="contained" color="primary" onSubmit={(e) => { e.preventDefault(); handleLoginLandingClick("matches");}}>Upcoming Plates</Button>
       
      </Typography>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>Please fill out the preferences to view recommendations.</Typography>
      </Popover>
    </div>
      
       
       }
    </Box>
  );
}

export default LoginLanding;
