import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import Honeycomb from "./honeycombList/honeycomb";
import HoneycombList from "./honeycombList";
import { useRouter } from "next/router";
import axios from "axios";

export default function BeehiveComponent() {

    const router = useRouter();
    const beehiveId = router.query.beehiveId;

    const [ beehive, setBeehive ] = useState({});
    const [ honeycombs, setHoneycombs ] = useState([]);
    const [ page, setPage ] = useState(1);
    const [ loading, setLoading ] = useState(false);
    const [ hasMore, setHasMore ] = useState(true);



    useEffect(() => {
        const fetchBeehive = async () => {
            try {
                const beehiveData = await axios.get(`http://localhost:4000/beehive/${beehiveId}`);
                setBeehive(beehiveData.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchBeehive();
    },[beehiveId]);

    // useEffect(() => {
    //     console.log(beehive);
    //     if(beehive === undefined) return;
    //     try {
    //         const fetchHoneycombs = async () => {
    //             setLoading(true);
    //             const honeycombData = await axios.get(`http://localhost:4000/beehive/${beehive.beehiveId}/honeycomb`,{
    //                 params: {
    //                     page: page
    //                 },
    //                 headers: {
    //                     Authorization: `Bearer ${sessionStorage.getItem('jwtToken')}`
    //                 }
    //             });
    //             setHoneycombs((prev) => [...prev, ...honeycombData.data]);
    //             setPage((prev) => prev + 1);
    //             setLoading(false);
    //         }
    //         fetchHoneycombs();
    //     } catch (error) {
    //         console.log(error);
    //     }
    // },[beehive]);

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
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchHoneycombs();
    }, [beehive]); // Only re-run the effect if beehive changes

    return (
        <Box sx={{ width: '1200px', height: '80vh',  margin: '20px'}}>
            <HoneycombList/>
        </Box>
    );
}