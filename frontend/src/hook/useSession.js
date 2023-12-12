import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useBee } from '@/contexts/BeeContext';

export default function useSession() {
  const router = useRouter();
  const { bee } = useBee();

  useEffect(() => {
    if(!bee) {
      router.push('/login');
    }
  },[user]);
}