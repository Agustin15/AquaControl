import styles from "./SubMenuProfile.module.css";
import iconLogout from "../../../assets/img/logout.png";
import { useAuth } from "../../../contexts/AuthContext";

export const SubMenuProfile = () => {
  const { logout } = useAuth();

  return (
    <ul className={styles.subMenuProfile}>
      <li>Editar perfil</li>
      <li>
        <button onClick={() => logout()}>
          <img src={iconLogout}></img>
          Cerrar sesion
        </button>
      </li>
    </ul>
  );
};
