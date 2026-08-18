const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;
import {
  alertConfirmDelete,
  alertSuccess,
  alertError,
} from "../../alertSwal/alertSwal.js";
import { getTokenSaved } from "../../../securityStorage.js";
import { useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { useDevice } from "../../../contexts/DeviceContext.jsx";

export const DeleteDevice = ({ setDeleteDevice, deleteDevice }) => {
  const { updateAccessToken } = useAuth();
  const { getUserDevices } = useDevice();

  useEffect(() => {
    const handleDeleteDevice = async () => {
      const result = await alertConfirmDelete(
        "¿Desea eliminar el dispositivo de riego " +
          deleteDevice.placeName +
          "?",
      );

      if (result.isConfirmed == true) {
        await fetchDelete(true);
      } else setDeleteDevice(null);
    };

    handleDeleteDevice();
  }, []);

  const fetchDelete = async (retry) => {
    try {
      const accessToken = await getTokenSaved("accessToken");

      const response = await fetch(localhostBackend + "/api/device", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(deleteDevice),
      });

      if (response.status === 401 && retry == true) {
        await updateAccessToken();
        return fetchDelete(false);
      }
      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      alertSuccess(
        `¡Dispositivo de riego ${deleteDevice.placeName} eliminado exitosamente!`,
      );

      await getUserDevices();
    } catch (error) {
      alertError(
        `Ups algo salio mal al eliminar el dispositivo de riego ${deleteDevice.placeName}`,
        error,
      );
    }
  };
};
