import styles from "./Edit.module.css";
import iconEdit from "../../../../../assets/img/edit.png";
import { Form } from "../addPlant/form/Form.jsx";
import { usePlant } from "../../../../../contexts/PlantContext.jsx";
import {
  alertError,
  alertSuccess,
  alertWarning,
} from "../../../../alertSwal/alertSwal.js";

export const Edit = () => {
  const {
    setEditPlant,
    editPlant,
    fetchPostOrPut,
    valuesForm,
    setValuesForm,
    errorsForm,
    setErrorsForm,
    getPlants,
  } = usePlant();

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
