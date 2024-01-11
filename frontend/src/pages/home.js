import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import checkSession from '@/api/checkSession';
import { Typography } from '@mui/material';

const Home = () => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        
        const fetchUserInfo = async () => {
            
            await checkSession();

            try {
                const beeId = sessionStorage.getItem('beeId');
                // Get user information
                const userResponse = await axios.get(`http://localhost:4000/bee/${beeId}`);
                setUserInfo(userResponse.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserInfo();
    }, []);

    useEffect(() => {
        console.log(userInfo);
    },[userInfo]);

    return (
        <div>
            <h1>User Information</h1>
            {userInfo && (
                <>
                    <Typography>id : {userInfo._id}</Typography>
                    <Typography>beeId : {userInfo.beeId}</Typography>
                    <Typography>name : {userInfo.beeName}</Typography>
                </>
            )}
        </div>
    );
};

export default Home;
