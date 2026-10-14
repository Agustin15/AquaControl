import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { getAuthTokenSaved, getInfoSaved } from "../../securityStorage.js";
const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const [deviceSelected, setDeviceSelected] = useState(null);
  const [loadingDevice, setLoadingDevice] = useState(true);
  const [devices, setDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [errorDevices, setErrorDevices] = useState();
  const { updateAccessToken, userAuth } = useAuth();

  useEffect(() => {
    setTimeout(() => {
      getDeviceSaved();
    }, 900);
  }, []);

  const getDeviceSaved = async () => {
    try {
      setLoadingDevice(true);
      const device = await getInfoSaved("deviceSelected");

      if (device) {
        setDeviceSelected(device);
      }
    } catch (error) {
      console.log("No hay información almacenada en memoria");
    } finally {
      setLoadingDevice(false);
    }
  };

  const fetchGet = async (url, method, retry) => {
    setLoadingDevices(true);
    setErrorDevices(null);

    const accessToken = await getAuthTokenSaved("accessToken");

    try {
      const response = await fetch(url, {
        method: method,
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status == 401 && retry == true) {
          await updateAccessToken();
          return fetchGet(url, method, false);
        }
        throw new Error(result.message);
      }

      return result;
    } catch (error) {
      const errorMessage =
        error?.message || "No se pudieron cargar los dispositivos";
      setErrorDevices(errorMessage);
    } finally {
      setLoadingDevices(false);
    }
  };

  const getUserDevices = async () => {
    setDevices([]);
    const devices = await fetchGet(
      localhostBackend + `/api/device/allUserDevices/user/${userAuth.id}`,
      "GET",
      true,
    );
    if (devices) setDevices(devices);
    return devices;
  };

  return (
    <DeviceContext.Provider
      value={{
        loadingDevice,
        deviceSelected,
        setDeviceSelected,
        devices,
        loadingDevices,
        errorDevices,
        getUserDevices,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => useContext(DeviceContext);
