import styles from "./Users.module.css";
import iconNoUsers from "../../../../assets/img/noUsers.png";
import iconAdd from "../../../../assets/img/add.png";
import { useUserDevice } from "../../../../contexts/UsersDeviceContext";
import { useDevice } from "../../../../contexts/DeviceContext";
import { createPortal } from "react-dom";
import { Modal } from "../../../modal/Modal";
import { Info } from "./info/Info";
import { AddUser } from "./addUser/AddUser";
import { EditUser } from "./editUser/EditUser";
import { DeleteUser } from "./deleteUser/DeleteUser";
import { List } from "./list/List";

export const Users = () => {
  const {
    setInfoUser,
    infoUser,
    deleteUser,
    setDeleteUser,
    editUser,
    setEditUser,
    showAddUser,
    setShowAddUser,
  } = useUserDevice();
  const { deviceSelected } = useDevice();

  return (
    <div className={styles.containUsers}>
      
      <div className={styles.optionAddUser}>
        <button onClick={() => setShowAddUser(true)}>
          Agregar usuario
          <img src={iconAdd}></img>
        </button>
      </div>

      {deviceSelected.usersOfDevice.length == 0 && (
        <div className={styles.noUsers}>
          <img src={iconNoUsers} />
          <p>Dispositivo de riego no tiene usuarios vinculados aun</p>
        </div>
      )}

      <List />
      {showAddUser &&
        createPortal(
          <Modal>
            <AddUser setShowAddUser={setShowAddUser} />
          </Modal>,
          document.getElementById("contentBody"),
        )}
      {editUser &&
        createPortal(
          <Modal>
            <EditUser editUser={editUser} setEditUser={setEditUser} />
          </Modal>,
          document.getElementById("contentBody"),
        )}
      {deleteUser &&
        createPortal(
          <Modal>
            <DeleteUser deleteUser={deleteUser} setDeleteUser={setDeleteUser} />
          </Modal>,
          document.getElementById("contentBody"),
        )}
      {infoUser &&
        createPortal(
          <Modal>
            <Info infoUser={infoUser} setInfoUser={setInfoUser} />
          </Modal>,
          document.getElementById("contentBody"),
        )}
    </div>
  );
};
