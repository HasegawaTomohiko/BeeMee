import { Search } from "@mui/icons-material";
import { Input } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState, useMemo} from "react";

export default function SearchBar (searchString, setSearchString) {

    return (
        <Box sx={{
            border: 'solid',
            borderRadius: '5px',
            borderColor : 'orange',
            margin: '20px',
            alignItems: 'center',
            display: 'flex'
        }}>
            <Search sx={{ margin: '3px', color: 'orange'}} />
            <Input
            placeholder="search..."
            value={searchString}
            onChange={(event) => {setSearchString(event.target.value)}}
            sx={{
                margin: '10px',
                width: '40vw',
            }}/>
        </Box>
    );
}