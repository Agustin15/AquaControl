import styles from "./HumidityPlant.module.css";
import iconPlant from "../../../../../assets/img/plant.png";
import { usePlant } from "../../../../../contexts/PlantContext.jsx";
import { useEffect } from "react";
import { HumidityLevel } from "./humidityLevel/HumidityLevel.jsx";
import { detailsHumidity } from "./function.js";
import { AnimationIrrigate } from "./animationIrrigate/AnimationIrrigate.jsx";

export const HumidityPlant = ({ plantSelected }) => {
  const { currentHumidityPlant } = usePlant();

  let optimePercentege =
    (currentHumidityPlant * 100) / plantSelected.umbralHumidity;

  const { colorLevel, state } = detailsHumidity(optimePercentege);

  return (
    <div className={styles.humidityPlant}>
      <AnimationIrrigate />
      <div className={styles.row}>
        <img src={iconPlant}></img>
        <HumidityLevel
          optimePercentege={optimePercentege}
          colorLevel={colorLevel}
        />
      </div>

      <div className={styles.details}>
        <span>
          Humedad actual:{" "}
          <b style={{ color: colorLevel }}>{currentHumidityPlant}</b> /
          <b style={{ color: "rgb(40, 191, 218)" }}>
            {" "}
            {plantSelected.umbralHumidity}%
          </b>
        </span>
        <span>
          <b style={{ color: state == "Optimo" ? "#32ca35" : colorLevel }}>
            {state}
          </b>
        </span>
      </div>
    </div>
  );
};
