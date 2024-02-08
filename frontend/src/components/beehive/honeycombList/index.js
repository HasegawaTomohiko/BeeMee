import { Box } from "@mui/material";
import Honeycomb from "./honeycomb";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

export default function HoneycombList({ honeycombData,beehiveId }) {
    const [beehive, setBeehive] = useState({});
    const [honeycombs, setHoneycombs] = useState([]);
    const [page, setPage] = useState(1); // 初期値を1に設定
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (beehiveId) {
            fetchHoneycombs();
        }
    }, [beehiveId]);

    const fetchHoneycombs = async () => {
        if (!beehiveId) return;
        setLoading(true);
        try {
            const honeycombData = await axios.get(`http://localhost:4000/beehive/${beehiveId}/Honeycomb`, {
                params: {
                    page: page,
                },
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('jwtToken')}`,
                },
            });

            setHoneycombs((prev) => [...prev, ...honeycombData.data]);
            setPage((prev) => prev + 1);
            if (honeycombData.data.length === 0) {
                console.log("no more honeycombs");
                setHasMore(false);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleScroll = (event) => {
        const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
        if (scrollHeight - scrollTop === clientHeight) {
            fetchHoneycombs();
        }
    };

    return (
        <>
            <Box
                sx={{
                    display: 'grid',
                    flexWrap: 'wrap',
                    width: '1200px',
                    height: '95%',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gridGap: '0',
                    overflow: 'auto',
                }}
                onScroll={handleScroll}
            >
                {honeycombs.map((honeycomb, index) => (
                    <Honeycomb honeycombData={honeycomb} index={index} key={index} />
                ))}
            </Box>
        </>
    );
}
