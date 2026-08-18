import styles from "./Pagination.module.css";
import { useWaterPlant } from "../../../../../contexts/WaterPlantContext";

export const Pagination = () => {
  const { pages, index, setIndex } = useWaterPlant();

  return (
    <div className={styles.pagination}>
      <input
        type="number"
        onChange={(event) => setIndex(event.target.value)}
        min={index}
        max={pages}
        value={index}
      ></input>
      de
      {" " + pages}
    </div>
  );
};
