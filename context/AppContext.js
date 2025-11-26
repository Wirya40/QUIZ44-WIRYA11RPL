// context/AppContext.js
import React, { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [theme, setTheme] = useState("light"); // "light" | "dark"
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userName, setUserName] = useState("Wirya");
  const [selectedMajor, setSelectedMajor] = useState("");

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      isLoggedIn,
      setIsLoggedIn,
      userName,
      setUserName,
      selectedMajor,
      setSelectedMajor,
    }),
    [theme, isLoggedIn, userName, selectedMajor]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
}
