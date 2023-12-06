import React, {createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';
import { checkSession } from "@/api/auth";

const BeeContext = createContext();

export const BeeProvider = ({ children }) => {
  const [bee,setBee] = useState(null);

  useEffect(() => {
    const initBee = async () => {
      const isAuth = await checkSession();

      if(isAuth){
        try {
          const res = await axios.get(`http://localhost:4000/bee/${isAuth.beeId}`);
          const beeJson = res.data;
          setBee(beeJson);
        } catch (error) {
          console.error('Error : ', error);
        }
      }
    }

    initBee();
  },[]);

  return (
    <BeeContext.Provider value={{ bee, setBee }}>
      {children}
    </BeeContext.Provider>
  )
};

export const useBee = () => {
  const context = useContext(BeeContext);

  if (!context) throw new Error('useBee must be used within a BeeProvider');

  return context;
}