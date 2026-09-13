import styles from "./Record.module.css";
import iconInfo from "../../../../assets/img/info.png";
import { formatDate, calculateDuration } from "./function.js";
import { useWaterPlantation } from "../../../../contexts/WaterPlantationContext";

export const Tbody = ({ info, setInfo }) => {
  const { loadingLogs, errorWaterPlantation, waterPlantationLogs } = useWaterPlantation();

  return (
    <tbody>
      {errorWaterPlantation && (
        <tr>
          <td colSpan={5} rowSpan={5}>
            <span>{errorWaterPlantation}</span>
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
      {waterPlantationLogs.length > 0 &&
        waterPlantationLogs.map((waterPlantationLog, index) => (
          <tr key={index}>
            <td>{waterPlantationLog.type}</td>
            <td>
              <div className={styles.date}>
                {formatDate(new Date(waterPlantationLog.datetimeStart))}
              </div>
            </td>
            <td>
              {waterPlantationLog.datetimeEnd
                ? calculateDuration(
                    new Date(waterPlantationLog.datetimeStart),
                    new Date(waterPlantationLog.datetimeEnd),
                  )
                : "Riego no completado"}
            </td>
            <td>{waterPlantationLog.state}</td>
            <td>
              <img onClick={() => setInfo(waterPlantationLog)} src={iconInfo}></img>
            </td>
          </tr>
        ))}
    </tbody>
  );
};
