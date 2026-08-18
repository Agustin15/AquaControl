import styles from "./WaterTank.module.css";
import { Recipient } from "./recipient/Recipient.jsx";
import { Liquid } from "./liquid/Liquid.jsx";
import { useState, useEffect } from "react";
import { useTank } from "../../../../../contexts/TankContext.jsx";

export const WaterTank = ({ tankSelected }) => {
  const { getLiveReloadWaterLevel, currentLevelTank } = useTank();

  useEffect(() => {
    getLiveReloadWaterLevel();
  }, []);

  let colorLevel, state;
  switch (true) {
    case currentLevelTank >= 70:
      colorLevel = "rgb(30, 189, 43)";
      state = "Optimo";
      break;
    case currentLevelTank >= 40 && currentLevelTank < 70:
      colorLevel = "rgb(216, 213, 47)";
      state = "Medio";
      break;
    case currentLevelTank >= 20 && currentLevelTank < 40:
      colorLevel = "rgb(231, 84, 40)";
      state = "Bajo, recomendable llenar";
      break;
    case currentLevelTank < 20:
      colorLevel = " rgb(209, 29, 29)";
      state = "¡Reponga el tanque!";
      break;
  }

  return (
    <div className={styles.containWaterTank}>
      <div className={styles.levelTank}>
        <svg width="120" height="180" viewBox="0 0 110 180">
          {/* base del recipiente */}
          <ellipse
            rx={58}
            ry={20}
            cx={55}
            cy={160}
            fill={"rgba(43, 42, 42, 0.8)"}
          />

          {/* agua del recipiente */}
          <Liquid currentLevelTank={currentLevelTank} />

          {/* contorno y tope del recipiente*/}
          <Recipient />
        </svg>
      </div>

      <div className={styles.detailsWaterTank}>
        <span>
          Nivel del agua:{" "}
          <b style={{ color: colorLevel }}>{currentLevelTank}%</b>
        </span>
        <span>
          <b style={{ color: colorLevel }}>{state}</b>
        </span>
      </div>
    </div>
  );
};
