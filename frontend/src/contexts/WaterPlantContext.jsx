import { createContext, useContext, useState } from "react";
import { getTokenSaved } from "../securityStorage.js";
import { useAuth } from "./AuthContext";
const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;

const WaterPlantContext = createContext();

export const WaterPlantProvider = ({ children }) => {
  const [pages, setPages] = useState(null);
  const [index, setIndex] = useState(1);
  const [waterPlantLogs, setWaterPlantLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [errorWaterPlant, setErrorWaterPlant] = useState(null);
  const { updateAccessToken } = useAuth();

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
      }}
    >
      {children}
    </WaterPlantContext.Provider>
  );
};
export const useWaterPlant = () => useContext(WaterPlantContext);
