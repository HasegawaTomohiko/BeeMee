import { Tab, Tabs, Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function SearchResult (searchString) {

    

    return (
        <Box>
            <Tabs>
                <Tab label="Beehive" />
                <Tab label="Bee"/>
            </Tabs>
            <Box>
                <Typography>SearchResult</Typography>
            </Box>
        </Box>
    )
}