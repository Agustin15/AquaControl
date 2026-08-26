import styles from "./Menu.module.css";
import { usePlant } from "../../../../contexts/plantContext/PlantContext";
import { useEffect } from "react";

export const Menu = ({ optionSelected, setOptionSelected }) => {
  const { plants, setPlantSelected } = usePlant();

  useEffect(() => {
    setPlantSelected(plants[0]);
  }, [plants]);

  return (
    <ul className={styles.menu}>
      <li
        onClick={() => setOptionSelected("Irrigate")}
        className={optionSelected == "Irrigate" ? styles.selected : ""}
      >
        Ver Riego
      </li>
      <li
        onClick={() => setOptionSelected("Record")}
        className={optionSelected == "Record" ? styles.selected : ""}
      >
        Ver Historial
      </li>
    </ul>
  );
};
