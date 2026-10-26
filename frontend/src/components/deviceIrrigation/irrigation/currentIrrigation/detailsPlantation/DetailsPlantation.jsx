import styles from "./DetailsPlantation.module.css";
import iconInfo from "../../../../../assets/img/info.png";
import iconPlantation from "../../../../../assets/img/plantation.png";

export const DetailsPlantation = ({ plantation, setShowInfoPlantation }) => {
  return (
    <div className={styles.detailsPlantation}>
      <div className={styles.header}>
        <img src={iconInfo}></img>
        <h3>Detalles plantacion N° {plantation.id}</h3>
        <button onClick={() => setShowInfoPlantation(false)}>Cerrar</button>
      </div>

      <ul className={styles.info}>
        <li className={styles.containImage}>
          {plantation.image ? (
            <div className={styles.image}>
              <img src={plantation.image}></img>
            </div>
          ) : (
            <div className={styles.noImage}>
              <img src={iconPlantation}></img>
              <span>Sin imagen </span>
            </div>
          )}
        </li>

        <div className={styles.columnTwo}>
          <li className={styles.rowDetail}>
            <b>Tipo de cultivo:</b>
            <span>{plantation.cropType.name}s</span>
          </li>

          <li className={styles.rowDetail}>
            <b>Humedad minima de tierra:</b>
            <span>{plantation.humidityMin}%</span>
          </li>

          <li className={styles.rowDetail}>
            <b>Humedad maxima de tierra:</b>
            <span>{plantation.humidityMax}%</span>
          </li>

          <li className={styles.rowDetail}>
            <b>Cantidad sembrada:</b>
            <span>{plantation.amountPlants}</span>
          </li>

          <li className={styles.rowDetail}>
            <b>Cultivo interior:</b>
            <span>{plantation.indoor ? "Si" : "No"}</span>
          </li>
        </div>
      </ul>
    </div>
  );
};
