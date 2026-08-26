import styles from "./Devices.module.css";
import iconLogo from "../../assets/img/logo.png";
import iconAvatar from "../../assets/img/avatar.png";
import iconNoDevices from "../../assets/img/noDevices.png";
import iconAdd from "../../assets/img/add.png";
import { useDevice } from "../../contexts/DeviceContext";
import { useAuth } from "../../contexts/AuthContext";
import { useCrudDevice } from "../../contexts/CrudDeviceContext.jsx";
import { useEffect, useState } from "react";
import { List } from "./list/List.jsx";
import { Modal } from "../modal/Modal.jsx";
import { AddDevice } from "./addDevice/AddDevice.jsx";
import { SubMenuProfile } from "./subMenuProfile/SubMenuProfile.jsx";

export const Devices = () => {
  const { devices, loadingDevices, errorDevices, getUserDevices } = useDevice();
  const { setShowFormAdd, showFormAdd } = useCrudDevice();
  const { userAuth } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    getUserDevices();
  }, []);

  return (
    <div id="containDevices" className={styles.containDevices}>
      <nav>
        <ul className={styles.menuProfile}>
          <li className={styles.logo}>
            <img src={iconLogo}></img>
            <span>AquaControl</span>
          </li>
          <li>
            <h3>Sistemas de riego</h3>
          </li>
          <li
            onClick={() => setShowMenu(showMenu ? false : true)}
            className={styles.avatar}
          >
            <img src={iconAvatar}></img>
            <span>{userAuth.username}</span>
          </li>
        </ul>
        {showMenu && <SubMenuProfile />}
      </nav>

      <div className={styles.addDevice}>
        <button onClick={() => setShowFormAdd(true)}>
          Nuevo Dispositivo
          <img src={iconAdd}></img>
        </button>
      </div>

      <div className={styles.devices}>
        {loadingDevices && (
          <div className={styles.loadingDevices}>
            <span className={styles.loader}></span>
            <p>Cargando dispositivos</p>
          </div>
        )}

        {!loadingDevices && errorDevices && (
          <div className={styles.noDevices}>
            <img src={iconNoDevices}></img>
            <p>{errorDevices}</p>
          </div>
        )}

        {!loadingDevices && devices.length > 0 && <List />}
      </div>

      {showFormAdd && (
        <Modal>
          <AddDevice />
        </Modal>
      )}
    </div>
  );
};
