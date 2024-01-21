import { Typography, Box } from "@mui/material";
import Header from "@/components/header";
import SideNavigation from "@/components/sideNavigation";
import BeehiveCreateForm from "@/components/beehive/beehiveCreateForm";

export default function createBeehive() {
    return (
        <>
            <Header />
            <Box sx={{ display : 'flex', justifyContent: 'center'}}>        
                <SideNavigation />
                <Box sx={{ width: '1200px', height: '80vh', margin: '20px'}}>
                    <Typography>Create Beehive</Typography>
                    <BeehiveCreateForm />
                </Box>
            </Box>
        </>
    );
}