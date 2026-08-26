import styles from "./Form.module.css";
import { useFormTank } from "../../../../../../contexts/tankContext/FormTankContext";

export const Form = ({ handleSubmit, method }) => {
  const { valuesForm, setValuesForm, errorsForm, setErrorsForm, loadingForm } =
    useFormTank();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValuesForm({ ...valuesForm, [name]: value });

    setErrorsForm({
      ...errorsForm,
      [name]:
        value.length == 0
          ? "Debe ingresar una altura"
          : value <= 0
            ? "Altura del tanque debe ser mayor a cero"
            : "",
    });
  };

  return (
    <form onSubmit={(event) => handleSubmit(event)} className={styles.form}>
      <div className={styles.columnInput}>
        <label>Altura del tanque (cm)</label>
        <input
          onChange={(event) => handleChange(event)}
          value={valuesForm.height}
          min={0}
          name="height"
          placeholder="Ingrese altura en cm"
          type="number"
          className={errorsForm.height.length > 0 ? styles.inputError : ""}
        ></input>
        {errorsForm.height.length > 0 && <p>{errorsForm.height}</p>}
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
