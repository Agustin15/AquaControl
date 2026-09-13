import styles from "./Settings.module.css";
import iconConfig from "../../../assets/img/config.png";
import { useState } from "react";
import { PlantationProvider } from "../../../contexts/plantationContext/PlantationContext";
import { FormPlantationProvider } from "../../../contexts/plantationContext/FormPlantationContext";
import { TankProvider } from "../../../contexts/tankContext/TankContext";
import { FormTankProvider } from "../../../contexts/tankContext/FormTankContext";
import { Tanks } from "./tank/Tanks";
import { Plantations } from "./plantations/Plantations";


export const Settings = () => {
  const [option, setOption] = useState("plantations");

  return (
    <div className={styles.settings}>
      <h3>
        <img src={iconConfig}></img> Ajustes
      </h3>
      <div className={styles.crud}>
        <ul className={styles.menu}>
          <li
            className={option == "plantations" ? styles.selected : ""}
            onClick={() => setOption("plantations")}
          >
            Plantaciones
          </li>
          <li
            className={option == "tank" ? styles.selected : ""}
            onClick={() => setOption("tank")}
          >
            Tanque
          </li>
        </ul>

        {option == "plantations" && (
          <PlantationProvider>
            <FormPlantationProvider>
              <Plantations />
            </FormPlantationProvider>
          </PlantationProvider>
        )}

        {option == "tank" && (
          <TankProvider>
            <FormTankProvider>
              <Tanks />
            </FormTankProvider>
          </TankProvider>
        )}
      </div>
    </div>
  );
};
