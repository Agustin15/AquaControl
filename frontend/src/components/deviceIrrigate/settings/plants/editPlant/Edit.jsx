import styles from "./Edit.module.css";
import iconEdit from "../../../../../assets/img/edit.png";
import { Form } from "../addPlant/form/Form.jsx";
import { usePlant } from "../../../../../contexts/plantContext/PlantContext.jsx";
import { useFormPlant } from "../../../../../contexts/plantContext/FormPlantContext.jsx";
import {
  alertError,
  alertSuccess,
  alertWarning,
} from "../../../../alertSwal/alertSwal.js";

export const Edit = () => {
  const { setEditPlant, editPlant, getPlants } = usePlant();

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
      await fetchPostOrPut("PUT", true);
      alertSuccess("¡Datos de la planta actualizados exitosamente!");

      setErrorsForm({
        image: "",
        umbralHumidity: "",
        description: "",
      });

      await getPlants();
    } catch (error) {
      alertError("Ups algo salio mal al actualizar datos de la planta", error);
    }

    return;
  };

  const handleClose = () => {
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
    setEditPlant(false);
  };
  return (
    <div className={styles.edit}>
      <div className={styles.header}>
        <img src={iconEdit}></img>
        <h3>Editar planta N° {editPlant.id}</h3>
        <button onClick={() => handleClose()}>Cerrar</button>
      </div>

      <Form handleSubmit={handleSubmit} method={"PUT"} />
    </div>
  );
};
