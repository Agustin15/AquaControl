import styles from "./Form.module.css";
import { TakePhoto } from "./takePhoto/TakePhoto";
import { useFormPlantation } from "../../../../../../contexts/plantationContext/FormPlantationContext";
import { CropsTypes } from "./cropsTypes/CropsTypes";

export const Form = ({ handleSubmit, method }) => {
  const { handleChange, loadingForm, valuesForm, setValuesForm, errorsForm } =
    useFormPlantation();

  return (
    <form onSubmit={(event) => handleSubmit(event)} className={styles.form}>
      <TakePhoto />
      <CropsTypes />

      <div className={styles.columnInput}>
        <label>Humedad minima</label>
        <input
          onChange={(event) => handleChange(event)}
          value={valuesForm.humidityMin}
          max={100}
          min={0}
          name="humidityMin"
          placeholder="Humedad minima debe estar entre 0 y 100"
          type="number"
          className={errorsForm.humidityMin.length > 0 ? styles.inputError : ""}
        ></input>
        {errorsForm.humidityMin.length > 0 && <p>{errorsForm.humidityMin}</p>}
      </div>

      <div className={styles.columnInput}>
        <label>Humedad maxima</label>
        <input
          onChange={(event) => handleChange(event)}
          value={valuesForm.humidityMax}
          max={100}
          min={0}
          name="humidityMax"
          placeholder="Humedad maxima debe estar entre 0 y 100"
          type="number"
          className={errorsForm.humidityMax.length > 0 ? styles.inputError : ""}
        ></input>
        {errorsForm.humidityMax.length > 0 && <p>{errorsForm.humidityMax}</p>}
      </div>

      <div className={styles.columnInput}>
        <label>Cantidad de plantas sembradas</label>
        <input
          onChange={(event) => handleChange(event)}
          value={valuesForm.amountPlants}
          type="number"
          name="amountPlants"
          placeholder="Cantidad del plantas sembradas"
          min={1}
          max={10}
        ></input>
        {errorsForm.amountPlants.length > 0 && <p>{errorsForm.amountPlants}</p>}
      </div>

      <div className={styles.containCheckbox}>
        <label>Indoor</label>
        <input
          onChange={() =>
            setValuesForm({
              ...valuesForm,
              indoor: valuesForm.indoor ? false : true,
            })
          }
          checked={valuesForm.indoor}
          type="checkbox"
        ></input>
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
