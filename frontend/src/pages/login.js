import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import LoginForm from '@/components/form/loginForm';

export default function index () {
  
  const onLogin = () => {
    console.log('Login!');
  }

  return (
    <>
      <LoginForm onLogin={onLogin()}/>
    </>
  );
}