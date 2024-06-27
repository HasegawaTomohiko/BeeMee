import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import styles from "./honeycomb.module.css";

export default function Honeycomb ({honeycombData, index}) {

    const [ honeycomb, setHoneycomb ] = useState({});

    useEffect(() => {
        setHoneycomb(honeycombData);
    },[honeycombData]);

    const getStyled = () => {
        switch (index % 5) {
            case 0:
                return { right: '-156px'};
            case 1:
                return { top: '96px', right: '-76px'};
            case 3:
                return { top : '96px', left: '-76px'};
            case 4:
                return { left: '-156px'};
            default:
                return {};
        }
    }

    return (
        <Box sx={{
            margin: '10px',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            ...getStyled(),
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '200px',
                height: '172px',
                //aspectRatio: '200/173',
                backgroundColor: '#ff6600',
                clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
            }}>
                <Typography>{honeycomb.title}</Typography>
            </Box>
        </Box>
    );
}