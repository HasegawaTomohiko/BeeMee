import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/header';
import { Typography, Box, Input } from '@mui/material';
import checkSession from '@/api/checkSession';
import SideNavigation from '@/components/sideNavigation';
import SearchBar from '@/components/search/searchBar';
import SearchBox from '@/components/search';

function search () {

  useEffect(() => {
    checkSession();
  });
  
  return (
    <>
      <Header />
      
      <Box sx={{ display : 'flex', justifyContent: 'center'}}>        
          <SideNavigation />
		  <SearchBox />
      </Box>
    </>
  );
}

export default search;