import { createContext, useContext, useEffect, useState } from "react";
import { getAuthTokenSaved } from "../securityStorage.js";
import { useAuth } from "./AuthContext.jsx";
import { useDevice } from "./DeviceContext.jsx";
import { useTank } from "./tankContext/TankContext.jsx";
import { usePlantation } from "./plantationContext/PlantationContext.jsx";
import { useMqtt } from "./MqttContext.jsx";
import { alertWarning } from "../components/alertSwal/alertSwal.js";
const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;

const WaterPlantationContext = createContext();

export const WaterPlantationProvider = ({ children }) => {
  const [pages, setPages] = useState(null);
  const [index, setIndex] = useState(1);
  const [waterPlantationLogs, setWaterPlantationLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [errorWaterPlantation, setErrorWaterPlantation] = useState(null);
  const [waterPlantationInProgress, setWaterPlantationInProgress] =
    useState(false);
  const [lastWaterPlantation, setLastWaterPlantation] = useState(null);
  const { deviceSelected } = useDevice();
  const { tankSelected } = useTank();
  const { plantationSelected } = usePlantation();
  const { updateAccessToken } = useAuth();
  const { mqttClient } = useMqtt();

  useEffect(() => {
    if (!deviceSelected || !mqttClient.connected) return;
    mqttClient.subscribe(
      `device/${deviceSelected.id}/waterPlantation`,
      { qos: 2 },
      (error) => {
        if (!error) {
          getStateWaterPlantation();
        }
      },
    );
  }, [mqttClient.connected, deviceSelected]);

  const fetchGetLogs = async (idTank, idPlantation, offset, retry) => {
    setErrorWaterPlantation(null);
    setWaterPlantationLogs([]);

    if (!loadingLogs) setLoadingLogs(true);

    let url =
      localhostBackend +
      `/api/waterPlantationLog/tank/${idTank}/plantation/${idPlantation}/device/${deviceSelected.id}/pagination/${offset}`;

    try {
      const accessToken = await getAuthTokenSaved("accessToken");

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401 && retry === true) {
          await updateAccessToken();
          return fetchGetLogs(idTank, idPlantation, offset, false);
        }
        throw new Error(result.message);
      }

      if (result) {
        setWaterPlantationLogs(result.waterPlantationLogs);
        setPages(result.pages);
      }
    } catch (error) {
      const errorMessage =
        error?.message || "No se pudieron cargar los registros de riego";
      setErrorWaterPlantation(errorMessage);
    } finally {
      setLoadingLogs(false);
    }
  };

  const fetchGetLastWaterPlantation = async (retry) => {
    let url =
      localhostBackend +
      `/api/waterPlantationLog/tank/${tankSelected.id}/plantation/${plantationSelected.id}` +
      `/device/${deviceSelected.id}/lastWaterPlantationLog`;

    try {
      const accessToken = await getAuthTokenSaved("accessToken");

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401 && retry === true) {
          await updateAccessToken();
          return fetchGetLastWaterPlantation(false);
        }
        throw new Error(result.message);
      }

      if (result) {
        setLastWaterPlantation(result);
      }
    } catch (error) {
      const errorMessage =
        error?.message || "No se pudo obtener el estado de la última irrigación";
      setErrorWaterPlantation(errorMessage);
    }
  };

  const getStateWaterPlantation = async () => {
    mqttClient.on("message", async (topic, message) => {
      if (topic != `device/${deviceSelected.id}/waterPlantation`) return;
      const { state } = JSON.parse(message.toString());

      if (state == "En curso" && !waterPlantationInProgress) {
        setWaterPlantationInProgress(true);
      } else setWaterPlantationInProgress(false);

      await fetchGetLastWaterPlantation();
    });
  };

  const sendStartWaterPlantation = async () => {
    const result = await mqttClient.publishAsync(
      `device/${deviceSelected.id}/waterPlantation`,
      JSON.stringify({
        idPlantation: plantationSelected.id,
        idTank: tankSelected.id,
        state: "En curso",
      }),
      { qos: 2, retain: true },
    );

    if (!result)
      return alertWarning(
        "Ups,la conexion con el sistema de riego no se pudo establecer",
      );

    setWaterPlantationInProgress(true);
  };

  const sendStopWaterPlantation = async () => {
    const result = await mqttClient.publishAsync(
      `device/${deviceSelected.id}/waterPlantation`,
      JSON.stringify({
        idPlantation: plantationSelected.id,
        idTank: tankSelected.id,
        state: "Interrumpido",
      }),
      { qos: 2, retain: true },
    );

    if (!result)
      return alertWarning(
        "Ups,la conexion con el sistema de riego no se pudo establecer",
      );

    setWaterPlantationInProgress(false);
  };

  return (
    <WaterPlantationContext.Provider
      value={{
        fetchGetLogs,
        loadingLogs,
        errorWaterPlantation,
        waterPlantationLogs,
        setWaterPlantationLogs,
        pages,
        setIndex,
        index,
        sendStartWaterPlantation,
        sendStopWaterPlantation,
        waterPlantationInProgress,
        fetchGetLastWaterPlantation,
        lastWaterPlantation,
      }}
    >
      {children}
    </WaterPlantationContext.Provider>
  );
};
export const useWaterPlantation = () => useContext(WaterPlantationContext);
