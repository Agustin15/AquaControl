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
import { usePlantation } from "../../../../../contexts/plantationContext/PlantationContext.jsx";

export const Delete = ({}) => {
  const { updateAccessToken } = useAuth();
  const { setDeletePlantation, deletePlantation, getPlantations } = usePlantation();

  useEffect(() => {
    const handleDelete = async () => {
      const result = await alertConfirmDelete(
        "¿Desea eliminar el registro de la plantacion N° " + deletePlantation.id + "?",
      );

      if (result.isConfirmed == true) {
        await fetchDelete(true);
      } else setDeletePlantation(null);
    };

    handleDelete();
  }, []);

  const fetchDelete = async (retry) => {
    Swal.fire({
      title: "Eliminando plantacion...",
      width: 220,
      showConfirmButton: false,
      customClass: {
        title: "titleLoading",
      },
    });

    try {
      const accessToken = await getTokenSaved("accessToken");

      const response = await fetch(localhostBackend + "/api/plantation", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(deletePlantation),
      });

      if (response.status === 401 && retry == true) {
        await updateAccessToken();
        return fetchDelete(false);
      }
      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      alertSuccess(
        `¡Plantationa N° ${deletePlantation.id} eliminada exitosamente!`,
      );

      await getPlantations();
    } catch (error) {
      alertError(
        `Ups algo salio mal al eliminar la plantationa N° ${deletePlantation.id}`,
        error,
      );
    }
  };
};
