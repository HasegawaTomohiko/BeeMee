import React, { useState, useEffect } from "react";
import { TextField, Box, Container, CssBaseline, Typography, Grid, Link, Button } from "@mui/material";
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from "js-cookie";

const LoginForm = () => {
  const [beeId, setBeeId] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    try {
      // const loginData = new FormData();
      // loginData.append('beeId',beeId);
      // loginData.append('password',password);
      const loginData = {
        beeId : beeId,
        password : password
      }

      const res = await axios.post('http://localhost:4000/auth/',loginData);
      const { jwtToken, bee } = res.data;

      console.log(res.data);

      if(res.data.beeId) {

        sessionStorage.setItem('jwtToken', jwtToken);
        sessionStorage.setItem('beeId', res.data.beeId);

        axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;

        console.log('go to home');
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
      <Box>
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
        />
        </Box>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3, mb: 2 }} onClick={handleLogin}>
          Sign in
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href="#">
              Forgot Password?
            </Link>
          </Grid><br/>
          <Grid item>
            <br/>
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