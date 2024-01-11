import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import { LoginForm } from '@/components/form/loginForm';
import Cookies from 'js-cookie';

function login () {

  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try{
        const res = await axios.get('http://localhost:4000/auth/session',{
          headers: {
            Authorization: `Bearer ${jwtToken}`
          }
        });

        console.log(res.data);

        if (res.status === 200) {
          router.push('/home');
        }
      } catch(error) {
        if (error.response && error.response.status === 401) {
          console.log('not logged in');
        }
      }
    }

    checkSession();
  },[]);

  return (
    <>
      <LoginForm />
    </>
  );
}

export default login;