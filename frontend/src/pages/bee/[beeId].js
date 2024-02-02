import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/header';
import { Typography, Box } from '@mui/material';
import checkSession from '@/api/checkSession';
import SideNavigation from '@/components/sideNavigation';
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
		<Box sx={{ display : 'flex', justifyContent: 'center'}}>        
			<SideNavigation />
			<Box sx={{ width: '1200px', height: '80vh',  margin: '20px'}}>
				<h1>User Information</h1>
				{beeData && (
					<>
						<Typography>id : {beeData.beeId}</Typography>
						<Typography>beeId : {beeData.beeName}</Typography>
					</>
				)}
			</Box>
		</Box>
    </>
  );
}