import styles from "./LogsWeekday.module.css";
import iconLogs from "../../../../assets/img/noHumidityLogs.png";
import { useEffect, useState } from "react";
import { useWeekdayLogs } from "../../../../contexts/LogsWeekdayContext";
import { Weekdays } from "../../weekdays/Weekdays.jsx";
import { Logs } from "../logs/Logs.jsx";

export const LogsWeekday = () => {
  const {
    weekdayLogs,
    loadingLogs,
    errorWeekdayLogs,
    setErrorWeekdayLogs,
    weekdaySelected,
    getDateOfWeekdaySelected,
  } = useWeekdayLogs();

  const [humidityPlantationLogsByDay, setHumidityPlantationLogsByDay] = useState([]);

  useEffect(() => {
    if (!weekdayLogs) return;
    getHumidityPlantationLogsByWeekday();
  }, [weekdayLogs, weekdaySelected]);

  const getHumidityPlantationLogsByWeekday = () => {
    setHumidityPlantationLogsByDay([]);
    setErrorWeekdayLogs();

    const result = weekdayLogs.filter(
      (log) => new Date(log.datetimeLog).getDay() + 1 == weekdaySelected,
    );

    if (result.length == 0)
      setErrorWeekdayLogs(
        "No se encontraron monitoreos de humedad en este dia",
      );
    else setHumidityPlantationLogsByDay(result);
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

        {!loadingLogs && humidityPlantationLogsByDay.length > 0 && (
          <Logs humidityPlantationLogsByDay={humidityPlantationLogsByDay} />
        )}
      </div>

      <Weekdays />
    </div>
  );
};
