import styles from "./EditPlace.module.css";
import { alertWarning } from "../../../alertSwal/alertSwal.js";
import { useCrudDevice } from "../../../../contexts/CrudDeviceContext.jsx";
import { useDevice } from "../../../../contexts/DeviceContext.jsx";

export const EditPlace = () => {
  const {
    errorsForm,
    loadingForm,
    valuesForm,
    setValuesForm,
    setErrorsForm,
    fetchPostOrPut,
  } = useCrudDevice();

  const { getUserDevices } = useDevice();

  const handleChange = (event) => {
    const { name, value } = event.target;

    let inputError = "";

    if (value.length == 0 && name == "placeName")
      inputError = "Lugar no puede estar vacio";
    else if (
      value.length > 0 &&
      name == "location" &&
      !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+,\s*[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)
    )
      inputError = "Formato de ubicacion debe ser Ciudad,Pais";

    setValuesForm({ ...valuesForm, [name]: value });

    setErrorsForm({
      ...errorsForm,
      [name]: inputError,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (valuesForm.placeName.length == 0)
      return alertWarning("Nombre de lugar no puede estar vacio");

    const result = await fetchPostOrPut("PUT", true);
    if (result) await getUserDevices();
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
        <label>Ubicacion geografica del riego(opcional)</label>
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
