import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/header';
import { Typography } from '@mui/material';
import checkSession from '@/api/checkSession';
import axios from 'axios';

export default function bee () {

  const router = useRouter();
  const { beeId } = router.query;
  const isMounted = useRef(true);
  const [beeData, setBeeData] = useState(null);

  useEffect(() => {
    
    checkSession();

    return () => {
      isMounted.current = false;
    }
  },[]);

  useEffect(() => {

    const fetchBeeData = async () => {

      if (beeId) {
        axios.get(`http://localhost:4000/bee/${beeId}`)
          .then((res) => {
            if (isMounted.current) {
              setBeeData(res.data);
            }
          }).catch(() => {
            if (isMounted.current) {
              setBeeData(null);
            }
          });
      }
    }
    fetchBeeData();
  },[beeId]);

  useEffect(() => {
    console.log(beeData);
  },[beeData]);

  return (
    <>
      <Header />
      {
        beeData && (
          <>
            <Typography>beeId : {beeData.beeId}</Typography>
            <Typography>beeName : {beeData.beeName}</Typography>
          </>
        )
      }
    </>
  );
}