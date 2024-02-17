import React from 'react';
import { TextField, Button, Box } from '@mui/material';

function LoginForm({ onAuthSuccess }) {
  return (
    <Box component="form" onSubmit={(e) => { e.preventDefault(); onAuthSuccess(); }} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField label="Username" variant="outlined" />
      <TextField label="Password" type="password" variant="outlined" />
      <Button type="submit" variant="contained" color="primary">Login</Button>
    </Box>
  );
}

export default LoginForm;
