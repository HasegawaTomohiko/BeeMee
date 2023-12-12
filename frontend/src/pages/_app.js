import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { BeeProvider } from '@/contexts/BeeContext';
import useSession from '@/hook/useSession';

function BeeMee({ Component, pageProps }) {
  
  useSession();

  return(
    <BeeProvider>
       <Component {...pageProps} />
    </BeeProvider>
  );
}

export default BeeMee;