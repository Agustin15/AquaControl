const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;
import { getAuthTokenSaved } from "../../../securityStorage.js";
import { alertError } from "../../alertSwal/alertSwal.js";

export const validation = (valuesForm) => {
  const errorsForm = {
    wifi: "",
    wifiPassword: "",
    location: "",
  };

  if (valuesForm.wifi.length == 0)
    errorsForm.wifi = "Red WIFI no puede estar vacia";

  if (valuesForm.wifiPassword.length == 0)
    errorsForm.wifiPassword = "Contraseña de red wifi no puede estar vacia";

  if (
    /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+,\s*[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(
      valuesForm.location,
    ) == false
  )
    errorsForm.location = "Formato de ubicacion debe ser Ciudad,Pais";

  return errorsForm;
};

export const fetchUpdateDevice = async (
  deviceToLink,
  valuesForm,
  updateAccessToken,
  retry,
) => {
  try {
    const accessToken = await getAuthTokenSaved("accessToken");
    const response = await fetch(localhostBackend + "/api/device", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        ...deviceToLink,
        location: valuesForm.location,
        linked: true,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401 && retry === true) {
        await updateAccessToken();
        return fetchUpdateDevice(deviceToLink, valuesForm, updateAccessToken, false);
      }
      throw new Error(result.message);
    }

    return result;
  } catch (error) {
    const errorMessage =
      error?.message || "No se pudo vincular el dispositivo";
    alertError("Algo salio mal al vincular dispositivo", errorMessage);
  }
};
