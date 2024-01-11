import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import { RegistForm } from '@/components/form/registForm';

function regist () {
  return (
    <>
       <RegistForm />
    </>
  );
}

export default regist;