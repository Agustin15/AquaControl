import styles from "./WaterTankLogs.module.css";
import iconWaterTank from "../../../assets/img/waterTank.png";
import iconNoTanks from "../../../assets/img/noTanks.png";
import { useEffect, useState } from "react";
import { useTank } from "../../../contexts/TankContext";
import { LogsWeekday } from "./logsWeekday/LogsWeekday";
import { useDevice } from "../../../contexts/DeviceContext";
import { useWeekdayLogs } from "../../../contexts/LogsWeekdayContext";

export const WaterTankLogs = () => {
  const {
    tanks,
    getTanks,
    loadingTanks,
    errorTanks,
    tankSelected,
    setTankSelected,
  } = useTank();
  const { getWeekdayLogs } = useWeekdayLogs();

  useEffect(() => {
    loadTanks();
  }, []);

  const loadTanks = async () => {
    const tanks = await getTanks();
    if (tanks) {
      setTankSelected(tanks[0]);
      loadWaterLogsOfTank(tanks[0].id);
    }
  };

  const loadWaterLogsOfTank = async (idTank) => {
    getWeekdayLogs(
      `/api/waterTankLogAndIrrigateCausative/tank/${idTank}/lastWeek`,
    );
  };

  const handleClickTank = (tank) => {
    setTankSelected(tank);
    loadWaterLogsOfTank(tank.id);
  };

  return (
    <div className={styles.waterTankLogs}>
      <div className={styles.header}>
        <div className={styles.title}>
          <img src={iconWaterTank} />
          <h3>Historial de los niveles de agua del tanque </h3>
        </div>

        {!loadingTanks && tanks.length > 0 && (
          <ul className={styles.tankList}>
            {tanks.map((tank, index) => (
              <li
                className={tankSelected.id == tank.id ? styles.selected : ""}
                key={index}
                onClick={() => handleClickTank(tank)}
              >
                Tanque
              </li>
            ))}
          </ul>
        )}
      </div>

      {loadingTanks && (
        <div className={styles.loadingFilter}>
          <span className={styles.loader}></span>
          <p>Cargando tanques...</p>
        </div>
      )}

      {!loadingTanks && errorTanks && (
        <div className={styles.noTanks}>
          <img src={iconNoTanks}></img>
          <p>{errorTanks}</p>
        </div>
      )}

      {!loadingTanks && tanks.length > 0 && <LogsWeekday />}
    </div>
  );
};
