import styles from "./Settings.module.css";
import iconConfig from "../../../assets/img/config.png";
import { useState } from "react";
import { PlantProvider } from "../../../contexts/plantContext/PlantContext";
import { FormPlantProvider } from "../../../contexts/plantContext/FormPlantContext";
import { TankProvider } from "../../../contexts/tankContext/TankContext";
import { FormTankProvider } from "../../../contexts/tankContext/FormTankContext";
import { Tanks } from "./tank/Tanks";
import { Plants } from "./plants/Plants";


export const Settings = () => {
  const [option, setOption] = useState("plants");

  return (
    <div className={styles.settings}>
      <h3>
        <img src={iconConfig}></img> Ajustes
      </h3>
      <div className={styles.crud}>
        <ul className={styles.menu}>
          <li
            className={option == "plants" ? styles.selected : ""}
            onClick={() => setOption("plants")}
          >
            Plantas
          </li>
          <li
            className={option == "tank" ? styles.selected : ""}
            onClick={() => setOption("tank")}
          >
            Tanque
          </li>
        </ul>

        {option == "plants" && (
          <PlantProvider>
            <FormPlantProvider>
              <Plants />
            </FormPlantProvider>
          </PlantProvider>
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
