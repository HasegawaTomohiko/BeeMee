import { useEffect, useState } from "react";
import { render } from "react-dom";
import { Input, Tabs, Tab, Typography, List, ListItem, ListItemText, Box, Pagination } from "@mui/material";
import { Search } from "@mui/icons-material";
import axios from "axios";
import { useRouter } from "next/router";

export default function SearchBox() {

    const [searchString, setSearchString] = useState('');
    const [searchGenre, setSearchGenre] = useState('Beehive');
    const [result, setResult] = useState([]);
    const [page, setPage] = useState(0);

    const router = useRouter();

    useEffect(() => {
        const SearchBeehive = async () => {
            try {
                const beehiveList = await axios.get(`http://localhost:4000/beehive/search`,{
                    params: {
                        q: searchString,
                        skip: page
                    }
                });
                setResult(beehiveList.data);
            } catch (error) {
                console.log(error);
            }
        }

        const SearchBee = async () => {
            try {
                const beeList = await axios.get(`http://localhost:4000/bee/search`,{
                    params: {
                        q: searchString,
                        skip: page
                    }
                });
                setResult(beeList.data);
            } catch (error) {
                console.log(error);
            }
        }

        if(searchGenre === 'Beehive' && !(searchString[0] === '#' && searchString.length === 1)){
            SearchBeehive();
        }

        if(searchGenre === 'Bee' && !(searchString[0] === '@' && searchString.length === 1)){
            SearchBee();
        }
    },[searchGenre,searchString]);

    return (
        <Box sx={{width: '1200px', flexDirection: 'column',  alignItems: 'center',  display: 'flex', height: '80vh', margin: '20px'}}>
            <Box sx={{
                border: 'solid',
                borderRadius: '5px',
                borderColor : 'orange',
                margin: '20px',
                alignItems: 'center',
                display: 'flex'
            }}>
                <Search sx={{ color: 'orange'}} />
                <Input
                placeholder="search..."
                value={searchString}
                onChange={(event) => {setSearchString(event.target.value)}}
                sx={{
                    margin: '10px',
                    width: '40vw',
                }}/>
            </Box>
            <Box>
                <Tabs
                    value={searchGenre}
                    onChange={(event,newValue) => {setSearchGenre(newValue)}}
                >
                    <Tab label="Beehive" value="Beehive"/>
                    <Tab label="Bee" value="Bee"/>
                </Tabs>
            </Box>
            <Box>
                <List>
                    {searchString !== '' && result && result.length > 0 ? (
                        searchGenre === 'Beehive' ? (
                            result.map((beehive) => (
                                <ListItem>
                                    <ListItemText
                                        onClick={() => {
                                            router.push(`/beehive/${beehive.beehiveId}`)
                                        }}
                                    >{beehive.beehiveName}</ListItemText>
                                </ListItem>
                            ))
                        ) : (
                            result.map((bee) => (
                                <ListItem>
                                    <ListItemText
                                        onClick={() => {
                                            router.push(`/bee/${bee.beeId}`);
                                        }}
                                    >{bee.beeName}</ListItemText>
                                </ListItem>
                            ))
                        )
                    ) : (
                        <Typography>なにもないようです...</Typography>
                    )}
                </List>
                <Pagination count={10}></Pagination>
            </Box>
        </Box>
    )
}