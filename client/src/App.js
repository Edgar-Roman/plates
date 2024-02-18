import React, { useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import LoginLanding from './components/LoginLanding';
import PreferencesForm from './components/PreferencesForm';
import SchedulerForm from './components/SchedulerForm';
import OptionsForm from './components/OptionsForm';
import { AppBar, Toolbar, Typography, Container, Box, Button, IconButton, createTheme, ThemeProvider } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Importing AccountCircle icon

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import IdentitySecure from './components/IdentitySecure';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ed5f74',
    },
    secondary: {
      main: '#ffab91',
    },
  },
  typography: {
    fontFamily: 'Quicksand, sans-serif',
    h2: {
      fontWeight: 700,
      fontSize: '3.5rem',
    },
  },
});

function App() {
  const [isNewUser, setIsNewUser] = useState(true);
  const [view, setView] = useState('auth');
  const [selectedTime, setSelectedTime] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [username, setUsername] = useState(null);
  const [prefComplete, setPrefComplete] = useState(false);
  const [loginVsRegister, setLoginVsRegister] = useState("");

  const handleAuthSuccess = (lvr) => {
    setIsLoggedIn(true); // Set isLoggedIn to true upon successful authentication

    if (lvr === "login") {
      setView("options");
    } else {
      setView('identity');
    }
  };
  

  const handlePreferencesSubmit = () => setView('options');

  const handleGoToSchedule = () => setView('scheduler');

  const handleSchedulerSubmit = (time) => {
    setSelectedTime(time);
    setPrefComplete("true")
    setView('options');
  };

  const handleOptionsSubmit = (option) => {
    setSelectedOption(option);
    setView('options');
  };

  const handleLoginLandingClick = (clicked) => {
    if (clicked === "matches") {
      setView('options');
    } else if (clicked === "preferences") {
      setView('preferences');
    }
  };

  const handleIconPress = () => {
    if (username !== null) {
      setView("landingLogin");
    }
  };

  const handleIdentitySubmit = () => {
    setView('preferences');
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)' }}>
        <Toolbar sx={{ minHeight: '100px', justifyContent: 'flex-start', pt: '20px', pl: '20px' }}>
          <Typography variant="h2" color="primary" noWrap sx={{ flexGrow: 1 }}>
            Plates
          </Typography>
          {isLoggedIn && (
            <IconButton color="primary" onClick={handleIconPress}>
              <AccountCircleIcon fontSize="large"/> {/* Profile icon with primary color */}
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
        <Container component="main" sx={{ display: 'flex', height: 'calc(100vh - 100px)', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  bgcolor: 'background.default',
  p: 5,
  borderRadius: '50%',
  width: 700,
  height: 700,
  boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.15)',
}}>
  <Box sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '87%',
    height: '87%',
    bgcolor: 'background.paper',
    borderRadius: '50%',
    boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.1)',
    p: 2, // Added padding inside the inner Box for spacing
  }}>
    {view === 'auth' && (
      <>
        <Typography component="h1" variant="h5" sx={{ mt: 2, mb: 3 }}> {/* Added margin for spacing */}
          {isNewUser ? 'Register' : 'Login'}
        </Typography>
        {isNewUser ? <RegistrationForm onAuthSuccess={handleAuthSuccess} setUsername={setUsername} setLoginVsRegister={setLoginVsRegister}/> : <LoginForm onAuthSuccess={handleAuthSuccess} setUsername={setUsername} setLoginVsRegister={setLoginVsRegister} setPrefComplete={setPrefComplete}/>}
        <Box sx={{ width: '50%', mt: 3 }}> {/* Control the width of the button by wrapping it in a Box */}
          <Button
            fullWidth // Button will fill the width of the Box it's contained within
            variant="outlined"
            onClick={() => setIsNewUser(!isNewUser)}
          >
            {isNewUser ? 'Existing User? Login' : 'New User? Register'}
          </Button>
        </Box>
      </>
    )}
            {view === 'preferences' && <PreferencesForm onSubmit={handlePreferencesSubmit} username={username} setPrefComplete={setPrefComplete}/>}
            {view === 'scheduler' && <SchedulerForm onSubmit={handleSchedulerSubmit} username={username} setPrefComplete={setPrefComplete}/>}
            {view === 'options' && <OptionsForm selectedTime={selectedTime} onSubmit={handleOptionsSubmit} username={username} goToSchedule={handleGoToSchedule}/>}
            {view === 'landingLogin' && <LoginLanding prefComplete={prefComplete} handleLoginLandingClick={handleLoginLandingClick}/>}
            {view === 'identity' && <IdentitySecure username={username} onSubmit={handleIdentitySubmit}/>}
          </Box>
          </Box>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;