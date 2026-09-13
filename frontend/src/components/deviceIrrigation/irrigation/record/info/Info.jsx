import styles from "./Info.module.css";
import iconInfo from "../../../../../assets/img/info.png";
import { DrawingLevelHumidity } from "../../../drawingLevelHumidity/DrawingLevelHumidity";
import { DrawingLevelTank } from "../../../drawingLevelTank/DrawingLevelTank";

export const Info = ({ info, setInfo }) => {

  return (
    <div className={styles.info}>
      <div className={styles.header}>
        <img src={iconInfo}></img>
        <h3>Detalles del riego</h3>
        <button onClick={() => setInfo(null)}>Cerrar</button>
      </div>

      <div className={styles.row}>
        <div className={styles.plantation}>
          <h3>Plantacion:</h3>
          <div className={styles.detail}>
            <span>Humedad previa: {info.humidityBefore}%</span>
            <DrawingLevelHumidity humidity={info.humidityBefore} />
          </div>
          <div className={styles.detail}>
            <span>Humedad posterior: {info.humidityAfter}%</span>
            <DrawingLevelHumidity humidity={info.humidityAfter} />
          </div>
        </div>

        <div className={styles.tank}>
          <h3>Tanque:</h3>
          <div className={styles.detail}>
            <span>Nivel de agua previo: {info.levelTankBefore}%</span>
            <DrawingLevelTank currentLevelTank={info.levelTankBefore} />
          </div>

          <div className={styles.detail}>
            <span>Nivel de agua posterior: {info.levelTankAfter}%</span>
            <DrawingLevelTank currentLevelTank={info.levelTankAfter} />
          </div>
        </div>
      </div>
    </div>
  );
};
