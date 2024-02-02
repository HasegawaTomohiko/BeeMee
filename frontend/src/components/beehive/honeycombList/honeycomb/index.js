import { Box, Typography } from "@mui/material";
import styles from "./honeycomb.module.css";

export default function Honeycomb ({honeycombData}) {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '200px',
                aspectRatio: '200/173',
                backgroundColor: '#ff6600',
                clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
            }}>
                <Typography>{honeycombData}</Typography>
            </Box>
        </Box>
    );
}