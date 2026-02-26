import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  return <AuthContext.Provider value={{ user, setUser, theme, setTheme }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
