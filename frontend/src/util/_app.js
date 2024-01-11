import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { render } from 'react-dom';
import axios from 'axios';
import { BeeProvider, useBee } from '../contexts/BeeContext';
import Cookies from 'js-cookie';

function BeeMee({ Component, ctx}) {

  const router = useRouter();

  useEffect(() => {
    console.log(1);
    const fetchBeeId = async () => {
      try{
          const res = await axios.get('http://localhost:4000/auth/session');
      } catch(error) {
        if (error.response && error.response.status === 401 && router.pathname !== '/regist' && router.pathname !== '/') {
          router.push('/login');
        }
      }
    }

    fetchBeeId();

  },[]);

  return (
      <Component ctx={ctx} />
  )
}


export default BeeMee;