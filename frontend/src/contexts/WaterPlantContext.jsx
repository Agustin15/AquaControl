import { createContext, useContext, useEffect, useState } from "react";
import { getTokenSaved } from "../securityStorage.js";
import { useAuth } from "./AuthContext";
import { useDevice } from "./DeviceContext.jsx";
import { useTank } from "./TankContext.jsx";
import { usePlant } from "./PlantContext.jsx";
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
  const { deviceSelected } = useDevice();
  const { tankSelected } = useTank();
  const { plantSelected } = usePlant();
  const { updateAccessToken } = useAuth();
  const { mqttClient } = useMqtt();

  useEffect(() => {
    console.log(mqttClient.connected);
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

    const accessToken = await getTokenSaved("accessToken");

    let url =
      localhostBackend +
      `/api/waterPlantLog/tank/${idTank}/plant/${idPlant}/pagination/${offset}`;

    try {
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

  const getStateWaterPlant = async () => {
    mqttClient.on("message", (topic, message) => {
      if (topic != `device/${deviceSelected.id}/waterPlant`) return;
      const { state } = JSON.parse(message.toString());
      if (state == "En curso" && !waterPlantInProgress)
        setWaterPlantInProgress(true);
      else setWaterPlantInProgress(false);
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
      return alertWarning("Ups,no se pudo conectar con el sistema de riego");

    setWaterPlantInProgress(true);
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
        waterPlantInProgress,
      }}
    >
      {children}
    </WaterPlantContext.Provider>
  );
};
export const useWaterPlant = () => useContext(WaterPlantContext);
