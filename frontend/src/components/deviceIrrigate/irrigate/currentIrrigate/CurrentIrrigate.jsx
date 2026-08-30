import styles from "./CurrentIrrigate.module.css";
import iconHumidityOptime from "../../../../assets/img/adviceHumidityOptime.png";
import iconNoWater from "../../../../assets/img/adviceNoWater.png";
import iconAdviceRainPlant from "../../../../assets/img/adviceRainPlant.png";
import { usePlant } from "../../../../contexts/plantContext/PlantContext";
import { useTank } from "../../../../contexts/tankContext/TankContext";
import { useWaterPlant } from "../../../../contexts/WaterPlantContext";
import { useWeather } from "../../../../contexts/WeatherContext.jsx";
import { useEffect } from "react";
import { HumidityPlant } from "./humitiyPlant/HumidityPlant";
import { WaterTank } from "./waterTank/WaterTank";
import { LastWaterPlant } from "./lastWaterPlant/LastWaterPlant.jsx";
import { alertErrorIrrigation } from "../../../alertSwal/alertSwal.js";

export const CurrentIrrigate = () => {
  const { plantSelected, currentHumidityPlant } = usePlant();
  const { currentLevelTank } = useTank();
  const { currentWeather } = useWeather();
  const {
    sendStartWaterPlant,
    sendStopWaterPlant,
    waterPlantInProgress,
    fetchGetLastWaterPlant,
    lastWaterPlant,
  } = useWaterPlant();

  const handleStartIrrigation = () => {
    if (currentHumidityPlant >= plantSelected.umbralHumidity)
      return alertErrorIrrigation(
        "La planta ya esta en su nivel optimo de humedad",
        iconHumidityOptime,
      );

    if (currentLevelTank <= 15)
      return alertErrorIrrigation(
        "El nivel de agua del tanque es insuficiente para el iniciar el riego",
        iconNoWater,
      );

    if (
      currentWeather &&
      currentWeather.precipitationChance >= 75 &&
      plantSelected.indoor == false
    )
      return alertErrorIrrigation(
        "Hay alta probabilidad de lluvia, como su planta se encuentra afuera, no es necesario el riego",
        iconAdviceRainPlant,
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
