import iconAdd from "../../../../../assets/img/add.png";
import styles from "./AddUser.module.css";
import { SearchUser } from "./searchUser/SearchUser.jsx";
import { SelectRole } from "./selectRole/SelectRole.jsx";
import { useState } from "react";
import { useUserDevice } from "../../../../../contexts/UsersDeviceContext.jsx";

export const AddUser = ({ setShowAddUser }) => {
  const [valuesForm, setValuesForm] = useState({ user: null, role: "" });
  const { addUserToDevice, loadingForm } = useUserDevice();

  const handleSubmit = async (event) => {
    event.preventDefault();
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
        <SearchUser
          valuesForm={valuesForm}
          setValuesForm={setValuesForm}
          loadingForm={loadingForm}
        />

        {valuesForm.user && (
          <SelectRole valuesForm={valuesForm} setValuesForm={setValuesForm} />
        )}

        {valuesForm.user && (
          <button className={styles.btnAdd} disabled={loadingForm}>
            {loadingForm ? "Agregando..." : "Agregar"}
          </button>
        )}
      </form>
    </div>
  );
};
