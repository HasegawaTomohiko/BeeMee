import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/header';
import { Typography } from '@mui/material';
import checkSession from '@/api/checkSession';
import axios from 'axios';

export default function beehive () {

  const router = useRouter();
  const { beehiveId } = router.query;
  const isMounted = useRef(true);
  const [beehive, setBeehive] = useState({});

  useEffect(() => {
    checkSession();

    return () => {
      isMounted.current = false;
    }
  },[]);

  useEffect(() => {
      
      const fetchBeehiveData = async () => {
  
        if (beehiveId) {
          axios.get(`http://localhost:4000/beehive/${beehiveId}`)
            .then((res) => {
              if (isMounted.current) {
                setBeehive(res.data);
              }
            }).catch(() => {
              if (isMounted.current) {
                setBeehive({});
                router.push('/404');
              }
            });
        }
      }
      fetchBeehiveData();
  },[beehiveId])
  
  return (
    <>
      <Header />
      <Typography>beehiveId : {beehive.beehiveId}</Typography>
      <Typography>beehiveName : {beehive.beehiveName}</Typography>
    </>
  );
}