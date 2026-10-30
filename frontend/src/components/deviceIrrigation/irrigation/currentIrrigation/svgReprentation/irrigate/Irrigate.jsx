import styles from "./Irrigate.module.css";
import iconHumidityOptime from "../../../../../../assets/img/adviceHumidityOptime.png";
import iconNoWater from "../../../../../../assets/img/adviceNoWater.png";
import iconAdviceRainPlantation from "../../../../../../assets/img/adviceRainPlantation.png";
import { alertErrorIrrigation } from "../../../../../alertSwal/alertSwal.js";
import { useWaterPlantation } from "../../../../../../contexts/WaterPlantationContext.jsx";
import { useEffect } from "react";
import { LastWaterPlantation } from "./LastWaterPlantation.jsx";
import { useMqtt } from "../../../../../../contexts/MqttContext.jsx";

export const Irrigate = () => {
  const {
    currentLevelTank,
    currentHumidityPlantation,
    liveWeather,
    plantationLiveSelected,
    sendStartWaterPlantation,
    sendStopWaterPlantation,
    waterPlantationLiveInProgress,
  } = useMqtt();

  const { fetchGetLastWaterPlantation, lastWaterPlantation } =
    useWaterPlantation();

  const handleStartIrrigation = () => {
    if (currentHumidityPlantation >= plantationLiveSelected.humidityMax - 10)
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
      liveWeather &&
      liveWeather.precipitationChance >= 75 &&
      plantationLiveSelected.indoor == false
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
    <div className={styles.actionIrrigation}>
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
          waterPlantationLiveInProgress
            ? handleStopIrrigation()
            : handleStartIrrigation();
        }}
        className={
          waterPlantationLiveInProgress
            ? styles.irrigationInCurse
            : styles.irrigationStop
        }
      >
        {!waterPlantationLiveInProgress ? "Iniciar riego" : "Detener riego"}
      </button>
    </div>
  );
};
