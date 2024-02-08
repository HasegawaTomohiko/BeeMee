import React, { useState, useEffect } from "react";
import { TextField, Box, Container, CssBaseline, Typography, Grid, Link, Button } from "@mui/material";
import { useRouter } from 'next/router';
import axios from 'axios';

const LoginForm = () => {
  const [beeId, setBeeId] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    try {
      const loginData = {
        beeId : beeId,
        password : password
      }

      const res = await axios.post('http://localhost:4000/auth/',loginData);
      const { jwtToken, bee } = res.data;

      if(res.data.beeId) {

        sessionStorage.setItem('jwtToken', jwtToken);
        sessionStorage.setItem('beeId', res.data.beeId);

        axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
        router.push('/home');
        
      }else{
        setLoginError(true);
        setPassword('');
      }
      
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError(true);
      setPassword('');
    }
  }

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <Box
        backgroundColor="orange"
        borderRadius={10}
        padding={5}
        mt={{ xs: 4, md: 4 }}
        justifyContent="center"
      >
        <Typography>
          Sign in
        </Typography>
        <Box>
        <TextField
          label="BeeID or Email"
          error={loginError}
          value={beeId}
          onChange={(e) => setBeeId(e.target.value)}
          fullWidth
          required
          margin="normal"
          name="identifier"
          autoFocus
          InputProps={{
            style: {
                backgroundColor: 'white',
            }
        }}
        />
        <TextField
          label="Password"
          error={loginError}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          margin="normal"
          InputProps={{
            style: {
                backgroundColor: 'white',
            }
        }}
        />
        </Box>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3, mb: 2 }} onClick={handleLogin}>
          Sign in
        </Button>
        <Grid container>
          <Grid item>
            <Link href="/regist">
              {"Don't have an account? Let's Sing Up"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export { LoginForm };