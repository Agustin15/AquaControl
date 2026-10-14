import { createContext, useContext, useState } from "react";
import {
  saveInfo,
  getAuthTokenSaved,
  saveAuthToken,
} from "../../securityStorage.js";
import { alertError } from "../../components/alertSwal/alertSwal.js";
import { useDevice } from "./DeviceContext.jsx";
import { useAuth } from "../AuthContext.jsx";
const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;

const OptionsDeviceContext = createContext();

export const OptionsDeviceProvider = ({ children }) => {
  const [loadingForm, setLoadingForm] = useState(false);

  const { setDeviceSelected } = useDevice();
  const { updateAccessToken } = useAuth();

  const fetchSelectDevice = async (device, retry) => {
    try {
      const accessToken = await getAuthTokenSaved("accessToken");

      const response = await fetch(
        localhostBackend + "/api/device/deviceSelected",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(device),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401 && retry === true) {
          await updateAccessToken();
          return fetchSelectDevice(device, false);
        }
        throw new Error(result.message);
      }

      await saveAuthToken("accessToken", result.accessToken);
      await saveAuthToken("refreshToken", result.refreshToken);
      await saveInfo("deviceSelected", device);

      setDeviceSelected(device);
    } catch (error) {
      const errorMessage =
        error?.message || "No se pudo seleccionar el dispositivo";
      alertError(
        `Ups algo salio mal al seleccionar dispositivo `,
        errorMessage,
      );
    }
  };

  const fetchUpdateDevice = async (deviceToLink, retry) => {
    try {
      setLoadingForm(true);
      const accessToken = await getAuthTokenSaved("accessToken");
      const response = await fetch(localhostBackend + "/api/device", {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...deviceToLink,
          linked: true,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401 && retry === true) {
          await updateAccessToken();
          return fetchUpdateDevice(deviceToLink, false);
        }
        throw new Error(result.message);
      }

      return result;
    } catch (error) {
      const errorMessage =
        error?.message || "No se pudo vincular el dispositivo";
      alertError("Algo salio mal al vincular dispositivo", errorMessage);
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <OptionsDeviceContext.Provider
      value={{
        fetchUpdateDevice,
        fetchSelectDevice,
        loadingForm,
      }}
    >
      {children}
    </OptionsDeviceContext.Provider>
  );
};

export const useOptionsDevice = () => useContext(OptionsDeviceContext);
