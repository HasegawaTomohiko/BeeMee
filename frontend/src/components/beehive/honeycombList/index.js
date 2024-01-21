import { Box } from "@mui/material";
import Honeycomb from "./honeycomb";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

export default function HoneycombList() {

    const [ beehive, setBeehive] = useState({});
    const [ honeycombs, setHoneycombs ] = useState([]);
    const [ page, setPage ] = useState(1);
    const [ loading, setLoading ] = useState(false);
    const [ hasMore, setHasMore ] = useState(true);
    const router = useRouter();
    const beehiveId = router.query.beehiveId;
    const isMounted = useRef(true);

    const handleScroll = (event) => {
        const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
        if (scrollHeight - scrollTop === clientHeight) {
            fetchHoneycombs();
        }
    }

    return (
        <Box 
            sx={{
                display: 'grid',
                flexWrap: 'wrap',
                width: '100%',
                gridTemplateColumns: 'repeat(5, 1fr)',
            }}
            onScroll={handleScroll}
        >
            {honeycombs.map((honeycomb) => (
                <Honeycomb honeycombData={honeycomb}/>
            ))}
        </Box>
    )
}