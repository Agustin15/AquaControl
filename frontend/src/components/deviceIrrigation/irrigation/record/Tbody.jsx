import styles from "./Record.module.css";
import iconInfo from "../../../../assets/img/info.png";
import { formatDate, calculateDuration } from "./function.js";
import { useWaterPlant } from "../../../../contexts/WaterPlantContext";

export const Tbody = ({ info, setInfo }) => {
  const { loadingLogs, errorWaterPlant, waterPlantLogs } = useWaterPlant();

  return (
    <tbody>
      {errorWaterPlant && (
        <tr>
          <td colSpan={5} rowSpan={5}>
            <span> {errorWaterPlant}</span>
          </td>
        </tr>
      )}
      {loadingLogs && (
        <tr>
          <td colSpan={5} rowSpan={5}>
            <span> Cargando...</span>
          </td>
        </tr>
      )}
      {waterPlantLogs.length > 0 &&
        waterPlantLogs.map((waterPlantLog, index) => (
          <tr key={index}>
            <td>{waterPlantLog.type}</td>
            <td>
              <div className={styles.date}>
                {formatDate(new Date(waterPlantLog.datetimeStart))}
              </div>
            </td>
            <td>
              {waterPlantLog.datetimeEnd
                ? calculateDuration(
                    new Date(waterPlantLog.datetimeStart),
                    new Date(waterPlantLog.datetimeEnd),
                  )
                : "Riego no completado"}
            </td>
            <td>{waterPlantLog.state}</td>
            <td>
              <img onClick={() => setInfo(waterPlantLog)} src={iconInfo}></img>
            </td>
          </tr>
        ))}
    </tbody>
  );
};
