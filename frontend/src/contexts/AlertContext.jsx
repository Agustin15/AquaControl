import { createContext, useContext, useState } from "react";
import { getAuthTokenSaved } from "../securityStorage.js";
import { useAuth } from "./AuthContext";
import { useDevice } from "./DeviceContext.jsx";
const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [errorAlerts, setErrorAlerts] = useState("");
  const [loadingAlerts, setLoadingAlert] = useState(false);
  const [pages, setPages] = useState(0);
  const [index, setIndex] = useState(0);
  const { updateAccessToken, userAuth } = useAuth();
  const { deviceSelected } = useDevice();

  const fetchGetAlerts = async (offset, retry) => {
    try {
      setErrorAlerts("");
      setLoadingAlert(true);
      const accessToken = await getAuthTokenSaved("accessToken");

      const response = await fetch(
        localhostBackend +
          `/api/alert/device/${deviceSelected.id}/user/${userAuth.id}/pagination/${offset}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401 && retry === true) {
          await updateAccessToken();
          await fetchGetAlerts(offset, false);
        }
        throw new Error(result.message);
      }

      if (result) {
        setAlerts(result.alerts);
        setPages(result.pages);
      }
    } catch (error) {
      setErrorAlerts(error?.message || "Sin alertas disponibles");
    } finally {
      setLoadingAlert(false);
    }
  };

  const updateAlertStateToSeen = async (idAlert, retry) => {
    try {
      const accessToken = await getAuthTokenSaved("accessToken");

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
        if (response.status === 401 && retry === true) {
          await updateAccessToken();
          await updateAlertStateToSeen(idAlert, false);
        }
        throw new Error(result.message);
      }
    } catch (error) {
      const errorMessage =
        error?.message || "No se pudo actualizar el estado de la alerta";
      console.log(errorMessage);
    }
  };

  return (
    <AlertContext.Provider
      value={{
        updateAlertStateToSeen,
        alerts,
        loadingAlerts,
        errorAlerts,
        fetchGetAlerts,
        pages,
        index,
        setIndex,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
