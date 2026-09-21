const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;
import Swal from "sweetalert2";
import "../../../../alertSwal/alertSwal.css";
import {
  alertConfirmDelete,
  alertError,
  alertSuccess,
} from "../../../../alertSwal/alertSwal";
import { getAuthTokenSaved } from "../../../../../securityStorage.js";
import { useEffect } from "react";
import { useDevice } from "../../../../../contexts/DeviceContext";
import { useAuth } from "../../../../../contexts/AuthContext";

export const DeleteUser = ({ deleteUser, setDeleteUser }) => {
  const { deviceSelected, setDeviceSelected } = useDevice();
  const { updateAccessToken } = useAuth();

  useEffect(() => {
    const confirmDelete = async () => {
      let title =
        "¿Desea desvincular al usuario " +
        deleteUser.user.username +
        " del dispositivo?";

      const confirmation = await alertConfirmDelete(title);
      if (confirmation.isConfirmed) {
        await fetchDelete(true);
      } else setDeleteUser(null);
      return;
    };

    confirmDelete();
  }, []);

  const fetchDelete = async (retry) => {
    Swal.fire({
      title: `Desvinculando al usuario ${deleteUser.user.username} del dispositivo...`,
      width: 220,
      showConfirmButton: false,
      customClass: {
        title: "titleLoading",
      },
    });

    try {
      const accessToken = await getAuthTokenSaved("accessToken");

      const response = await fetch(
        localhostBackend + "/api/userOfDevice/device/" + deviceSelected.id,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(deleteUser),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401 && retry === true) {
          await updateAccessToken(false);
          return fetchDelete(false);
        }
        throw new Error(result.message);
      }

      if (result) {
        alertSuccess(
          `¡Usuario ${deleteUser.user.username} desvinculado del dispositivo actual exitosamente!`,
        );

        const usersOfDeviceUpdated = deviceSelected.usersOfDevice.filter(
          (ud) => ud.user.id != deleteUser.user.idUser,
        );

        setDeviceSelected({
          ...deviceSelected,
          usersOfDevice: usersOfDeviceUpdated,
        });
      }
    } catch (error) {
      const errorMessage =
        error?.message ||
        "No se pudo desvincular el usuario seleccionado del dispositivo";
      alertError(`Ups algo salio mal`, errorMessage);
    } finally {
      return;
    }
  };
};
