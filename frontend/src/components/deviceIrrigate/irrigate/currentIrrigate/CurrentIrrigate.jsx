import styles from "./CurrentIrrigate.module.css";
import { HumidityPlant } from "./humitiyPlant/HumidityPlant";
import { WaterTank } from "./WaterTank/WaterTank";
import { usePlant } from "../../../../contexts/PlantContext";
import { useTank } from "../../../../contexts/TankContext";
import { useWaterPlant } from "../../../../contexts/WaterPlantContext";
import { alertWarning } from "../../../alertSwal/alertSwal";

export const CurrentIrrigate = () => {
  const { plantSelected, currentHumidityPlant } = usePlant();
  const { tankSelected, currentLevelTank } = useTank();
  const { sendStartWaterPlant } = useWaterPlant();

  const handleClick = () => {
    if (currentHumidityPlant >= plantSelected.umbralHumidity)
      return alertWarning("La planta ya esta en su nivel optimo de humedad");

    if (currentLevelTank <= 15)
      return alertWarning(
        "El nivel de agua del tanque es insuficiente para el iniciar el riego",
      );

    sendStartWaterPlant();
  };

  return (
    <div className={styles.currentIrrigate}>
      <WaterTank tankSelected={tankSelected} />
      <button onClick={() => handleClick()} className={styles.startIrrigate}>
        Iniciar riego
      </button>
      <HumidityPlant plantSelected={plantSelected} />
    </div>
  );
};
