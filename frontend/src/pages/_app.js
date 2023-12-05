import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { checkSession } from '@/api/auth';
import { BeeProvider } from '@/context/BeeContext';

function BeeMee({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const auth = async () => {
      
      const isAuth = await checkSession();
    
      if(!isAuth) {
        router.push('/login');
      }
    }
    
    auth();
  },[]);

  return(
    <BeeProvider>
       <Component {...pageProps} />
    </BeeProvider>
  );
}