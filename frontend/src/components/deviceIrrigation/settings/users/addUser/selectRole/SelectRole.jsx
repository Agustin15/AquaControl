import styles from "./SelectUser.module.css";

export const SelectRole = ({ valuesForm, setValuesForm }) => {
  return (
    <div className={styles.selectRole}>
      <label>Rol del usuario en el dispositivo</label>
      <select
        defaultValue={"Lector"}
        disabled={valuesForm.user.length == 0}
        onChange={(event) =>
          setValuesForm({ ...valuesForm, role: event.target.value })
        }
        value={valuesForm.role}
        placeholder="Ingrese rol"
      >
        <option value={"Operador"}>Operador</option>
        <option value={"Lector"}>Lector</option>
      </select>
    </div>
  );
};
