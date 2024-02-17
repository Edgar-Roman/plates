import React, { useState } from 'react';
import Header from './components/Header';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import PreferencesForm from './components/PreferencesForm';
import SchedulerForm from './components/SchedulerForm';
import OptionsForm from './components/OptionsForm';
import { Button, Container, Box, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function App() {
  const [isNewUser, setIsNewUser] = useState(true);
  const [view, setView] = useState('auth');
  const [selectedTime, setSelectedTime] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if user is logged in
  const [selectedOption, setSelectedOption] = useState(null); // State to store the selected option

  const handleAuthSuccess = () => {
    setView('preferences');
    setIsLoggedIn(true); // Assume user is logged in after successful auth
  };

  const handlePreferencesSubmit = () => setView('scheduler');

  const handleSchedulerSubmit = (time) => {
    setSelectedTime(time);
    setView('options');
  };

  // Modify handleOptionsSubmit to accept an option parameter and set the selected option
  const handleOptionsSubmit = (option) => {
    setSelectedOption(option); // Store the selected option in state
    setView('userForm'); // Navigate to the user form (or any other view as needed)
  };

  const navigateToUserForm = () => setView('userForm'); // Function to navigate to the UserForm

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container component="main" maxWidth="xs">
        <Header />
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {view === 'auth' && (
            <>
              <Typography component="h1" variant="h5">
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
          
          {/* {isLoggedIn && view !== 'userForm' && (
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={navigateToUserForm}
            >
              Go to User Form
            </Button>
          )} */}
        </Box>
      </Container>
    </LocalizationProvider>
  );
}

export default App;
