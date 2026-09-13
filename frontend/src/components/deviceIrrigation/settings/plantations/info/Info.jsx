import styles from "./Info.module.css";
import iconInfo from "../../../../../assets/img/info.png";
import iconPlantation from "../../../../../assets/img/plantation.png";
import { usePlantation } from "../../../../../contexts/plantationContext/PlantationContext";

export const Info = () => {
  const { setInfoPlantation, infoPlantation } = usePlantation();
  return (
    <div className={styles.infoPlantation}>
      <div className={styles.header}>
        <img src={iconInfo}></img>
        <h3>Detalles plantacion N° {infoPlantation.id}</h3>
        <button onClick={() => setInfoPlantation(false)}>Cerrar</button>
      </div>

      <div className={styles.info}>
        <div className={styles.containImage}>
          {infoPlantation.image ? (
            <div className={styles.image}>
              <img src={"data:image/jpg;base64," + infoPlantation.image}></img>
            </div>
          ) : (
            <div className={styles.noImage}>
              <img src={iconPlantation}></img>
              <span>Sin imagen </span>
            </div>
          )}
        </div>

        <div className={styles.rowDetail}>
          <b>Tipo de cultivo:</b>
          <span>{infoPlantation.cropType.name}s</span>
        </div>

        <div className={styles.rowDetail}>
          <b>Humedad minima de tierra:</b>
          <span>{infoPlantation.humidityMin}%</span>
        </div>

        <div className={styles.rowDetail}>
          <b>Humedad maxima de tierra:</b>
          <span>{infoPlantation.humidityMax}%</span>
        </div>

        <div className={styles.rowDetail}>
          <b>Cantidad sembrada:</b>
          <span>{infoPlantation.amountPlants}</span>
        </div>

        <div className={styles.rowDetail}>
          <b>Indoor:</b>
          <span>{infoPlantation.indoor ? "Si" : "No"}</span>
        </div>
      </div>
    </div>
  );
};
