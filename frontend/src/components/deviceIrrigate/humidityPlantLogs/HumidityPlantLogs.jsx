import styles from "./HumidityPlantLogs.module.css";
import iconHumidityPlantTitle from "../../../assets/img/humidity.png";
import iconNoPlants from "../../../assets/img/noPlants.png";
import { useEffect, useState } from "react";
import {
  LogsWeekdayProvider,
  useWeekdayLogs,
} from "../../../contexts/LogsWeekdayContext";
import { usePlant } from "../../../contexts/PlantContext";
import { useDevice } from "../../../contexts/DeviceContext";
import { LogsWeekday } from "./logsWeekday/LogsWeekday";

export const HumidityPlantLogs = () => {
  const {
    plants,
    getPlants,
    loadingPlants,
    errorPlants,
    setPlantSelected,
    plantSelected,
  } = usePlant();
  const { getWeekdayLogs, setWeekdaySelected } = useWeekdayLogs();
  const { deviceSelected } = useDevice();

  useEffect(() => {
    loadPlants();
  }, []);

  const loadPlants = async () => {
    const plants = await getPlants();

    if (plants) {
      setPlantSelected(plants[0]);
      loadHumidityPlantLogs(plants[0].id);
    }
  };

  const loadHumidityPlantLogs = async (idPlant) => {
    getWeekdayLogs(`/api/humidityPlantLog/plant/${idPlant}/lastWeek`);
  };

  const handleClick = (plant) => {
    setPlantSelected(plant);
    loadHumidityPlantLogs(plant.id);
  };

  return (
    <div className={styles.humidityPlantLogs}>
      <div className={styles.header}>
        <div className={styles.title}>
          <img src={iconHumidityPlantTitle} />
          <h3>
           Historial de los niveles de humedad planta N° {plantSelected ? plantSelected.id : ""}
          </h3>
        </div>

        {!loadingPlants && plants.length > 0 && (
          <ul className={styles.plantList}>
            {plants.map((plant, index) => (
              <li
                className={plant.id == plantSelected.id ? styles.selected : ""}
                key={index}
                onClick={() => handleClick(plant)}
              >
                Planta {plant.id}
              </li>
            ))}
          </ul>
        )}
      </div>

      {loadingPlants && (
        <div className={styles.loadingFilter}>
          <span className={styles.loader}></span>
          <p>Cargando plantas...</p>
        </div>
      )}

      {!loadingPlants && errorPlants && (
        <div className={styles.noPlants}>
          <img src={iconNoPlants}></img>
          <p>{errorPlants}</p>
        </div>
      )}

      {!loadingPlants && plants.length > 0 && <LogsWeekday />}
    </div>
  );
};
