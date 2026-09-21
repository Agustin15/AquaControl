import { createContext, useContext, useEffect, useState } from "react";
import { getAuthTokenSaved } from "../../securityStorage.js";
import { useAuth } from "../AuthContext";
import { useMqtt } from "../MqttContext.jsx";
import { useDevice } from "../DeviceContext.jsx";
const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;

const TankContext = createContext();

export const TankProvider = ({ children }) => {
  const [tankSelected, setTankSelected] = useState(null);
  const [tanks, setTanks] = useState([]);
  const [currentLevelTank, setCurrentLevelTank] = useState(0);
  const [loadingTanks, setLoadingTanks] = useState(false);
  const [errorTanks, setErrorTanks] = useState();
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [editTank, setEditTank] = useState(null);
  const [deleteTank, setDeleteTank] = useState(null);

  const { mqttClient } = useMqtt();
  const { updateAccessToken } = useAuth();
  const { deviceSelected } = useDevice();

  useEffect(() => {
    if (!tankSelected || !mqttClient.connected) return;

    mqttClient.subscribe(
      `device/${deviceSelected.id}/tank/${tankSelected.id}/waterLevel`,
      { qos: 0 },
      (error) => {
        if (!error) {
          getLiveReloadWaterLevel();
        }
      },
    );
  }, [mqttClient.connected, tankSelected]);

  const fetchGet = async (url, retry) => {
    setErrorTanks();
    setLoadingTanks(true);

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
          return fetchGet(url, false);
        }
        throw new Error(result.message);
      }

      return result;
    } catch (error) {
      const errorMessage =
        error?.message || "No se pudieron cargar los tanques";
      setErrorTanks(errorMessage);
    } finally {
      setLoadingTanks(false);
    }
  };

  const getTanks = async () => {
    setTanks([]);
    const tanks = await fetchGet(
      `${localhostBackend}/api/tank/device/${deviceSelected.id}`,
      true,
    );
    if (tanks) setTanks(tanks);
    return tanks;
  };

  const getLiveReloadWaterLevel = () => {
    mqttClient.on("message", (topic, message) => {
      if (
        topic !=
        `device/${deviceSelected.id}/tank/${tankSelected.id}/waterLevel`
      )
        return;

      const { waterLevel } = JSON.parse(message.toString());

      setCurrentLevelTank(waterLevel);
    });
  };

  return (
    <TankContext.Provider
      value={{
        tanks,
        loadingTanks,
        errorTanks,
        getTanks,
        showFormAdd,
        setShowFormAdd,
        editTank,
        setEditTank,
        deleteTank,
        setDeleteTank,
        getLiveReloadWaterLevel,
        currentLevelTank,
        tankSelected,
        setTankSelected,
      }}
    >
      {children}
    </TankContext.Provider>
  );
};

export const useTank = () => useContext(TankContext);
