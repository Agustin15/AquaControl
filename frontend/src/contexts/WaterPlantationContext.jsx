import { createContext, useContext, useEffect, useState } from "react";
import { getAuthTokenSaved } from "../securityStorage.js";
import { useAuth } from "./AuthContext.jsx";
import { useDevice } from "./deviceContext/DeviceContext.jsx";
import { useMqtt } from "./MqttContext.jsx";
const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;

const WaterPlantationContext = createContext();

export const WaterPlantationProvider = ({ children }) => {
  const [pages, setPages] = useState(null);
  const [index, setIndex] = useState(1);
  const [waterPlantationLogs, setWaterPlantationLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [errorWaterPlantation, setErrorWaterPlantation] = useState(null);
  const [lastWaterPlantation, setLastWaterPlantation] = useState(null);

  const { tankLiveSelected, plantationLiveSelected } = useMqtt();
  const { deviceSelected } = useDevice();
  const { updateAccessToken } = useAuth();

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
      `/api/waterPlantationLog/tank/${tankLiveSelected.id}/plantation/${plantationLiveSelected.id}` +
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
        error?.message ||
        "No se pudo obtener el estado de la última irrigación";
      setErrorWaterPlantation(errorMessage);
    }
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
        fetchGetLastWaterPlantation,
        lastWaterPlantation,
      }}
    >
      {children}
    </WaterPlantationContext.Provider>
  );
};
export const useWaterPlantation = () => useContext(WaterPlantationContext);
