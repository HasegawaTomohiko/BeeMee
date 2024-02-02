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

    useEffect(() => {

    },[]);

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
        {text : 11},
        {text : 10},
        {text : 10},
        {text : 10},
        {text : 10},
        {text : 10},
        {text : 10},
        {text : 10},
        {text : 10},
        {text : 10},
        {text : 10},
        {text : 10},
        {text : 10},
        {text : 10},
        {text : 10},
        {text : 10},
        {text : 10},
        {text : 10},
        {text : 10},
        {text : 10},
        {text : 10},
        {text : 10},
        {text : 10},
        {text : 10},
        {text : 10},
        {text : 10},
        {text : 10},
    ]

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
                    // "& > :nth-child(2)" : {
                    //     position: 'relative',
                    //     top : '100px',
                    // },
                    // "& > :nth-child(4)" : {
                    //     position: 'relative',
                    //     top : '100px',
                    // },
                }}
                onScroll={handleScroll}
            >
                {
                    honeycombList.map((honeycomb,index) => {
                         return <Honeycomb honeycombData={honeycomb.text} index={index} key={index}/>
                    })
                }
            </Box>
        </>
    )
}