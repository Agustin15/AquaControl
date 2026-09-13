import { createContext, useContext, useState } from "react";
import { getTokenSaved } from "../securityStorage.js";
import { useAuth } from "./AuthContext";
const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [loadingAlerts, setLoadingAlert] = useState([]);
  const { updateAccessToken, userAuth } = useAuth();

  const updateAlertStateToSeen = async (idAlert, retry) => {
    try {
      const accessToken = await getTokenSaved("accessToken");

      const response = await fetch(
        localhostBackend + "/api/userOfAlert/" + idAlert,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            seen: true,
            user: userAuth,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401 && retry) {
          await updateAccessToken();
          await updateAlertStateToSeen(idAlert, false);
        }
        throw new Error(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AlertContext.Provider
      value={{ updateAlertStateToSeen, alerts, loadingAlerts }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
