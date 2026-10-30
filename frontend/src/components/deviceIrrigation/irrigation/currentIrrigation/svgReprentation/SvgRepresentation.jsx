import styles from "./SvgRepresentation.module.css";
import { Irrigate } from "./irrigate/Irrigate";
import { Plantation } from "./Plantation";
import { WaterTank } from "./waterTank/WaterTank";

export const SvgRepresentation = () => {
  return (
    <div className={styles.svgRepresentation}>
      <svg width={"40vw"} height={"38vh"} >
        <WaterTank />
        <Plantation />
      </svg>
      <Irrigate />
    </div>
  );
};
