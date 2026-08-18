import styles from "./Info.module.css";
import iconInfo from "../../../../../assets/img/info.png";
import iconPlant from "../../../../../assets/img/plant.png";
import { usePlant } from "../../../../../contexts/PlantContext";

export const Info = () => {
  const { setInfoPlant, infoPlant } = usePlant();

  return (
    <div className={styles.infoPlant}>
      <div className={styles.header}>
        <img src={iconInfo}></img>
        <h3>Detalles planta N° {infoPlant.id}</h3>
        <button onClick={() => setInfoPlant(false)}>Cerrar</button>
      </div>

      <div className={styles.info}>
        <div className={styles.containImage}>
          {infoPlant.image ? (
            <div className={styles.image}>
              <img src={"data:image/jpg;base64," + infoPlant.image}></img>
            </div>
          ) : (
            <div className={styles.noImage}>
              <img src={iconPlant}></img>
              <span>Sin imagen </span>
            </div>
          )}
        </div>

        <div className={styles.rowDetail}>
          <b>Umbral de humedad:</b>
          <span>{infoPlant.umbralHumidity}%</span>
        </div>
        <div className={styles.columnDetail}>
          <b>Descripcion:</b>
          <span>
            {infoPlant.descripcion ? infoPlant.descripcion : "Sin descripcion"}
          </span>
        </div>
      </div>
    </div>
  );
};
