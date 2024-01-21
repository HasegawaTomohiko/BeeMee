import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import checkSession from '@/api/checkSession';
import { Typography } from '@mui/material';
import Header from '@/components/header';
import SideNavigation from '@/components/sideNavigation';
import { Box } from '@mui/system';

const Home = () => {
    const [beeInfo, setBeeInfo] = useState(null);

    useEffect(() => {

        const fetchBeeInfo = async () => {

            await checkSession();

            try {
                const beeId = sessionStorage.getItem('beeId');
                // Get user information
                const res = await axios.get(`http://localhost:4000/bee/${beeId}`);
                setBeeInfo(res.data);
            } catch (error) {
                console.error(error);
            }

        };

        fetchBeeInfo();
    }, []);

    useEffect(() => {
        console.log(beeInfo);
    },[beeInfo]);

    return (
        <>
            <Header />
            <Box sx={{ display : 'flex', justifyContent: 'center'}}>        
                <SideNavigation />
                <Box sx={{ width: '1200px', height: '80vh',  margin: '20px'}}>
                    <h1>User Information</h1>
                    {beeInfo && (
                        <>
                            <Typography>id : {beeInfo._id}</Typography>
                            <Typography>beeId : {beeInfo.beeId}</Typography>
                            <Typography>name : {beeInfo.beeName}</Typography>
                        </>
                    )}
                </Box>
            </Box>
        </>
    );
};

export default Home;
