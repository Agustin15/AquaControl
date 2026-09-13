import iconHumidityOptime from "../../../../../assets/img/adviceHumidityOptime.png";
import iconNoWater from "../../../../../assets/img/adviceNoWater.png";
import iconAdviceRainPlantation from "../../../../../assets/img/adviceRainPlantation.png";
import { alertErrorIrrigation } from "../../../../alertSwal/alertSwal.js";
import { useWaterPlantation } from "../../../../../contexts/WaterPlantationContext";
import { useWeather } from "../../../../../contexts/WeatherContext.jsx";
import { useEffect } from "react";

export const ActionIrrigation = () => {
  const { currentWeather } = useWeather();
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
};
