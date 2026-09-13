import styles from "./Pagination.module.css";
import { useWaterPlantation } from "../../../../../contexts/WaterPlantationContext";

export const Pagination = () => {
  const { pages, index, setIndex } = useWaterPlantation();

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
