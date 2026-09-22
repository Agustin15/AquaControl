import { createContext, useContext, useEffect, useState } from "react";
import { getAuthTokenSaved, saveInfo } from "../securityStorage.js";
import { useAuth } from "./AuthContext.jsx";
import { useDevice } from "./DeviceContext.jsx";
import { alertError, alertSuccess } from "../components/alertSwal/alertSwal.js";

const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;

const UserDeviceContext = createContext();

export const UserDeviceProvider = ({ children }) => {
  const [showAddUser, setShowAddUser] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [infoUser, setInfoUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const { deviceSelected, setDeviceSelected } = useDevice();
  const { updateAccessToken } = useAuth();

  useEffect(() => {
    if (!deviceSelected) return;
    saveInfo("deviceSelected", deviceSelected);
  }, [deviceSelected]);

  const fetchPostOrPutUserOfDevice = async (userOfDevice, retry, method) => {
    try {
      setLoadingForm(true);
      const accessToken = await getAuthTokenSaved("accessToken");

      const response = await fetch(
        `${localhostBackend}/api/userOfDevice/device/${deviceSelected.id}`,
        {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(userOfDevice),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401 && retry === true) {
          await updateAccessToken();
          return fetchPostOrPutUserOfDevice(user, false, method);
        }
        throw new Error(
          result.message ||
            "No se pudo actualizar rol del usuario en el dispositivo",
        );
      }

      return result;
    } catch (error) {
      const errorMessage =
        error?.message || "No se pudo completar la operación del usuario";
      alertError("Algo salio mal", errorMessage);
      return null;
    } finally {
      setLoadingForm(false);
    }
  };

  const updateUserRoleInDevice = async (userOfDevice) => {
    const result = await fetchPostOrPutUserOfDevice(userOfDevice, true, "PUT");

    if (result) {
      const usersOfDeviceUpdated = deviceSelected.usersOfDevice.map((item) => {
        if (item.user.id == userOfDevice.user.id) return userOfDevice;
        else return item;
      });

      setDeviceSelected({
        ...deviceSelected,
        usersOfDevice: usersOfDeviceUpdated,
      });

      return alertSuccess(
        "Rol del usuario en el dispositivo actualizado exitosamente",
      );
    }
  };

  const addUserToDevice = async (userOfDevice) => {
    const result = await fetchPostOrPutUserOfDevice(userOfDevice, true, "POST");

    if (result) {
      setDeviceSelected({
        ...deviceSelected,
        usersOfDevice: [...deviceSelected.usersOfDevice, userOfDevice],
      });

      return alertSuccess("Usuario vinculado al dispositivo exitosamente");
    }
  };

  return (
    <UserDeviceContext.Provider
      value={{
        deleteUser,
        setDeleteUser,
        setInfoUser,
        infoUser,
        setShowAddUser,
        showAddUser,
        editUser,
        setEditUser,
        loadingForm,
        setLoadingForm,
        addUserToDevice,
        updateUserRoleInDevice,
      }}
    >
      {children}
    </UserDeviceContext.Provider>
  );
};

export const useUserDevice = () => useContext(UserDeviceContext);
