const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;
import Swal from "sweetalert2";
import "../../../../alertSwal/alertSwal.css";
import {
  alertConfirmDelete,
  alertSuccess,
  alertError,
} from "../../../../alertSwal/alertSwal.js";
import { getTokenSaved } from "../../../../../securityStorage.js";
import { useEffect } from "react";
import { useAuth } from "../../../../../contexts/AuthContext.jsx";
import { useTank } from "../../../../../contexts/tankContext/TankContext.jsx";

export const Delete = ({}) => {
  const { updateAccessToken } = useAuth();
  const { setDeleteTank, deleteTank, getTanks } = useTank();

  useEffect(() => {
    const handleDelete = async () => {
      const result = await alertConfirmDelete(
        "¿Desea eliminar el tanque N° " + deleteTank.id + "?",
      );

      if (result.isConfirmed == true) {
        await fetchDelete(true);
      } else setDeleteTank(null);
    };

    handleDelete();
  }, []);

  const fetchDelete = async (retry) => {
    Swal.fire({
      title: "Eliminando tanque...",
      width: 220,
      showConfirmButton: false,
      customClass: {
        title: "titleLoading",
      },
    });

    try {
      const accessToken = await getTokenSaved("accessToken");

      const response = await fetch(localhostBackend + "/api/tank", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(deleteTank),
      });

      if (response.status === 401 && retry == true) {
        await updateAccessToken();
        return fetchDelete(false);
      }
      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      alertSuccess(`¡Tanque N° ${deleteTank.id} eliminado exitosamente!`);

      await getTanks();
    } catch (error) {
      alertError(
        `Ups algo salio mal al eliminar tanque N° ${deleteTank.id}`,
        error,
      );
    } finally {
      return;
    }
  };
};
