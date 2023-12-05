import React, { useState } from "react";
import TextField from "@mui/material";
import Button from "@mui/material";
import axios from 'axios';

export default LoginForm = ({ onLogin }) => {
  const [beeId, setBeeId] = useState('');
  const [password, setPassowrd] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:4000/auth/authBee',{ beeId, password });
      const { sessionId, bee } = res.data;

      sessionStorage.setItem('beeId', sessionId);

      sessionStorage.setItem('bee', JSON.stringify(bee));

      onLogin();
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  return (
    <div>
      <TextField
        label="BeeID"
        value={beeId}
        onChange={(e) => setBeeId(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassowrd(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login
      </Button>
    </div>
  );
}