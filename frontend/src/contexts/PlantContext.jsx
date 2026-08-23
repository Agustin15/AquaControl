import { createContext, useContext, useEffect, useState } from "react";
import { useDevice } from "./DeviceContext";
import { useAuth } from "./AuthContext";
import { useMqtt } from "./MqttContext.jsx";
import { getTokenSaved } from "../securityStorage.js";
const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;

const PlantContext = createContext();

export const PlantProvider = ({ children }) => {
  const [plants, setPlants] = useState([]);
  const [loadingPlants, setLoadingPlants] = useState(false);
  const [errorPlants, setErrorPlants] = useState();
  const [currentHumidityPlant, setCurrentHumidityPlant] = useState(0);
  const [plantSelected, setPlantSelected] = useState(null);
  const [addPlant, setAddPlant] = useState(false);
  const [infoPlant, setInfoPlant] = useState(null);
  const [editPlant, setEditPlant] = useState(null);
  const [deletePlant, setDeletePlant] = useState(null);
  const [valuesForm, setValuesForm] = useState({
    id: 0,
    image: null,
    umbralHumidity: 0,
    description: "",
  });
  const [loadingForm, setLoadingForm] = useState(false);
  const [errorsForm, setErrorsForm] = useState({
    image: "",
    umbralHumidity: "",
    description: "",
  });

  const { mqttClient } = useMqtt();
  const { updateAccessToken } = useAuth();
  const { deviceSelected } = useDevice();

  useEffect(() => {
    if (!plantSelected || !mqttClient.connected) return;

    mqttClient.subscribe(
      `device/${deviceSelected.id}/plant/${plantSelected.id}/humidity`,
      { qos: 0 },
      (error) => {
        if (!error) {
          getLiveReloadHumidityPlant();
        }
      },
    );
  }, [mqttClient.connected, plantSelected]);

  const fetchGet = async (url, retry) => {
    setErrorPlants();
    setLoadingPlants(true);

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
      setErrorPlants(error.message);
    } finally {
      setLoadingPlants(false);
    }
  };

  const fetchPostOrPut = async (method, retry) => {
    setLoadingForm(true);
    try {
      const accessToken = await getTokenSaved("accessToken");

      const response = await fetch(localhostBackend + "/api/plant", {
        method: method,
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(valuesForm),
      });

      if (response.status === 401 && retry == true) {
        await updateAccessToken();
        return fetchPostOrPut(method, false);
      }
      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoadingForm(false);
    }
  };

  const getPlants = async () => {
    setPlants([]);
    const plants = await fetchGet(localhostBackend + "/api/plant", true);
    if (plants) setPlants(plants);
    return plants;
  };

  const getLiveReloadHumidityPlant = () => {
    mqttClient.on("message", (topic, message) => {
      if (
        topic !=
        `device/${deviceSelected.id}/plant/${plantSelected.id}/humidity`
      )
        return;

      const { humidity } = JSON.parse(message.toString());

      setCurrentHumidityPlant(humidity);
    });
  };

  return (
    <PlantContext.Provider
      value={{
        plants,
        loadingPlants,
        errorPlants,
        getPlants,
        fetchPostOrPut,
        setAddPlant,
        addPlant,
        setEditPlant,
        editPlant,
        infoPlant,
        setInfoPlant,
        deletePlant,
        setDeletePlant,
        valuesForm,
        setValuesForm,
        errorsForm,
        setErrorsForm,
        loadingForm,
        getLiveReloadHumidityPlant,
        currentHumidityPlant,
        plantSelected,
        setPlantSelected,
      }}
    >
      {children}
    </PlantContext.Provider>
  );
};

export const usePlant = () => useContext(PlantContext);
