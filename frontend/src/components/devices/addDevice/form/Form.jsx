import styles from "./Form.module.css";
import { useCrudDevice } from "../../../../contexts/CrudDeviceContext";

export const Form = ({ handleSubmit }) => {
  const { errorsForm, setErrorsForm, setValuesForm, valuesForm, loadingForm } =
    useCrudDevice();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValuesForm({ ...valuesForm, [name]: value });

    let inputError = "";

    if (value.length == 0) {
      inputError =
        name == "wifi"
          ? "Red Wifi no puede estar vacia"
          : name == "wifiPassword"
            ? "Contraseña de red no puede estar vacia"
            : name == "placeName"
              ? "Nombre del lugar no puede estar vacio"
              : "";
    } else if (
      name == "location" &&
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+,\s*[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value) ==
        false
    )
      inputError = "Formato de ubicacion debe ser Ciudad,Pais";

    setErrorsForm({
      ...errorsForm,
      [name]: inputError,
    });
  };

  return (
    <form onSubmit={() => handleSubmit(event, true)} className={styles.formAdd}>
      <div className={styles.columnInput}>
        <label>Lugar del dispositivo</label>
        <input
          onChange={(event) => handleChange(event)}
          value={valuesForm.placeName}
          name="placeName"
          placeholder="Ingrese lugar del dispositivo"
          type="text"
          className={errorsForm.placeName.length > 0 ? styles.inputError : ""}
        ></input>

        {errorsForm.placeName.length > 0 && <p>{errorsForm.placeName}</p>}
      </div>

      <div className={styles.columnInput}>
        <label>Red Wifi</label>
        <input
          onChange={(event) => handleChange(event)}
          value={valuesForm.wifi}
          name="wifi"
          placeholder="Ingrese red Wifi"
          type="text"
          className={errorsForm.wifi.length > 0 ? styles.inputError : ""}
        ></input>

        {errorsForm.wifi.length > 0 && <p>*{errorsForm.wifi}</p>}
      </div>

      <div className={styles.columnInput}>
        <label>Contraseña de la red</label>
        <input
          onChange={(event) => handleChange(event)}
          value={valuesForm.wifiPassword}
          name="wifiPassword"
          placeholder="Ingrese contraseña"
          type="text"
          className={
            errorsForm.wifiPassword.length > 0 ? styles.inputError : ""
          }
        ></input>

        {errorsForm.wifiPassword.length > 0 && <p>*{errorsForm.wifiPassword}</p>}
      </div>

      <div className={styles.columnInput}>
        <label>Ubicacion geografica del equipo (opcional)</label>
        <input
          onChange={(event) => handleChange(event)}
          value={valuesForm.location}
          name="location"
          placeholder="Ingrese ubicacion:Ciudad,Pais"
          type="text"
          className={errorsForm.location.length > 0 ? styles.inputError : ""}
        ></input>

        {errorsForm.location.length > 0 && <p>*{errorsForm.location}</p>}
      </div>

      <button disabled={loadingForm}>
        {loadingForm ? "Agregando..." : "Agregar"}
      </button>
    </form>
  );
};
