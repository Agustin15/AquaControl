import styles from "./CurrentIrrigate.module.css";
import { HumidityPlant } from "./humitiyPlant/HumidityPlant";
import { WaterTank } from "./waterTank/WaterTank";
import { LastWaterPlant } from "./lastWaterPlant/LastWaterPlant.jsx";
import { usePlant } from "../../../../contexts/PlantContext";
import { useTank } from "../../../../contexts/TankContext";
import { useWaterPlant } from "../../../../contexts/WaterPlantContext";
import { alertWarning } from "../../../alertSwal/alertSwal";
import { useEffect } from "react";

export const CurrentIrrigate = () => {
  const { plantSelected, currentHumidityPlant } = usePlant();
  const { currentLevelTank } = useTank();
  const {
    sendStartWaterPlant,
    sendStopWaterPlant,
    waterPlantInProgress,
    fetchGetLastWaterPlant,
    lastWaterPlant,
  } = useWaterPlant();

  const handleStartIrrigation = () => {
    if (currentHumidityPlant >= plantSelected.umbralHumidity)
      return alertWarning("La planta ya esta en su nivel optimo de humedad");

    if (currentLevelTank <= 15)
      return alertWarning(
        "El nivel de agua del tanque es insuficiente para el iniciar el riego",
      );

    sendStartWaterPlant();
  };
  const handleStopIrrigation = () => {
    sendStopWaterPlant();
  };

  useEffect(() => {
    fetchGetLastWaterPlant(false);
  }, []);

  return (
    <div className={styles.currentIrrigate}>
      <WaterTank />
      <div className={styles.column}>
        <button
          disabled={waterPlantInProgress}
          onClick={() => handleStartIrrigation()}
          className={styles.startIrrigate}
        >
          {waterPlantInProgress ? "Riego en progreso" : "Iniciar riego"}
        </button>

        {lastWaterPlant && <LastWaterPlant lastWaterPlant={lastWaterPlant} />}
        {waterPlantInProgress && (
          <button
            onClick={() => handleStopIrrigation()}
            className={styles.cancelIrrigate}
          >
            Detener riego
          </button>
        )}
      </div>

      <HumidityPlant plantSelected={plantSelected} />
    </div>
  );
};
