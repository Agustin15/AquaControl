import iconAdd from "../../../../../assets/img/add.png";
import styles from "./AddUser.module.css";
import { useState } from "react";
import { useUserDevice } from "../../../../../contexts/UsersDeviceContext.jsx";
import { alertWarning } from "../../../../alertSwal/alertSwal.js";

export const AddUser = ({ setShowAddUser }) => {
  const [valuesForm, setValuesForm] = useState({ user: "", role: "" });
  const [errors, setErrors] = useState({ user: "", role: "" });
  const [usernameSearched, setUsernameSearched] = useState("");
  const { addUserToDevice } = useUserDevice();

  const handleSubmit = async () => {
    await addUserToDevice(valuesForm);
    return;
  };

  return (
    <div className={styles.add}>
      <div className={styles.header}>
        <img src={iconAdd}></img>
        <h3>Agregar usuario a dispositivo</h3>
        <button onClick={() => setShowAddUser(false)}>Cerrar</button>
      </div>
      <form onSubmit={(event) => handleSubmit(event)} className={styles.form}>
        <div className={styles.columnInput}>
          <label>Buscar usuario para vincular al dispositivo</label>

          <input
            type="text"
            placeholder="Ingrese nombre de usuario"
            onChange={(event) => setUsernameSearched(event.target.value)}
          ></input>
          {errors.user.length > 0 && (
            <p className={styles.userNotFound}>{errors.user}</p>
          )}
        </div>

        <div className={styles.columnInput}>
          <label>Rol del usuario en el dispositivo</label>
          <select
            onChange={(event) =>
              setValuesForm({ ...valuesForm, role: event.target.value })
            }
            value={role}
            placeholder="Ingrese rol"
            className={errorRole.length > 0 ? styles.inputError : ""}
          >
            <option value={"Operador"}>Operador</option>
            <option value={"Lector"}>Lector</option>
          </select>
          {errors.role.length > 0 && <p>{errors.role}</p>}
        </div>

        <button className={styles.btnAdd} disabled={loadingForm}>
          {loadingForm ? "Agregando..." : "Agregar"}
        </button>
      </form>
    </div>
  );
};
