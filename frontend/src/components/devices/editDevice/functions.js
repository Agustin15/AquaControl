import { getAuthTokenSaved } from "../../../securityStorage";
import { alertError, alertSuccess } from "../../alertSwal/alertSwal.js";
const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;

export const fetchUpdateDevice = async (body, updateAccessToken, retry) => {
  try {
    const accessToken = await getAuthTokenSaved("accessToken");
    const response = await fetch(localhostBackend + "/api/device", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401 && retry === true) {
        await updateAccessToken();
        return fetchUpdateDevice(body, updateAccessToken, false);
      }
      throw new Error(result.message);
    }

    if (result) alertSuccess("Nombre del dispositivo actualizado");
    return result;
  } catch (error) {
    const errorMessage =
      error?.message || "No se pudo actualizar el nombre del dispositivo";
    alertError(
      "Algo salio mal al actualizar nombre del dipositivo",
      errorMessage,
    );
  }
};
