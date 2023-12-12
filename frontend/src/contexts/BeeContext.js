import React, {createContext, useContext, useState, useEffect } from "react";
import { checkSession } from "@/api/auth";
const BeeContext = createContext();

export const BeeProvider = ({ children }) => {
  const [bee,setBee] = useState(null);

  useEffect(() => {
    setBee(checkSession());
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