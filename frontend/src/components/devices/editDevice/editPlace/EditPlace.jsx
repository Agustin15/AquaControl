import styles from "./EditPlace.module.css";
import { useAuth } from "../../../../contexts/AuthContext";
import { useDevice } from "../../../../contexts/DeviceContext";
import { getTokenSaved } from "../../../../securityStorage.js";
import { alertWarning } from "../../../alertSwal/alertSwal.js";
import { useCrudDevice } from "../../../../contexts/CrudDeviceContext.jsx";

export const EditPlace = () => {
  const {
    errorsForm,
    loadingForm,
    valuesForm,
    setValuesForm,
    setErrorsForm,
    getUserDevices,
    fetchPostOrPut,
  } =  useCrudDevice();

  const { updateAccessToken } = useAuth();

  const handleChange = (event) => {
    setValuesForm({ ...valuesForm, placeName: event.target.value });

    setErrorsForm({
      ...errorsForm,
      placeName:
        event.target.value.length == 0
          ? "*Nombre del lugar no puede estar vacio"
          : "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (valuesForm.placeName.length == 0)
      return alertWarning("Nombre de lugar no puede estar vacio");

    await fetchPostOrPut("PUT", true);
  };

  return (
    <form onSubmit={(event) => handleSubmit(event)} className={styles.formEdit}>
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

      <button disabled={loadingForm}>
        {loadingForm ? "Actualizando..." : "Actualizar"}
      </button>
    </form>
  );
};
