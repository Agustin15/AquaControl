import styles from "./CurrentIrrigate.module.css";
import { HumidityPlant } from "./humitiyPlant/HumidityPlant";
import { WaterTank } from "./WaterTank/WaterTank";
import { useWaterPlant } from "../../../../contexts/WaterPlantContext";
import { usePlant } from "../../../../contexts/PlantContext";
import { useTank } from "../../../../contexts/TankContext";

export const CurrentIrrigate = () => {
  const { plantSelected } = usePlant();
  const { tankSelected } = useTank();

  return (
    <div className={styles.currentIrrigate}>
      <WaterTank tankSelected={tankSelected} />
      <button className={styles.startIrrigate}>Iniciar riego</button>
      <HumidityPlant plantSelected={plantSelected} />
    </div>
  );
};
