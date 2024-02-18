import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import LoginLanding from './components/LoginLanding';
import PreferencesForm from './components/PreferencesForm';
import SchedulerForm from './components/SchedulerForm';
import OptionsForm from './components/OptionsForm';
import { Button, Container, Box, Typography} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import IdentitySecure from './components/IdentitySecure';

function App() {
  const [isNewUser, setIsNewUser] = useState(true);
  const [view, setView] = useState('auth');
  const [selectedTime, setSelectedTime] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if user is logged in
  const [selectedOption, setSelectedOption] = useState(null); // State to store the selected option
  const [username, setUsername] = useState(null);
  const [prefComplete, setPrefComplete] = useState(false);
  const [loginVsRegister, setLoginVsRegister] = useState("");

  const handleAuthSuccess = (lvr) => {
    console.log("stuff")
    if (lvr == "login") {
      console.log("stuff1")
      setView("landingLogin");
    } else {
      console.log("stuff2")
      //setView("landingLogin");
      setView('identity');
    }
   //s setIsLoggedIn(true); // Assume user is logged in after successful auth
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

  // This should also be the main screen if you go to the home menu
  const handleLoginLandingClick = (clicked) => {
    console.log("GOT HERE!")
    if (clicked === "matches") {
      console.log("GOT HERE")
      setView('options');
    } else if (clicked === "preferences") {
      setView('preferences');
    }
  }
  
  const navigateToUserForm = () => setView('userForm'); // Function to navigate to the UserForm

  const handleIconPress = (clicked) => {
    console.log("Icon clicked")
    if (username !== null) {
      setView("landingLogin");
    }
  }

  const handleIdentitySubmit = (option) => {
    setView('preferences'); // Navigate to the user form (or any other view as needed)
  };


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container component="main" maxWidth="xs">
        <Header username={username} handleIconPress={handleIconPress}/>
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {view === 'auth' && (
            <>
              <Typography component="h1" variant="h5">
                {isNewUser ? 'Register' : 'Login'}
              </Typography>
              {isNewUser ? <RegistrationForm onAuthSuccess={handleAuthSuccess} setUsername={setUsername} username={username} setLoginVsRegister={setLoginVsRegister}/> : <LoginForm onAuthSuccess={handleAuthSuccess} setUsername={setUsername} username={username} setLoginVsRegister={setLoginVsRegister} setPrefComplete={setPrefComplete}/>}
              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 3 }}
                onClick={() => {
                  setIsNewUser(!isNewUser)
                }}
              >
                {isNewUser ? 'Existing User? Login' : 'New User? Register'}
              </Button>
            </>
          )}
          {view === 'preferences' && <PreferencesForm onSubmit={handlePreferencesSubmit} username={username} setPrefComplete={setPrefComplete}/>}
          {view === 'scheduler' && <SchedulerForm onSubmit={handleSchedulerSubmit} username={username} setPrefComplete={setPrefComplete} />}
          {view === 'options' && <OptionsForm selectedTime={selectedTime} onSubmit={handleOptionsSubmit} username={username} />}
          {view === 'landingLogin' && <LoginLanding prefComplete={prefComplete} handleLoginLandingClick={handleLoginLandingClick}/>}
          {view === 'identity' && <IdentitySecure username={username} onSubmit={handleIdentitySubmit}/>}
          
            {/* <Button sx={{backgroundColor:"#ed5f74", color:"white"}}
            onClick={() => {
               const requestOptions = {
                method: 'POST',
                credentials: 'include',
                
              };
          
              fetch('http://127.0.0.1:4242/create-verification-session', requestOptions)

            }}>Verify User Before Preceding</Button> */}

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
