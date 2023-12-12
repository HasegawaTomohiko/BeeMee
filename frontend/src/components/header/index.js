import { AppBar, Box, Drawer, IconButton, Toolbar, List, ListItem, ListItemText, Hidden } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import { Coffee } from "@mui/icons-material";
import { useState } from "react";

export default function Header() {

    const [sideMenuOpened,setSideMenuOpened] = useState(false);

    return (
        <AppBar position="static" className="beemee-header" style={{ backgroundColor : '#ff6600'}}>
            <Toolbar>
                {/* <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr : 2}}
                    onClick={() => setSideMenuOpened(true)}
                >
                </IconButton> */}

                <Coffee />
                
                {/* <Drawer
                    anchor="left"
                    open={sideMenuOpened}
                    onClose={() => setSideMenuOpened(false)}
                >
                    <Box sx={{ width : '300px'}}> 
                        <List>
                            <Link href="/" style={{ textDecoration : 'none', color : 'inherit' , alignItems : 'center'}}>
                                <ListItem button>
                                    <Home />
                                    <ListItemText primary="Home"/>
                                </ListItem>
                            </Link>
                            <Link href="/beehive" style={{ textDecoration : 'none', color : 'inherit', alignItems : 'center'}}>
                                <ListItem button>
                                    <Coffee />
                                    <ListItemText primary="Beehive" />
                                </ListItem>
                            </Link>
                            <Link href="/search" style={{ textDecoration : 'none', color : 'inherit', alignItems : 'center'}}>
                                <ListItem button>
                                    <Search />
                                    <ListItemText primary="Search" />
                                </ListItem>
                            </Link>
                            <Link href="/setting" style={{ textDecoration : 'none', color : 'inherit', alignItems : 'center'}}>
                                <ListItem button>
                                    <Settings />
                                    <ListItemText primary="Setting" />
                                </ListItem>
                            </Link>
                            <Link href="/logout" style={{ textDecoration : 'none', color : 'inherit', alignItems : 'center'}}>
                                <ListItem button>
                                    <ListItemText primary="Logout" />
                                </ListItem>
                            </Link>
                        </List>
                    </Box>
                </Drawer> */}
            </Toolbar>
        </AppBar>
    );
}