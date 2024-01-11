import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/header';
import { Typography } from '@mui/material';
import checkSession from '@/api/checkSession';

function setting () {

  useEffect(() => {
    checkSession();
  });
  
  return (
    <>
      <Header />
    </>
  );
}

export default setting;