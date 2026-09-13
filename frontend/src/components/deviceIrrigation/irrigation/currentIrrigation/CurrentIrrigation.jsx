import styles from "./CurrentIrrigation.module.css";
import { usePlantation } from "../../../../contexts/plantationContext/PlantationContext";
import { useTank } from "../../../../contexts/tankContext/TankContext";
import { HumidityPlantation } from "./humidityPlantation/HumidityPlantation";
import { WaterTank } from "./waterTank/WaterTank";
import { DrawingLevelTank } from "../../drawingLevelTank/DrawingLevelTank.jsx";
import { DrawingLevelHumidity } from "../../drawingLevelHumidity/DrawingLevelHumidity.jsx";

export const CurrentIrrigation = () => {
  const { plantationSelected, currentHumidityPlantation } = usePlantation();
  const { currentLevelTank } = useTank();

  return (
    <div className={styles.currentIrrigate}>
      <svg width={310} height={150} viewBox="0 0 310 150">
        <WaterTank />
        <HumidityPlantation plantationSelected={plantationSelected} />
      </svg>
      <div className={styles.details}>
        <div className={styles.waterLevelTank}>
          <DrawingLevelTank currentLevelTank={currentLevelTank} />
          <div className={styles.column}>
            <span>Nivel de agua:{currentLevelTank}%</span>
            <b color={currentLevelTank <= 20 ? "#b73131" : "#2ba522"}>
              {currentLevelTank <= 20 ? "¡Reponga el tanque" : "Nivel adecuado"}
            </b>
          </div>
        </div>

        <div className={styles.humidityPlantation}>
          <DrawingLevelHumidity humidity={currentHumidityPlantation} />
          <div className={styles.column}>
            <span>
              Humedad tierra:{currentHumidityPlantation}/
              {plantationSelected.cropType.humidityMax}%
            </span>
            <b>Humedad adecuada</b>
          </div>
        </div>
      </div>
    </div>
  );
};
