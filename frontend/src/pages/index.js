import {useRouter} from 'next/router';
import Cookies from 'js-cookie';

function validateSession() {
  
}

export default function index () {

  const router = useRouter();
  const beeId = Cookies.get('beeId');
  const session = Cookies.get('sessionId');

  if(!beeId || !session || !validateSession(sessionId)){
    router.push('/login');
  }
}