import iconEdit from "../../../../../assets/img/edit.png";
import styles from "./EditUser.module.css";
import { useState } from "react";
import { useUserDevice } from "../../../../../contexts/UsersDeviceContext";

export const EditUser = ({ editUser, setEditUser }) => {
  const [role, setRole] = useState(editUser.role);
  const [errorRole, setErrorRole] = useState("");
  const { updateUserRoleInDevice, loadingForm } = useUserDevice();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (role != "Operador" && role != "Lector") {
      setErrorRole("Rol debe ser Operador o Lector");
      return;
    }
    await updateUserRoleInDevice({ ...editUser, role: role });
    return;
  };

  return (
    <div className={styles.edit}>
      <div className={styles.header}>
        <img src={iconEdit}></img>
        <h3>Editar rol de usuario en el dispositivo</h3>
        <button onClick={() => setEditUser()}>Cerrar</button>
      </div>
      <form onSubmit={(event) => handleSubmit(event)} className={styles.form}>
        <div className={styles.columnInput}>
          <label>Rol del usuario:</label>
          <select
            defaultValue={editUser.role}
            onChange={(event) => setRole(event.target.value)}
            value={role}
            placeholder="Ingrese rol"
            className={errorRole.length > 0 ? styles.inputError : ""}
          >
            <option value={"Operador"}>Operador</option>
            <option value={"Lector"}>Lector</option>
          </select>
          {errorRole.length > 0 && <p>{errorRole}</p>}
        </div>

        <button className={styles.btnEdit} disabled={loadingForm}>
          {loadingForm ? "Actualizando..." : "Actualizar"}
        </button>
      </form>
    </div>
  );
};
