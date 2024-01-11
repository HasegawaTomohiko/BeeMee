import axios from "axios";
import { useRouter } from "next/router";
import React, {createContext, useContext, useState, useEffect } from "react";

const BeeContext = createContext();

const BeeProvider = ({ children }) => {
  const [bee,setBee] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBeeId = async () => {
      try {
        const res = await axios.get('http://localhost:4000/auth/session');
        setBee(res.data.beeId);
      }catch (error){
        if(error.response && error.response.status === 401 && router.pathname !== '/regist' && router.pathname !== '/') {
          router.push('/login');
        }
      }
    }

    fetchBeeId();
  },[router.pathname]);

  return (
    <BeeContext.Provider value={{ bee, setBee }}>
      {children}
    </BeeContext.Provider>
  )
};

const useBee = () => {
  const context = useContext(BeeContext);
  if (!context) {
    throw new Error('useBee must be used within a BeeProvider');
  }
  return context;
};

export {BeeProvider, BeeContext, useBee};