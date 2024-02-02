import { Box } from "@mui/system";
import { useEffect, useState, useRef } from "react";
import HoneycombList from "./honeycombList";
import { useRouter } from "next/router";
import axios from "axios";
import { Typography } from "@mui/material";

export default function BeehiveComponent() {

    const router = useRouter();
    const beehiveId = router.query.beehiveId;

    const [ beehive, setBeehive ] = useState({});
    const [ honeycombs, setHoneycombs ] = useState([]);
    const [ page, setPage ] = useState(1);
    const [ loading, setLoading ] = useState(false);
    const [ hasMore, setHasMore ] = useState(true);
    const isMounted = useRef(false);

    useEffect(() => {
        return () => {
            isMounted.current = true;
        }
    });

    useEffect(() => {
        if(beehiveId){
            const fetchBeehive = async () => {
                try {
                    const beehiveData = await axios.get(`http://localhost:4000/beehive/${beehiveId}`);
                    setBeehive(beehiveData.data);
                } catch (error) {
                    console.log("useEffect's beehiveId error:" + beehiveId);
                    console.log(error);
                }
            }
            
            fetchBeehive();
        }
    },[beehiveId]);

    useEffect(() => {
        
        const fetchHoneycombs = async () => {
            if (!beehive.beehiveId) return; // Add this line
            setLoading(true);
            try {
                const honeycombData = await axios.get(`http://localhost:4000/beehive/${beehive.beehiveId}/Honeycomb`,{
                    params: {
                        page: page
                    },
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('jwtToken')}`
                    }
                });
                setHoneycombs((prev) => [...prev, ...honeycombData.data]);
                setPage((prev) => prev + 1);
            } catch (error) {
                console.log("useEffect's beehive error:" + beehive.beehiveId);
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        fetchHoneycombs();

    },[beehive])

    useEffect(() => {
        console.log(honeycombs);
    },[honeycombs]);


    return (
        <Box sx={{ width: '1200px', height: '80vh',  margin: '20px'}}>
            <Typography>{beehive.beehiveId}</Typography>
            {honeycombs.map((honeycomb, index) => {
                return (
                    <Typography>{honeycomb._id}</Typography>
                )
            })}
            <HoneycombList />
        </Box>
    );
}