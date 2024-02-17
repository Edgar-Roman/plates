import React, { useState } from 'react';
import Header from './components/Header';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import PreferencesForm from './components/PreferencesForm';
import SchedulerForm from './components/SchedulerForm';
import OptionsForm from './components/OptionsForm';
import { Button, Container, Box, Typography } from '@mui/material';

function App() {
  const [isNewUser, setIsNewUser] = useState(true);
  const [view, setView] = useState('auth');
  const [selectedTime, setSelectedTime] = useState(null);

  const handleAuthSuccess = () => setView('preferences');

  const handlePreferencesSubmit = () => setView('scheduler');

  const handleSchedulerSubmit = (time) => {
    setSelectedTime(time);
    setView('options');
  };

  return (
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
        {view === 'options' && <OptionsForm selectedTime={selectedTime} />}
      </Box>
    </Container>
  );
}

export default App;
