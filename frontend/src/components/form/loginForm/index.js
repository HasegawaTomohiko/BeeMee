import React, { useState } from "react";
import { TextField, Box, Container, CssBaseline, Typography, Grid, Link } from "@mui/material";
import Button from "@mui/material";
import axios from 'axios';
import { useBee } from "@/contexts/BeeContext";

export default LoginForm = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassowrd] = useState('');
  const { bee , setBee } = useBee();

  const handleLogin = async () => {
    try {
      const getStaticProps = async () => {
        const loginData = new FormData();
        loginData.append('identifier',identifier);
        loginData.append('password',password);
        const res = await axios.post('http://localhost:4000/auth/authBee',loginData);
        const { sessionId, bee } = res.data;

        sessionStorage.setItem('beeId', sessionId);
        sessionStorage.setItem('bee', JSON.stringify(bee));

        setBee(bee);

        onLogin();
      }
      getStaticProps();
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  return (
    <Container component={main} maxWidth="xs">
      <CssBaseline />
      <Box>
        <Typography>
          Sign in
        </Typography>
        <Box>
        <TextField
          label="BeeID or Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          fullWidth
          required
          margin="normal"
          name="identifier"
          autoFocus
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassowrd(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        </Box>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3, mb: 2}} onClick={handleLogin}>
          Sign in
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href="#">
              Forgot Password?
            </Link>
          </Grid>
          <Grid item>
            <Link href="#">
              {"Don't have an account? Let's Sing Up"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}