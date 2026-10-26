import styles from "./SvgRepresentation.module.css";
import { Irrigate } from "./Irrigate/Irrigate";
import { Plantation } from "./Plantation";
import { WaterTank } from "./waterTank/WaterTank";

export const SvgRepresentation = () => {
  return (
    <div className={styles.svgRepresentation}>
      <svg width={310} height={150} viewBox="0 0 310 150">
        <WaterTank />
        <Plantation />
      </svg>
      <Irrigate />
    </div>
  );
};
