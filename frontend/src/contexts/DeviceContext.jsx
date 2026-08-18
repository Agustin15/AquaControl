import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  getInfoSaved,
  getTokenSaved,
  saveInfo,
  saveTokens,
} from "../securityStorage.js";
import { alertError } from "../components/alertSwal/alertSwal.js";
const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const [deviceSelected, setDeviceSelected] = useState(null);
  const [loadingDevice, setLoadingDevice] = useState(true);
  const [devices, setDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [errorDevices, setErrorDevices] = useState();
  const { accessToken, updateAccessToken } = useAuth();

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

    const accessToken = await getTokenSaved("accessToken");

    try {
      const response = await fetch(url, {
        method: method,
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401 && retry == true) {
        await updateAccessToken();
        return fetchGet(url, false);
      }
      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      return result;
    } catch (error) {
      setErrorDevices(error.message);
    } finally {
      setLoadingDevices(false);
    }
  };

  const fetchSelectDevice = async (device, retry, navigate) => {
    try {
      const deviceSelected = await getInfoSaved("deviceSelected");

      if (deviceSelected && deviceSelected.id == device.id) {
        setDeviceSelected(deviceSelected);
        navigate("/deviceIrrigate");
        return;
      }

      const accessToken = await getTokenSaved("accessToken");

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

      if (response.status === 401 && retry == true) {
        await updateAccessToken();
        return fetchSelectDevice(false);
      }
      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      await saveTokens(result.accessToken, result.refreshToken);
      await saveInfo("deviceSelected", device);
      setDeviceSelected(device);

      navigate("/deviceIrrigate");
    } catch (error) {
      alertError(`Ups algo salio mal al seleccionar dispositivo `, error);
    }
  };

  const getUserDevices = async () => {
    setDevices([]);
    const devices = await fetchGet(
      localhostBackend + `/api/device/allUserDevices`,
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
        fetchSelectDevice,
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
