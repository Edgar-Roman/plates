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
      setView("landingLogin");
    } else {
      setView('identity');
    }
  };
  

  const handlePreferencesSubmit = () => setView('scheduler');

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
            width: '100%',
            maxWidth: 360,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: 3,
            p: 4,
            borderRadius: 2,
            bgcolor: 'background.paper',
            '& > :not(style)': { mb: 2 }, // Adding space below each element including Typography
          }}>
            {view === 'auth' && (
              <>
                <Typography component="h1" variant="h5">
                  {isNewUser ? 'Register' : 'Login'}
                </Typography>
                {isNewUser ? <RegistrationForm onAuthSuccess={handleAuthSuccess} setUsername={setUsername} setLoginVsRegister={setLoginVsRegister}/> : <LoginForm onAuthSuccess={handleAuthSuccess} setUsername={setUsername} setLoginVsRegister={setLoginVsRegister} setPrefComplete={setPrefComplete}/>}
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 3 }}
                  onClick={() => setIsNewUser(!isNewUser)}
                >
                  {isNewUser ? 'Existing User? Login' : 'New User? Register'}
                </Button>
              </>
            )}
            {view === 'preferences' && <PreferencesForm onSubmit={handlePreferencesSubmit} username={username} setPrefComplete={setPrefComplete}/>}
            {view === 'scheduler' && <SchedulerForm onSubmit={handleSchedulerSubmit} username={username} setPrefComplete={setPrefComplete}/>}
            {view === 'options' && <OptionsForm selectedTime={selectedTime} onSubmit={handleOptionsSubmit} username={username} goToSchedule={handlePreferencesSubmit}/>}
            {view === 'landingLogin' && <LoginLanding prefComplete={prefComplete} handleLoginLandingClick={handleLoginLandingClick}/>}
            {view === 'identity' && <IdentitySecure username={username} onSubmit={handleIdentitySubmit}/>}
          </Box>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;