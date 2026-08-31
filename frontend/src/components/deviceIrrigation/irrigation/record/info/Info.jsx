import styles from "./Info.module.css";
import iconInfo from "../../../../../assets/img/info.png";
import { LevelHumidity } from "../../../humidityPlantLogs/logs/levelHumidity/LevelHumidity";
import { LevelTank } from "../../../waterTankLogs/logs/levelTank/LevelTank";

export const Info = ({ info, setInfo }) => {

  return (
    <div className={styles.info}>
      <div className={styles.header}>
        <img src={iconInfo}></img>
        <h3>Detalles del riego</h3>
        <button onClick={() => setInfo(null)}>Cerrar</button>
      </div>

      <div className={styles.row}>
        <div className={styles.plant}>
          <h3>Planta:</h3>
          <div className={styles.detail}>
            <span>Humedad previa: {info.humidityBefore}%</span>
            <LevelHumidity humidity={info.humidityBefore} />
          </div>
          <div className={styles.detail}>
            <span>Humedad posterior: {info.humidityAfter}%</span>
            <LevelHumidity humidity={info.humidityAfter} />
          </div>
        </div>

        <div className={styles.tank}>
          <h3>Tanque:</h3>
          <div className={styles.detail}>
            <span>Nivel de agua previo: {info.levelTankBefore}%</span>
            <LevelTank currentLevelTank={info.levelTankBefore} />
          </div>

          <div className={styles.detail}>
            <span>Nivel de agua posterior: {info.levelTankAfter}%</span>
            <LevelTank currentLevelTank={info.levelTankAfter} />
          </div>
        </div>
      </div>
    </div>
  );
};
