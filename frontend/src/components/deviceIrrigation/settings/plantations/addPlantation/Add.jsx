import styles from "./Add.module.css";
import iconAdd from "../../../../../assets/img/add.png";
import { Form } from "./form/Form.jsx";
import { usePlantation } from "../../../../../contexts/plantationContext/PlantationContext.jsx";
import { useFormPlantation } from "../../../../../contexts/plantationContext/FormPlantationContext.jsx";
import {
  alertError,
  alertSuccess,
  alertWarning,
} from "../../../../alertSwal/alertSwal.js";

export const Add = () => {
  const { getPlantations, setShowFormAdd } = usePlantation();

  const {
    fetchPostOrPut,
    valuesForm,
    setValuesForm,
    setErrorsForm,
    handleClose,
  } = useFormPlantation();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      valuesForm.humidityMax.length == 0 ||
      valuesForm.humidityMin.length == 0 ||
      valuesForm.amountPlants == 0 ||
      valuesForm.cropType == null
    )
      return alertWarning("Debe completar todos los campos correctamente");

    if (valuesForm.humidityMax <= valuesForm.humidityMin)
      return alertWarning("Humedad maxima debe ser mayor a humedad minima");

    try {
      await fetchPostOrPut("POST", true);
      alertSuccess("¡Plantacion agregada exitosamente!");

      setValuesForm({
        id: 0,
        image: null,
        humidityMin: 0,
        humidityMax: 0,
        cropType: null,
        amountPlants: 0,
      });

      setErrorsForm({
        image: "",
        humidityMin: "",
        humidityMax: "",
        cropType: null,
        amountPlants: "",
      });

      await getPlantations();
    } catch (error) {
      alertError("Ups algo salio mal al agregar una nueva plantacion", error);
    }

    return;
  };

  return (
    <div className={styles.add}>
      <div className={styles.header}>
        <img src={iconAdd}></img>
        <h3>Agregar plantacion</h3>
        <button
          onClick={() => {
            handleClose();
            setShowFormAdd(null);
          }}
        >
          Cerrar
        </button>
      </div>

      <Form handleSubmit={handleSubmit} method={"POST"} />
    </div>
  );
};
