import { PushNotifications } from "@capacitor/push-notifications";
import { Device } from "@capacitor/device";
import { getTokenSaved } from "../securityStorage.js";
import { useAuth } from "./AuthContext.jsx";
import { createContext, useContext, useState } from "react";
import { alertError } from "../components/alertSwal/alertSwal.js";
const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;

const UserDevicesTokensContext = createContext();

export const UserDevicesTokensProvider = ({ children }) => {
  const { updateAccessToken, userAuth } = useAuth();
  const [notificationReceived, setNotificationReceived] = useState(null);

  const registerNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive != "granted") return;

    const permision = await PushNotifications.requestPermissions();

    if (permision.receive == "granted") {
      await PushNotifications.register();

      PushNotifications.addListener("registration", async (token) => {
        const idMobileDevice = await Device.getId();

        try {
          await verifyIfExistsUserDeviceToken(
            idMobileDevice.identifier,
            token.value,
            true,
          );
        } catch (error) {
          alertError(
            "Ups algo salio mal",
            "No se pudieron activar las notificaciones push",
          );
          return;
        }
      });

      getNotificationReceived();
    }
  };

  const getNotificationReceived = () => {
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        setNotificationReceived(notification);
      },
    );
  };

  const verifyIfExistsUserDeviceToken = async (
    idMobileDevice,
    token,
    retry,
  ) => {
    try {
      const accessToken = await getTokenSaved("accessToken");

      const response = await fetch(localhostBackend + "/api/userDeviceToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          idUserDevice: idMobileDevice,
          user: userAuth,
          token: token,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401 && retry) {
          await updateAccessToken();
          await verifyIfExistsUserDeviceToken(idMobileDevice, token, false);
        }
        throw new Error(result.message);
      }
    } catch (error) {
      throw new Error(
        error.message ||
          "Error al actualizar o agregar el token del dispositivo móvil",
      );
    }
  };

  return (
    <UserDevicesTokensContext.Provider
      value={{
        notificationReceived,
        setNotificationReceived,
        registerNotifications,
      }}
    >
      {children}
    </UserDevicesTokensContext.Provider>
  );
};

export const useUserDevicesTokens = () => useContext(UserDevicesTokensContext);
