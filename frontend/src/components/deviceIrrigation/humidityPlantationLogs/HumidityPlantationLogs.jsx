import styles from "./HumidityPlantationLogs.module.css";
import iconHumidityPlantationTitle from "../../../assets/img/humidity.png";
import iconNoPlantations from "../../../assets/img/noPlantations.png";
import { useEffect } from "react";
import { useWeekdayLogs } from "../../../contexts/LogsWeekdayContext";
import { usePlantation } from "../../../contexts/plantationContext/PlantationContext";
import { LogsWeekday } from "./logsWeekday/LogsWeekday";

export const HumidityPlantationLogs = () => {
  const {
    plantations,
    getPlantations,
    loadingPlantations,
    errorPlantations,
    setPlantationSelected,
    plantationSelected,
  } = usePlantation();
  const { getWeekdayLogs } = useWeekdayLogs();

  useEffect(() => {
    loadPlantations();
  }, []);

  const loadPlantations = async () => {
    const plantations = await getPlantations();

    if (plantations) {
      setPlantationSelected(plantations[0]);
      loadHumidityPlantationLogs(plantations[0].id);
    }
  };

  const loadHumidityPlantationLogs = async (idPlantation) => {
    getWeekdayLogs(
      `/api/humidityPlantationLog/plantation/${idPlantation}/lastWeek`,
    );
  };

  const handleClick = (plantation) => {
    setPlantationSelected(plantation);
    loadHumidityPlantationLogs(plantation.id);
  };

  return (
    <div className={styles.humidityPlantationLogs}>
      <div className={styles.header}>
        <div className={styles.title}>
          <img src={iconHumidityPlantationTitle} />
          <h3>
            Niveles de humedad de la plantacion N°{" "}
            {plantationSelected ? plantationSelected.id : ""}
          </h3>
        </div>

        {!loadingPlantations && plantations.length > 0 && (
          <ul className={styles.plantationList}>
            {plantations.map((plantation, index) => (
              <li
                className={
                  plantation.id == plantationSelected.id ? styles.selected : ""
                }
                key={index}
                onClick={() => handleClick(plantation)}
              >
                <img src={plantation.cropType.image}></img>
              </li>
            ))}
          </ul>
        )}
      </div>

      {loadingPlantations && (
        <div className={styles.loadingFilter}>
          <span className={styles.loader}></span>
          <p>Cargando plantationas...</p>
        </div>
      )}

      {!loadingPlantations && errorPlantations && (
        <div className={styles.noPlantations}>
          <img src={iconNoPlantations}></img>
          <p>{errorPlantations}</p>
        </div>
      )}

      {!loadingPlantations && plantations.length > 0 && <LogsWeekday />}
    </div>
  );
};
