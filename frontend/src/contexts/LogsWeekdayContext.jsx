import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { getTokenSaved } from "../securityStorage.js";
const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;

const LogsWeekdayContext = createContext();

export const LogsWeekdayProvider = ({ children }) => {
  const [weekdayLogs, setWeekdayLogs] = useState(null);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [errorWeekdayLogs, setErrorWeekdayLogs] = useState();
  const [weekdaySelected, setWeekdaySelected] = useState(
    new Date().getDay() + 1,
  );
  const { updateAccessToken } = useAuth();

  const weekdays = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
  ];

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const fetchGet = async (url, retry) => {
    setErrorWeekdayLogs();
    setLoadingLogs(true);

    try {
      const accessToken = await getTokenSaved("accessToken");

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status == 401 && retry == true) {
        await updateAccessToken();
        return fetchGet(url, false);
      }

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);
      return result;
    } catch (error) {
      setErrorWeekdayLogs(error.message);
    } finally {
      setLoadingLogs(false);
    }
  };

  const getWeekdayLogs = async (endpoint) => {
    setWeekdayLogs(null);
    const logs = await fetchGet(localhostBackend + endpoint, true);
    if (logs) setWeekdayLogs(logs);
    return logs;
  };

  const formatHour = (datetime) => {
    const hour =
      datetime.getHours() < 10
        ? "0" + datetime.getHours()
        : datetime.getHours();

    const minutes =
      datetime.getHours() < 10
        ? "0" + datetime.getMinutes()
        : datetime.getMinutes();

    return hour + ":" + minutes;
  };

  const formatDay = (datetime) => {
    const weekday = weekdays.at(datetime.getDay());
    const day = datetime.getDate();
    const month = months.at(datetime.getMonth());

    return weekday + ", " + day + " de " + month;
  };

  const getDateOfWeekdaySelected = () => {
    const currentDate = new Date();

    const firstWeekday = currentDate.setDate(
      currentDate.getDate() - currentDate.getDay(),
    );

    const dateOfFirstWeekday = new Date(firstWeekday);

    const dateOfWeekdaySelected = new Date(
      dateOfFirstWeekday.setDate(
        dateOfFirstWeekday.getDate() + weekdaySelected - 1,
      ),
    );

    return formatDay(dateOfWeekdaySelected);
  };

  return (
    <LogsWeekdayContext.Provider
      value={{
        getWeekdayLogs,
        weekdayLogs,
        loadingLogs,
        errorWeekdayLogs,
        setErrorWeekdayLogs,
        weekdays,
        weekdaySelected,
        setWeekdaySelected,
        formatHour,
        getDateOfWeekdaySelected,
      }}
    >
      {children}
    </LogsWeekdayContext.Provider>
  );
};

export const useWeekdayLogs = () => useContext(LogsWeekdayContext);
