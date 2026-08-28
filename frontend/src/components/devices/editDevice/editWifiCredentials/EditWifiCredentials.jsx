import styles from "./EditWifiCredentials.module.css";
import { alertWarning } from "../../../alertSwal/alertSwal";
import { useCrudDevice } from "../../../../contexts/CrudDeviceContext";

export const EditWifiCredentials = () => {
  const { valuesForm, errorsForm, setErrorsForm, setValuesForm, loadingForm } =
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
            : "";
    }

    setErrorsForm({
      ...errorsForm,
      [name]: inputError,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (valuesForm.wifi.length == 0 || valuesForm.wifiPassword.length == 0)
      return alertWarning("Debe completar todos los campos");

    await fetchPostOrPut("PUT", true);
  };

  return (
    <form onSubmit={(event) => handleSubmit(event)} className={styles.formEdit}>
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

        {errorsForm.wifi.length > 0 && <p>{errorsForm.wifi}</p>}
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

        {errorsForm.wifiPassword.length > 0 && <p>{errorsForm.wifiPassword}</p>}
      </div>

      <button disabled={loadingForm}>
        {loadingForm ? "Actualizando..." : "Actualizar"}
      </button>
    </form>
  );
};
