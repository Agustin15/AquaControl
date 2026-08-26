import { createContext, useContext, useEffect, useState } from "react";
import { getTokenSaved } from "../securityStorage.js";
import { useAuth } from "./AuthContext";
import { useDevice } from "./DeviceContext.jsx";
import { useTank } from "./tankContext/TankContext.jsx";
import { usePlant } from "./plantContext/PlantContext.jsx";
import { useMqtt } from "./MqttContext.jsx";
import { alertWarning } from "../components/alertSwal/alertSwal.js";
const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;

const WaterPlantContext = createContext();

export const WaterPlantProvider = ({ children }) => {
  const [pages, setPages] = useState(null);
  const [index, setIndex] = useState(1);
  const [waterPlantLogs, setWaterPlantLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [errorWaterPlant, setErrorWaterPlant] = useState(null);
  const [waterPlantInProgress, setWaterPlantInProgress] = useState(false);
  const [lastWaterPlant, setLastWaterPlant] = useState(null);
  const { deviceSelected } = useDevice();
  const { tankSelected } = useTank();
  const { plantSelected } = usePlant();
  const { updateAccessToken } = useAuth();
  const { mqttClient } = useMqtt();

  useEffect(() => {
    if (!deviceSelected || !mqttClient.connected) return;
    mqttClient.subscribe(
      `device/${deviceSelected.id}/waterPlant`,
      { qos: 2 },
      (error) => {
        if (!error) {
          getStateWaterPlant();
        }
      },
    );
  }, [mqttClient.connected, deviceSelected]);

  const fetchGetLogs = async (idTank, idPlant, offset, retry) => {
    setErrorWaterPlant(null);
    setWaterPlantLogs([]);

    if (!loadingLogs) setLoadingLogs(true);

    let url =
      localhostBackend +
      `/api/waterPlantLog/tank/${idTank}/plant/${idPlant}/pagination/${offset}`;

    try {
      const accessToken = await getTokenSaved("accessToken");

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401 && retry == true) {
        await updateAccessToken();
        return fetchGetLogs(idTank, idPlant, offset, false);
      }
      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      if (result) {
        setWaterPlantLogs(result.waterPlantLogs);
        setPages(result.pages);
      }
    } catch (error) {
      setErrorWaterPlant(error.message);
    } finally {
      setLoadingLogs(false);
    }
  };

  const fetchGetLastWaterPlant = async (retry) => {
    let url =
      localhostBackend +
      `/api/waterPlantLog/tank/${tankSelected.id}/plant/${plantSelected.id}/lastWaterPlantLog`;

    try {
      const accessToken = await getTokenSaved("accessToken");

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await response.json();

      if (response.status == 401 && retry == true) {
        await updateAccessToken();
        return fetchGetLastWaterPlant(true);
      }

      if (!response.ok) throw new Error(result.message);

      if (result) {
        setLastWaterPlant(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getStateWaterPlant = async () => {
    mqttClient.on("message", async (topic, message) => {
      if (topic != `device/${deviceSelected.id}/waterPlant`) return;
      const { state } = JSON.parse(message.toString());

      if (state == "En curso" && !waterPlantInProgress) {
        setWaterPlantInProgress(true);
      } else setWaterPlantInProgress(false);

      await fetchGetLastWaterPlant();
    });
  };

  const sendStartWaterPlant = async () => {
    const result = await mqttClient.publishAsync(
      `device/${deviceSelected.id}/waterPlant`,
      JSON.stringify({
        idPlant: plantSelected.id,
        idTank: tankSelected.id,
        state: "En curso",
      }),
      { qos: 2, retain: true },
    );

    if (!result)
      return alertWarning(
        "Ups,la conexion con el sistema de riego no se pudo establecer",
      );

    setWaterPlantInProgress(true);
  };

  const sendStopWaterPlant = async () => {
    const result = await mqttClient.publishAsync(
      `device/${deviceSelected.id}/waterPlant`,
      JSON.stringify({
        state: "Interrumpido",
      }),
      { qos: 2, retain: true },
    );

    if (!result)
      return alertWarning(
        "Ups,la conexion con el sistema de riego no se pudo establecer",
      );

    setWaterPlantInProgress(false);
  };

  return (
    <WaterPlantContext.Provider
      value={{
        fetchGetLogs,
        loadingLogs,
        errorWaterPlant,
        waterPlantLogs,
        setWaterPlantLogs,
        pages,
        setIndex,
        index,
        sendStartWaterPlant,
        sendStopWaterPlant,
        waterPlantInProgress,
        fetchGetLastWaterPlant,
        lastWaterPlant,
      }}
    >
      {children}
    </WaterPlantContext.Provider>
  );
};
export const useWaterPlant = () => useContext(WaterPlantContext);
