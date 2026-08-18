const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;
import { createContext, useContext, useEffect, useState } from "react";
import {
  cleanInfo,
  getInfoSaved,
  getTokenSaved,
  saveAccessToken,
} from "../securityStorage.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userAuth, setUserAuth] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      getUserSaved();
    }, 900);
  }, []);

  const getUserSaved = async () => {
    try {
      setLoadingAuth(true);
      const user = await getInfoSaved("userLogued");
      const refreshToken = await getTokenSaved("refreshToken");
      const accessToken = await getTokenSaved("accessToken");

      if (user && refreshToken && accessToken) {
        setUserAuth(user);
      }
    } catch (error) {
      console.log("No hay información almacenada en memoria");
    } finally {
      setLoadingAuth(false);
    }
  };

  const updateAccessToken = async () => {
    try {
      const refreshToken = await getTokenSaved("refreshToken");

      const response = await fetch(localhostBackend + "/api/refreshToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (response.status === 401) return (location.href = "/login");
      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      await saveAccessToken(result.accessToken);
      return true;
    } catch (error) {
      logout();
    }
  };

  const logout = async () => {
    await cleanInfo();
    setUserAuth(null);
    location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        userAuth,
        setUserAuth,
        loadingAuth,
        updateAccessToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
