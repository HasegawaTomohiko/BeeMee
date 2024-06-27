import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/header';
import SideNavigation from '@/components/sideNavigation';
import { Typography, Box } from '@mui/material';
import checkSession from '@/api/checkSession';
import BeehiveComponent from '@/components/beehive';

export default function beehive () {

  const router = useRouter();
  const previousBeehiveIdRef = useRef();

  useEffect(() => {
    checkSession();
  },[]);

  useEffect(() => {
    const currentBeehiveId = router.query.beehiveId;

    // Only reload if beehiveId has changed
    if (previousBeehiveIdRef.current && currentBeehiveId !== previousBeehiveIdRef.current) {
        location.reload();
    }

    // Update the previousBeehiveIdRef to the current beehiveId
    previousBeehiveIdRef.current = currentBeehiveId;
  },[router.query.beehiveId]);
  
  return (
    <>
		<Header />
		<Box sx={{ display : 'flex', justifyContent: 'center'}}>        
			<SideNavigation />
			<BeehiveComponent beehiveId={router.query.beehiveId} />
		</Box>
    </>
  );
}