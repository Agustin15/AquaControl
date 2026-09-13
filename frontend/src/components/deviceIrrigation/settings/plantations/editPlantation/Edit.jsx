import styles from "./Edit.module.css";
import iconEdit from "../../../../../assets/img/edit.png";
import { Form } from "../addPlantation/form/Form.jsx";
import { usePlantation } from "../../../../../contexts/plantationContext/PlantationContext.jsx";
import { useFormPlantation } from "../../../../../contexts/plantationContext/FormPlantationContext.jsx";
import {
  alertError,
  alertSuccess,
  alertWarning,
} from "../../../../alertSwal/alertSwal.js";

export const Edit = () => {
  const { setEditPlantation, editPlantation, getPlantations } = usePlantation();

  const { fetchPostOrPut, valuesForm, setErrorsForm, handleClose } =
    useFormPlantation();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      valuesForm.humidityMax.length == 0 ||
      valuesForm.humidityMin.length == 0 ||
      valuesForm.amountPlants == 0 ||
      valuesForm.cropType == null
    )
      return alertWarning("Debe completar todos los campos correctamente");

    try {
      await fetchPostOrPut("PUT", true);
      alertSuccess("¡Datos de la plantacion actualizados exitosamente!");

      setErrorsForm({
        image: "",
        humidityMin: "",
        humidityMax: "",
        cropType: null,
        amountPlants: "",
      });

      await getPlantations();
    } catch (error) {
      alertError(
        "Ups algo salio mal al actualizar datos de la plantacion",
        error,
      );
    }
    return;
  };

  return (
    <div className={styles.edit}>
      <div className={styles.header}>
        <img src={iconEdit}></img>
        <h3>Editar plantacion N° {editPlantation.id}</h3>
        <button
          onClick={() => {
            handleClose();
            setEditPlantation(null);
          }}
        >
          Cerrar
        </button>
      </div>

      <Form handleSubmit={handleSubmit} method={"PUT"} />
    </div>
  );
};
