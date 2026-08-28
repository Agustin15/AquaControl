import styles from "./Info.module.css";
import iconInfo from "../../../assets/img/info.png";
import { useCrudDevice } from "../../../contexts/CrudDeviceContext";

export const Info = () => {
  const { setInfoDevice, infoDevice } = useCrudDevice();

  const formatDate = (date) => {
    const hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const minutes =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

    const month =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;

    const year = date.getFullYear();

    return day + "/" + month + "/" + year + " " + hour + ":" + minutes;
  };

  return (
    <div className={styles.infoDevice}>
      <div className={styles.header}>
        <img src={iconInfo}></img>
        <h3>Detalles del dispositivo</h3>
        <button onClick={() => setInfoDevice(false)}>Cerrar</button>
      </div>

      <div className={styles.rowDetail}>
        <b>Lugar del dispositivo</b>
        <span>{infoDevice.placeName}</span>
      </div>
      <div className={styles.rowDetail}>
        <b>Ubicacion:</b>
        <span>
          {infoDevice.location ? infoDevice.location : "Sin ubicacion"}
        </span>
      </div>
      <div className={styles.rowDetail}>
        <b>Creado:</b>
        <span>{formatDate(new Date(infoDevice.created))}</span>
      </div>
    </div>
  );
};
