import styles from "./CurrentIrrigation.module.css";
import { HumidityPlantation } from "./humidityPlantation/HumidityPlantation";
import { WaterTank } from "./waterTank/WaterTank";
import { DrawingLevelTank } from "../../drawingLevelTank/DrawingLevelTank.jsx";
import { DrawingLevelHumidity } from "../../drawingLevelHumidity/DrawingLevelHumidity.jsx";
import { ActionIrrigation } from "./actionIrrigation/ActionIrrigation.jsx";
import {
  getCustomsToHumidityAccordigMeasure,
  getCustomsToTankAccordigMeasure,
} from "./function.js";
import { useMqtt } from "../../../../contexts/MqttContext.jsx";

export const CurrentIrrigation = () => {
  const {
    currentHumidityPlantation,
    currentLevelTank,
    plantationLiveSelected,
  } = useMqtt();

  const { messageTank, colorMessageTank } =
    getCustomsToTankAccordigMeasure(currentLevelTank);

  const { messageHumidity, colorMessageHumidity } =
    getCustomsToHumidityAccordigMeasure(currentHumidityPlantation,plantationLiveSelected);

  return (
    <div className={styles.currentIrrigate}>
      <div className={styles.tankAndPlantation}>
        <svg width={310} height={150} viewBox="0 0 310 150">
          <WaterTank />
          <HumidityPlantation />
        </svg>
        <ActionIrrigation />
      </div>

      <ul className={styles.details}>
        <li>
          <DrawingLevelTank currentLevelTank={currentLevelTank} />
          <div className={styles.column}>
            <span>Nivel de agua tanque:{currentLevelTank}%</span>
            <b style={{ color: colorMessageTank }}>{messageTank}</b>
          </div>
        </li>

        <li>
          <DrawingLevelHumidity />
          <div className={styles.column}>
            <span>
              Humedad tierra:{currentHumidityPlantation}/
              {plantationLiveSelected.cropType.humidityMax}%
            </span>
            <b style={{ color: colorMessageHumidity }}>{messageHumidity}</b>
          </div>
        </li>
      </ul>
    </div>
  );
};
