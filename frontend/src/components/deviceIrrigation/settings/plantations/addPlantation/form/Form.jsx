import styles from "./Form.module.css";
import { TakePhoto } from "./takePhoto/TakePhoto";
import { useFormPlantation } from "../../../../../../contexts/plantationContext/FormPlantationContext";
import { usePlantation } from "../../../../../../contexts/plantationContext/PlantationContext";
import { CropsTypes } from "./cropsTypes/CropsTypes";
import { Buttons } from "./buttons/Buttons";

export const Form = ({ handleSubmit, method }) => {
  const { handleChange, valuesForm, setValuesForm, errorsForm } =
    useFormPlantation();
  const { cropsTypes } = usePlantation();

  console.log(valuesForm);
  return (
    <form onSubmit={(event) => handleSubmit(event)} className={styles.form}>
      <TakePhoto />
      <CropsTypes />

      <div className={styles.row}>
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
            className={
              errorsForm.humidityMin.length > 0 ? styles.inputError : ""
            }
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
            className={
              errorsForm.humidityMax.length > 0 ? styles.inputError : ""
            }
          ></input>
          {errorsForm.humidityMax.length > 0 && <p>{errorsForm.humidityMax}</p>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.columnInput}>
          <label>Cantidad de sembrado</label>
          <input
            onChange={(event) => handleChange(event)}
            value={valuesForm.amountPlants}
            type="number"
            name="amountPlants"
            placeholder="Cantidad de sembrado"
            min={1}
            max={10}
          ></input>
          {errorsForm.amountPlants.length > 0 && (
            <p>{errorsForm.amountPlants}</p>
          )}
        </div>

        <div className={styles.containCheckbox}>
          <label>Indoor</label>
          <input
            onClick={(event) =>
              setValuesForm({
                ...valuesForm,
                indoor: event.target.checked,
              })
            }
            defaultChecked={valuesForm.indoor}
            type="checkbox"
          ></input>
        </div>
      </div>
      {cropsTypes.length > 0 && <Buttons method={method} />}
    </form>
  );
};
