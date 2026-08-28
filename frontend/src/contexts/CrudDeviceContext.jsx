import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { getTokenSaved } from "../securityStorage.js";
import { alertError, alertSuccess } from "../components/alertSwal/alertSwal.js";
const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;

const CrudDeviceContext = createContext();

export const CrudDeviceProvider = ({ children }) => {
  const [loadingForm, setLoadingForm] = useState(false);
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [infoDevice, setInfoDevice] = useState(null);
  const [editDevice, setEditDevice] = useState(null);
  const [deleteDevice, setDeleteDevice] = useState(null);
  const [valuesForm, setValuesForm] = useState({
    id: 0,
    placeName: "",
    wifi: "",
    wifiPassword: "",
    location: "",
  });
  const [errorsForm, setErrorsForm] = useState({
    placeName: "",
    wifi: "",
    wifiPassword: "",
    location: "",
  });
  const { updateAccessToken, userAuth } = useAuth();

  const fetchPostOrPut = async (method, retry) => {
    setLoadingForm(true);

    const accessToken = await getTokenSaved("accessToken");

    try {
      const response = await fetch(localhostBackend + "/api/device", {
        method: method,
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          id: valuesForm.id,
          placeName: valuesForm.placeName,
          location: valuesForm.location,
          user: userAuth,
        }),
      });

      if (response.status === 401 && retry == true) {
        await updateAccessToken();
        return fetchPostOrPut(method, false);
      }
      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      alertSuccess(
        `¡Dispositivo ${method == "POST" ? "agregado" : "actualizado"} exitosamente!`,
      );

      if (method == "POST")
        setValuesForm({
          placeName: "",
          wifi: "",
          wifiPassword: "",
          location: "",
        });

      return result;
    } catch (error) {
      alertError(
        `Ups algo salio mal al ${method == "POST" ? "agregar nuevo" : "actualizar"} dispositivo`,
        error,
      );
    } finally {
      setLoadingForm(false);
    }
  };

  const handleClose = () => {
    setErrorsForm({
      placeName: "",
      wifi: "",
      wifiPassword: "",
      location: "",
    });
    setValuesForm({
      placeName: "",
      wifi: "",
      wifiPassword: "",
      location: "",
    });

    if (showFormAdd) setShowFormAdd(false);
  };

  return (
    <CrudDeviceContext.Provider
      value={{
        fetchPostOrPut,
        setShowFormAdd,
        showFormAdd,
        setEditDevice,
        editDevice,
        infoDevice,
        setInfoDevice,
        deleteDevice,
        setDeleteDevice,
        handleClose,
        errorsForm,
        setErrorsForm,
        valuesForm,
        setValuesForm,
        setLoadingForm,
        loadingForm,
      }}
    >
      {children}
    </CrudDeviceContext.Provider>
  );
};

export const useCrudDevice = () => useContext(CrudDeviceContext);
