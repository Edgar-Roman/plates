import React, { useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import PreferencesForm from './components/PreferencesForm';
import SchedulerForm from './components/SchedulerForm';
import OptionsForm from './components/OptionsForm';
import { AppBar, Toolbar, Typography, Container, Box, Button, createTheme, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ed5f74', // Updated primary color
    },
    secondary: {
      main: '#ffab91',
    },
  },
  typography: {
    fontFamily: 'Quicksand, sans-serif',
    // Customize the font size for the AppBar title
    h4: {
      fontWeight: 600,
    },
  },
});

function App() {
  const [isNewUser, setIsNewUser] = useState(true);
  const [view, setView] = useState('auth');
  const [selectedTime, setSelectedTime] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleAuthSuccess = () => {
    setView('preferences');
    setIsLoggedIn(true);
  };

  const handlePreferencesSubmit = () => setView('scheduler');

  const handleSchedulerSubmit = (time) => {
    setSelectedTime(time);
    setView('options');
  };

  const handleOptionsSubmit = (option) => {
    setSelectedOption(option);
    setView('options');
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AppBar position="static" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)' }}>
          <Toolbar sx={{ minHeight: '100px', justifyContent: 'flex-start', pt: '20px', pl: '20px' }}>
            <Typography variant="h2" color="primary" noWrap sx={{ flexGrow: 1, fontSize: '3.5rem', lineHeight: '1', fontWeight: 'bold' }}>
              Plates
            </Typography>
            {isLoggedIn && (
              <Button color="primary" onClick={() => {}}>Profile</Button>
            )}
          </Toolbar>
        </AppBar>

        {/* Adjust the height of the main container to account for the AppBar's increased height */}
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
          }}>
            {view === 'auth' && (
              <>
                <Typography component="h1" variant="h5" gutterBottom>
                  {isNewUser ? 'Register' : 'Login'}
                </Typography>
                {isNewUser ? <RegistrationForm onAuthSuccess={handleAuthSuccess} /> : <LoginForm onAuthSuccess={handleAuthSuccess} />}
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
            {view === 'preferences' && <PreferencesForm onSubmit={handlePreferencesSubmit} />}
            {view === 'scheduler' && <SchedulerForm onSubmit={handleSchedulerSubmit} />}
            {view === 'options' && <OptionsForm selectedTime={selectedTime} onSubmit={handleOptionsSubmit} />}
          </Box>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
