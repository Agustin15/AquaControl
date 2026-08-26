import styles from "./Add.module.css";
import iconAdd from "../../../../../assets/img/add.png";
import { Form } from "./form/Form.jsx";
import { usePlant } from "../../../../../contexts/plantContext/PlantContext.jsx";
import { useFormPlant } from "../../../../../contexts/plantContext/FormPlantContext.jsx";
import {
  alertError,
  alertSuccess,
  alertWarning,
} from "../../../../alertSwal/alertSwal.js";

export const Add = () => {
  const { setShowFormAdd, getPlants } = usePlant();

  const {
    fetchPostOrPut,
    valuesForm,
    setValuesForm,
    errorsForm,
    setErrorsForm,
  } = useFormPlant();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      Object.values(errorsForm).find((value) => value.length > 0) ||
      valuesForm.umbralHumidity.length == 0
    )
      return alertWarning("Debe completar todos los campos correctamente");

    try {
      await fetchPostOrPut("POST", true);
      alertSuccess("¡Planta agregada exitosamente!");

      setValuesForm({
        image: null,
        umbralHumidity: 0,
        description: "",
      });

      setErrorsForm({
        image: "",
        umbralHumidity: "",
        description: "",
      });

      await getPlants();
    } catch (error) {
      alertError("Ups algo salio mal al agregar una nueva planta", error);
    }

    return;
  };

  const handleClose = () => {
    setValuesForm({
      id: 0,
      image: null,
      umbralHumidity: 0,
      description: "",
    });

    setErrorsForm({
      image: "",
      umbralHumidity: "",
      description: "",
    });
    setShowFormAdd(false);
  };
  return (
    <div className={styles.add}>
      <div className={styles.header}>
        <img src={iconAdd}></img>
        <h3>Agregar planta</h3>
        <button onClick={() => handleClose()}>Cerrar</button>
      </div>

      <Form handleSubmit={handleSubmit} method={"POST"} />
    </div>
  );
};
