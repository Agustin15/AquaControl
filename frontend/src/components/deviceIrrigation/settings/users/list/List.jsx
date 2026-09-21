import styles from "./List.module.css";
import iconDelete from "../../../../../assets/img/delete.png";
import iconEdit from "../../../../../assets/img/edit.png";
import iconInfo from "../../../../../assets/img/info.png";
import iconReader from "../../../../../assets/img/comunUser.png";
import iconOperator from "../../../../../assets/img/admin.png";
import { useDevice } from "../../../../../contexts/DeviceContext";
import { useUserDevice } from "../../../../../contexts/UsersDeviceContext";

export const List = () => {
  const { setInfoUser, setDeleteUser, setEditUser } = useUserDevice();
  const { deviceSelected } = useDevice();
  return (
    <ul className={styles.users}>
      {deviceSelected.usersOfDevice.map((userOfDevice) => (
        <li key={userOfDevice.user.id}>
          <div className={styles.userHeader}>
            <img
              className={styles.userAvatar}
              src={userOfDevice.role == "Operador" ? iconOperator : iconReader}
            />
            <div className={styles.mainInfo}>
              <b>{userOfDevice.user.username}</b>
              <b>{userOfDevice.role}</b>
            </div>
          </div>

          <div className={styles.options}>
            <button onClick={() => setDeleteUser(userOfDevice)}>
              <img className={styles.iconDelete} src={iconDelete} />
            </button>
            <button onClick={() => setEditUser(userOfDevice)}>
              <img src={iconEdit} />
            </button>
            <button onClick={() => setInfoUser(userOfDevice)}>
              <img src={iconInfo} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
