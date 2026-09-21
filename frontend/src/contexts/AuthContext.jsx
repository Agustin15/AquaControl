const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;
import { createContext, useContext, useEffect, useState } from "react";
import {
  cleanInfo,
  getInfoSaved,
  getAuthTokenSaved,
  saveAuthToken,
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
      const refreshToken = await getAuthTokenSaved("refreshToken");
      const accessToken = await getAuthTokenSaved("accessToken");

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
      const refreshToken = await getAuthTokenSaved("refreshToken");

      const response = await fetch(localhostBackend + "/api/refreshToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) return (location.href = "/login");

        throw new Error(result.message);
      }

      await saveAuthToken("accessToken", result.accessToken);
      return true;
    } catch (error) {
      const errorMessage =
        error?.message || "No se pudo actualizar el token de acceso";
      console.log(errorMessage);
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
