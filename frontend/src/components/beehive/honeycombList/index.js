import { Box } from "@mui/material";
import Honeycomb from "./honeycomb";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import styled from "@mui/material";

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

    const honeycombList = [
        {text : 1},
        {text : 2},
        {text : 3},
        {text : 4},
        {text : 5},
        {text : 6},
        {text : 7},
        {text : 8},
        {text : 9},
        {text : 10},
        {text : 11}
    ]

    return (
        <>
            <Box
                sx={{
                    display: 'grid',
                    flexWrap: 'wrap',
                    width: '100%',
                    gridTemplateColumns: 'repeat(5, 2fr)',
                    gridGap: '0',
                    "& > :nth-child(2)" : {
                        marginRight: '-50px',
                        marginTop : '100px',
                    },
                    "& > :nth-child(4)" : {
                        marginRight: '-50px',
                        marginTop : '100px',
                    },
                }}
                onScroll={handleScroll}
            >
                <Honeycomb />
                <Honeycomb />
                <Honeycomb />
                <Honeycomb />
                <Honeycomb />
                <Honeycomb />
            </Box>
        </>
    )
}