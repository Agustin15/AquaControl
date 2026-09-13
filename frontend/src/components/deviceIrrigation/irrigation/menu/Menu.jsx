import styles from "./Menu.module.css";
import { usePlantation } from "../../../../contexts/plantationContext/PlantationContext";
import { useEffect } from "react";

export const Menu = ({ optionSelected, setOptionSelected }) => {
  const { plantations, setPlantationSelected } = usePlantation();

  useEffect(() => {
    setPlantationSelected(plantations[0]);
  }, [plantations]);

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
