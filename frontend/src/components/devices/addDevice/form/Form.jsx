import styles from "./Form.module.css";

export const Form = ({
  handleSubmit,
  valuesForm,
  setValuesForm,
  errorsForm,
  loadingForm,
}) => {
  return (
    <form onSubmit={(event) => handleSubmit(event)} className={styles.formAdd}>
      <div className={styles.columnInput}>
        <label>Red Wifi</label>
        <input
          onChange={(event) =>
            setValuesForm({ ...valuesForm, wifi: event.target.value })
          }
          value={valuesForm.wifi}
          placeholder="Ingrese red Wifi"
          type="text"
          className={errorsForm.wifi.length > 0 ? styles.inputError : ""}
        ></input>

        {errorsForm.wifi.length > 0 && <p>*{errorsForm.wifi}</p>}
      </div>

      <div className={styles.columnInput}>
        <label>Contraseña de la red</label>
        <input
          onChange={(event) =>
            setValuesForm({ ...valuesForm, wifiPassword: event.target.value })
          }
          value={valuesForm.wifiPassword}
          placeholder="Ingrese contraseña"
          type="text"
          className={
            errorsForm.wifiPassword.length > 0 ? styles.inputError : ""
          }
        ></input>

        {errorsForm.wifiPassword.length > 0 && (
          <p>*{errorsForm.wifiPassword}</p>
        )}
      </div>

      <div className={styles.columnInput}>
        <label>Ubicacion geografica del equipo</label>
        <input
          onChange={(event) =>
            setValuesForm({ ...valuesForm, location: event.target.value })
          }
          value={valuesForm.location}
          placeholder="Ingrese ubicacion:Ciudad,Pais"
          type="text"
          className={errorsForm.location.length > 0 ? styles.inputError : ""}
        ></input>

        {errorsForm.location.length > 0 && <p>*{errorsForm.location}</p>}
      </div>

      <button disabled={loadingForm}>
        {loadingForm ? "Vinculando..." : "Vincular"}
      </button>
    </form>
  );
};
