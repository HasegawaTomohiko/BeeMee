import { AddCircleOutline, ExpandLess, ExpandMore } from '@mui/icons-material';
import { Typography, Box, Button, List, ListItem, ListItemButton, ListItemText, Collapse, autocompleteClasses, ListItemIcon } from '@mui/material';
import {useRouter} from 'next/router';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SideNavigation () {

    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [beehiveList, setBeehiveList] = useState({});

    const clickBeehiveList = () => {
        setOpen(!open);
    }

    useEffect(() => {
        const getBeehiveList = async () => {
            try {
                const beeId = sessionStorage.getItem('beeId');
                const joinBeehiveList = await axios.get(`http://localhost:4000/bee/${beeId}/joinBeehive`);
                setBeehiveList(joinBeehiveList.data[0]);
            } catch (error) {
                console.log(error);
            }
        }

        getBeehiveList();
    },[]);

    useEffect(() => {
        console.log(beehiveList);
    },[beehiveList]);

    return (
        <Box sx={{
            width: '300px',
            height : '80vh',
            borderRight: 'solid',
            borderColor: 'lightgrey',
            margin : '20px'
        }}>
            <List>
                <ListItem>
                    <ListItemButton
                        selected = {router.pathname === '/home'}
                        onClick={() => {
                            if(router.pathname !== '/home'){
                                router.push('/home');
                            }
                        }}
                    >
                        <ListItemText>Home</ListItemText>
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton
                        selected = {router.pathname === '/search'}
                        onClick={() => {
                            if(router.pathname !== '/search'){
                                router.push('/search');
                            }
                        }}
                    >
                        <ListItemText>Search</ListItemText>
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton onClick={clickBeehiveList}>
                        <ListItemText>Beehive</ListItemText>
                        {open ? < ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx = {{ overflow:'auto', maxHeight: '50vh' }} >
                            <List component="div" disablePadding>
                                {beehiveList.joinBeehive && beehiveList.joinBeehive.length > 0 ? (
                                    beehiveList.joinBeehive.map(beehive => (
                                        <ListItem>
                                            <ListItemButton
                                                key={beehive.beehiveId}
                                                onClick={() => {
                                                    router.push(`/beehive/${beehive.beehiveId}`);
                                                }}
                                            >
                                                {beehive.beehiveName}
                                            </ListItemButton>
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography sx={{ color: 'lightgrey'}}>
                                        まだBeehiveに参加していません...
                                    </Typography>
                                )}
                                <ListItem>
                                    <ListItemButton
                                        onClick={() => {
                                            router.push('/beehive/createBeehive')
                                        }}
                                    >
                                        <AddCircleOutline />
                                        Create Beehive
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Box>
                    </Collapse>
                <ListItem>
                    <ListItemButton
                        selected = {router.pathname === '/setting'}
                        onClick={() => {
                            if(router.pathname !== '/setting'){
                                router.push('/setting');
                            }
                        }}
                    >
                        <ListItemText>Setting</ListItemText>
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );
};

