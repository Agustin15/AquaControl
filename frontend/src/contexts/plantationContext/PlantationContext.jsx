import { createContext, useContext, useEffect, useState } from "react";
import { useDevice } from "../DeviceContext.jsx";
import { useAuth } from "../AuthContext.jsx";
import { useMqtt } from "../MqttContext.jsx";
import { getTokenSaved } from "../../securityStorage.js";
const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;

const PlantationContext = createContext();

export const PlantationProvider = ({ children }) => {
  const [plantations, setPlantations] = useState([]);
  const [loadingPlantations, setLoadingPlantations] = useState(false);
  const [errorPlantations, setErrorPlantations] = useState();
  const [currentHumidityPlantation, setCurrentHumidityPlantation] = useState(0);
  const [plantationSelected, setPlantationSelected] = useState(null);
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [infoPlantation, setInfoPlantation] = useState(null);
  const [editPlantation, setEditPlantation] = useState(null);
  const [deletePlantation, setDeletePlantation] = useState(null);

  const [errorLoadCrops, setErrorLoadCrops] = useState("");
  const [cropsTypes, setCropsTypes] = useState([]);

  const { mqttClient } = useMqtt();
  const { updateAccessToken } = useAuth();
  const { deviceSelected } = useDevice();

  useEffect(() => {
    if (!plantationSelected || !mqttClient.connected) return;

    mqttClient.subscribe(
      `device/${deviceSelected.id}/plantation/${plantationSelected.id}/humidity`,
      { qos: 0 },
      (error) => {
        if (!error) {
          getLiveReloadHumidityPlantation();
        }
      },
    );
  }, [mqttClient.connected, plantationSelected]);

  const fetchGet = async (url, retry) => {
    setErrorPlantations();
    setLoadingPlantations(true);

    try {
      const accessToken = await getTokenSaved("accessToken");

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401 && retry == true) {
        await updateAccessToken();
        return fetchGet(url, false);
      }
      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      return result;
    } catch (error) {
      setErrorPlantations(error.message);
    } finally {
      setLoadingPlantations(false);
    }
  };

  const getPlantations = async () => {
    setPlantations([]);
    const plantations = await fetchGet(
      localhostBackend + "/api/plantation",
      true,
    );
    if (plantations) setPlantations(plantations);
    return plantations;
  };

  const getLiveReloadHumidityPlantation = () => {
    mqttClient.on("message", (topic, message) => {
      if (
        topic !=
        `device/${deviceSelected.id}/plantation/${plantationSelected.id}/humidity`
      )
        return;

      const { humidity } = JSON.parse(message.toString());

      setCurrentHumidityPlantation(humidity);
    });
  };

  const loadCropsTypes = async (retry) => {
    try {
      const accessToken = await getTokenSaved("accessToken");

      const response = await fetch(localhostBackend + "/api/cropType", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401 && retry) {
          await updateAccessToken();
          await loadCropsTypes(false);
        }
        throw new Error(result.message);
      }

      if (result) setCropsTypes(result);
    } catch (error) {
      setErrorLoadCrops(error.message);
    }
  };

  return (
    <PlantationContext.Provider
      value={{
        plantations,
        loadingPlantations,
        errorPlantations,
        getPlantations,
        loadCropsTypes,
        errorLoadCrops,
        cropsTypes,
        setShowFormAdd,
        showFormAdd,
        setEditPlantation,
        editPlantation,
        infoPlantation,
        setInfoPlantation,
        deletePlantation,
        setDeletePlantation,
        getLiveReloadHumidityPlantation,
        currentHumidityPlantation,
        plantationSelected,
        setPlantationSelected,
      }}
    >
      {children}
    </PlantationContext.Provider>
  );
};

export const usePlantation = () => useContext(PlantationContext);
