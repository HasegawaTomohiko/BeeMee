import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/header';
import SideNavigation from '@/components/sideNavigation';
import { Typography, Box } from '@mui/material';
import checkSession from '@/api/checkSession';
import axios from 'axios';
import BeehiveComponent from '@/components/beehive';

export default function beehive () {

  const isMounted = useRef(true);

  useEffect(() => {
    checkSession();

    return () => {
      isMounted.current = false;
    }
  },[]);
  
  return (
    <>
		<Header />
		<Box sx={{ display : 'flex', justifyContent: 'center'}}>        
			<SideNavigation />
			<BeehiveComponent />
		</Box>
    </>
  );
}