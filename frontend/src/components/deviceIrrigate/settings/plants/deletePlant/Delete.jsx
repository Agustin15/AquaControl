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
import { usePlant } from "../../../../../contexts/PlantContext.jsx";

export const Delete = ({}) => {
  const { updateAccessToken } = useAuth();
  const { setDeletePlant, deletePlant, getPlants } = usePlant();

  useEffect(() => {
    const handleDelete = async () => {
      const result = await alertConfirmDelete(
        "¿Desea eliminar el registro de la planta N° " + deletePlant.id + "?",
      );

      if (result.isConfirmed == true) {
        await fetchDelete(true);
      } else setDeletePlant(null);
    };

    handleDelete();
  }, []);

  const fetchDelete = async (retry) => {
    Swal.fire({
      title: "Eliminando planta...",
      width: 220,
      showConfirmButton: false,
      customClass: {
        title: "titleLoading",
      },
    });

    try {
      const accessToken = await getTokenSaved("accessToken");

      const response = await fetch(localhostBackend + "/api/plant", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(deletePlant),
      });

      if (response.status === 401 && retry == true) {
        await updateAccessToken();
        return fetchDelete(false);
      }
      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      alertSuccess(
        `¡Planta N° ${deletePlant.id} eliminada exitosamente!`,
      );

      await getPlants();
    } catch (error) {
      alertError(
        `Ups algo salio mal al eliminar la planta N° ${deletePlant.id}`,
        error,
      );
    }
  };
};
