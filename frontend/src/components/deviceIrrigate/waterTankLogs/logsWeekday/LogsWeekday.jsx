import styles from "./LogsWeekday.module.css";
import iconLogs from "../../../../assets/img/noTanks.png";
import { useEffect, useState } from "react";
import { useWeekdayLogs } from "../../../../contexts/LogsWeekdayContext";
import { Weekdays } from "../../weekdays/Weekdays.jsx";
import { Logs } from "../logs/Logs.jsx";
const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;

export const LogsWeekday = () => {
  const {
    getWeekdayLogs,
    weekdayLogs,
    loadingLogs,
    errorWeekdayLogs,
    setErrorWeekdayLogs,
    weekdaySelected,
    getDateOfWeekdaySelected,
  } = useWeekdayLogs();

  const [waterTanksLogsByDay, setWaterTanksLogsByDay] = useState([]);

  useEffect(() => {
    if (!weekdayLogs) return;
    getWaterTanksLogsByWeekday();
  }, [weekdayLogs, weekdaySelected]);

  const getWaterTanksLogsByWeekday = () => {
    setWaterTanksLogsByDay([]);
    setErrorWeekdayLogs();

    const result = weekdayLogs.filter(
      (log) =>
        new Date(log.waterTankLog.datetimeLog).getDay() + 1 == weekdaySelected,
    );

    if (result.length == 0)
      setErrorWeekdayLogs("No se encontraron monitoreos de agua en este dia");
    else setWaterTanksLogsByDay(result);
  };

  return (
    <div className={styles.containLogsWeekday}>
      <div className={styles.containLogs}>
        <h3>{getDateOfWeekdaySelected()}</h3>
        {loadingLogs && (
          <div className={styles.loading}>
            <span className={styles.loader}></span>
            <p>Cargando datos</p>
          </div>
        )}

        {!loadingLogs && errorWeekdayLogs && (
          <div className={styles.noLogs}>
            <img src={iconLogs}></img>
            <p>{errorWeekdayLogs}</p>
          </div>
        )}

        {!loadingLogs && waterTanksLogsByDay.length > 0 && (
          <Logs waterTanksLogsByDay={waterTanksLogsByDay} />
        )}
      </div>

      <Weekdays />
    </div>
  );
};
