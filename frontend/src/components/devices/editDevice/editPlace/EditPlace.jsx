import styles from "./EditPlace.module.css";
import { alertWarning } from "../../../alertSwal/alertSwal.js";
import { useCrudDevice } from "../../../../contexts/CrudDeviceContext.jsx";
import { useDevice } from "../../../../contexts/DeviceContext.jsx";
import { saveInfo } from "../../../../securityStorage.js";
import { validation } from "./validationInputs.js";

export const EditPlace = () => {
  const {
    errorsForm,
    loadingForm,
    valuesForm,
    setValuesForm,
    setErrorsForm,
    fetchPostOrPut,
  } = useCrudDevice();

  const { getUserDevices, deviceSelected, setDeviceSelected } = useDevice();

  const handleChange = (event) => {
    const { name, value } = event.target;

    let inputError = validation(name, value);

    setValuesForm({ ...valuesForm, [name]: value });

    setErrorsForm({
      ...errorsForm,
      [name]: inputError,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      valuesForm.placeName.length == 0 ||
      !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+,\s*[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(
        valuesForm.location,
      )
    )
      return alertWarning("Complete los datos correctamente");

    const deviceUpdated = await fetchPostOrPut("PUT", true);

    if (deviceUpdated && deviceSelected) {
      await saveInfo(deviceUpdated);
      setDeviceSelected(deviceUpdated);

      await getUserDevices();
    }
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

      <div className={styles.columnInput}>
        <label>Ubicacion geografica del riego</label>
        <input
          onChange={(event) => handleChange(event)}
          defaultValue={valuesForm.location}
          name="location"
          placeholder="Ingrese ubicacion:Ciudad,Pais"
          type="text"
          className={errorsForm.location.length > 0 ? styles.inputError : ""}
        ></input>

        {errorsForm.location.length > 0 && <p>{errorsForm.location}</p>}
      </div>

      <button disabled={loadingForm}>
        {loadingForm ? "Actualizando..." : "Actualizar"}
      </button>
    </form>
  );
};
