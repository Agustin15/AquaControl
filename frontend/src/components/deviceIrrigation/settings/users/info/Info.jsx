import styles from "./Info.module.css";
import iconInfo from "../../../../../assets/img/info.png";

export const Info = ({ infoUser, setInfoUser }) => {
  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <div className={styles.infoUser}>
      <div className={styles.header}>
        <img src={iconInfo} />
        <h3>Detalles del usuario {infoUser.user.username}</h3>
        <button onClick={() => setInfoUser(null)}>Cerrar</button>
      </div>

      <ul className={styles.info}>
        <li>
          <b>Correo:</b>
          <span>{infoUser.user.email}</span>
        </li>
        <li>
          <b>Rol:</b>
          <span>{infoUser.role}</span>
        </li>
        <li>
          <b>Fecha de unión al dispositivo:</b>
          <span>{formatDate(infoUser.joined)}</span>
        </li>
      </ul>
    </div>
  );
};
