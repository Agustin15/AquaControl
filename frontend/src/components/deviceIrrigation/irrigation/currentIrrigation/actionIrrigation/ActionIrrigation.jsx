import styles from "./ActionIrrigation.module.css";
import iconHumidityOptime from "../../../../../assets/img/adviceHumidityOptime.png";
import iconNoWater from "../../../../../assets/img/adviceNoWater.png";
import iconAdviceRainPlantation from "../../../../../assets/img/adviceRainPlantation.png";
import { alertErrorIrrigation } from "../../../../alertSwal/alertSwal.js";
import { useWaterPlantation } from "../../../../../contexts/WaterPlantationContext";
import { useWeather } from "../../../../../contexts/WeatherContext.jsx";
import { useEffect } from "react";
import { useTank } from "../../../../../contexts/tankContext/TankContext.jsx";
import { usePlantation } from "../../../../../contexts/plantationContext/PlantationContext.jsx";
import { LastWaterPlantation } from "./LastWaterPlantation.jsx";

export const ActionIrrigation = () => {
  const { currentWeather } = useWeather();
  const { currentLevelTank } = useTank();
  const { currentHumidityPlantation, plantationSelected } = usePlantation();
  const {
    sendStartWaterPlantation,
    sendStopWaterPlantation,
    waterPlantationInProgress,
    fetchGetLastWaterPlantation,
    lastWaterPlantation,
  } = useWaterPlantation();

  const handleStartIrrigation = () => {
    if (currentHumidityPlantation >= plantationSelected.umbralHumidity)
      return alertErrorIrrigation(
        "La plantacion ya esta en su nivel optimo de humedad",
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
      plantationSelected.indoor == false
    )
      return alertErrorIrrigation(
        "Hay alta probabilidad de lluvia, como su plantacion no esta bajo techo, no es necesario el riego",
        iconAdviceRainPlantation,
      );

    sendStartWaterPlantation();
  };

  const handleStopIrrigation = () => {
    sendStopWaterPlantation();
  };

  useEffect(() => {
    fetchGetLastWaterPlantation(false);
  }, []);

  return (
    <li className={styles.actionIrrigation}>
      <div className={styles.lastIrrigation}>
        Ultimo riego:
        {lastWaterPlantation ? (
          <LastWaterPlantation lastWaterPlantation={lastWaterPlantation} />
        ) : (
          <span>Sin riegos aun</span>
        )}
      </div>

      <button
        onClick={() => {
          waterPlantationInProgress
            ? handleStopIrrigation()
            : handleStartIrrigation();
        }}
        className={
          waterPlantationInProgress
            ? styles.irrigationInCurse
            : styles.irrigationStop
        }
      >
        {!waterPlantationInProgress ? "Iniciar riego" : "Detener riego"}
      </button>
    </li>
  );
};
