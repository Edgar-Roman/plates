import React, { useState } from 'react';
import './App.css';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import PreferencesForm from './components/PreferencesForm';
import SchedulerForm from './components/SchedulerForm';
import { Button, Box, Typography, Container } from '@mui/material';

function App() {
  const [isNewUser, setIsNewUser] = useState(true);
  const [view, setView] = useState('auth'); // Include 'scheduler' in the possible views

  const handleAuthSuccess = () => {
    setView('preferences');
  };

  const handlePreferencesSubmit = () => {
    setView('scheduler'); // Update the view to 'scheduler' after preferences are submitted
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Box
        sx={{
          marginTop: '-10vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: 3,
          borderRadius: 1,
          boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)',
        }}
      >
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
        {view === 'scheduler' && <SchedulerForm />}
      </Box>
    </Container>
  );
}

export default App;
