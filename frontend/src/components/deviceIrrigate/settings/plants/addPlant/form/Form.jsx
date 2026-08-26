import styles from "./Form.module.css";
import { TakePhoto } from "./takePhoto/TakePhoto";
import { useFormPlant } from "../../../../../../contexts/plantContext/FormPlantContext";

export const Form = ({ handleSubmit, method }) => {
  const { valuesForm, setValuesForm, errorsForm, setErrorsForm, loadingForm } =
    useFormPlant();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValuesForm({ ...valuesForm, [name]: value });

    let messageError = "";

    if (
      name == "umbralHumidity" &&
      (value.length == 0 || value > 100 || value < 0)
    )
      messageError = "Umbral de humedad debe estar entre 0 y 100";
    if (name == "description" && value.length > 500)
      messageError = "Descripcion no puede tener mas de 500 caracteres";

    setErrorsForm({
      ...errorsForm,
      [name]: messageError,
    });
  };

  return (
    <form onSubmit={(event) => handleSubmit(event)} className={styles.form}>
      <TakePhoto />
      <div className={styles.columnInput}>
        <label>Umbral de humedad</label>
        <input
          onChange={(event) => handleChange(event)}
          value={valuesForm.umbralHumidity}
          max={100}
          min={0}
          name="umbralHumidity"
          placeholder="Ingrese umbral de humedad entre 0 y 100"
          type="number"
          className={
            errorsForm.umbralHumidity.length > 0 ? styles.inputError : ""
          }
        ></input>
        {errorsForm.umbralHumidity.length > 0 && (
          <p>{errorsForm.umbralHumidity}</p>
        )}
      </div>

      <div className={styles.columnInput}>
        <label>Descripcion (opcional)</label>
        <textarea
          maxLength={500}
          onChange={(event) => handleChange(event)}
          value={valuesForm.description}
          name="description"
          placeholder="Ingrese descripcion"
          type="text"
          className={errorsForm.description.length > 0 ? styles.inputError : ""}
        ></textarea>

        {errorsForm.description.length > 0 && <p>{errorsForm.description}</p>}
      </div>

      <button
        className={method == "POST" ? styles.btnAdd : styles.btnUpdate}
        disabled={loadingForm}
      >
        {loadingForm
          ? method == "POST"
            ? "Agregando..."
            : "Actualizando..."
          : method == "POST"
            ? "Agregar"
            : "Actualizar"}
      </button>
    </form>
  );
};
