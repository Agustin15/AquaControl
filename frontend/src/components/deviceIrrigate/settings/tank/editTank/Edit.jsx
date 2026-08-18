import styles from "./Edit.module.css";
import iconEdit from "../../../../../assets/img/edit.png";
import { Form } from "../addTank/form/Form.jsx";
import {
  alertError,
  alertSuccess,
  alertWarning,
} from "../../../../alertSwal/alertSwal.js";
import { useTank } from "../../../../../contexts/TankContext.jsx";

export const Edit = () => {
  const {
    setEditTank,
    fetchPostOrPut,
    valuesForm,
    setValuesForm,
    errorsForm,
    setErrorsForm,
    getTanks,
  } = useTank();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (valuesForm.height.length == 0 || valuesForm.height <= 0)
      return alertWarning("Debe completar correctamente el campo altura");

    try {
      await fetchPostOrPut("PUT", true);
      alertSuccess("¡Datos del tanque actualizado exitosamente!");

      await getTanks();
    } catch (error) {
      alertError(
        "Ups algo salio mal al actualizar los datos del tanque",
        error,
      );
    }

    return;
  };

  const handleClose = () => {
    setValuesForm({
      id: 0,
      height: 0,
    });

    setErrorsForm({
      id: "",
      height: "",
    });

    setEditTank(null);
  };
  return (
    <div className={styles.edit}>
      <div className={styles.header}>
        <img src={iconEdit}></img>
        <h3>Editar tanque</h3>
        <button onClick={() => handleClose()}>Cerrar</button>
      </div>

      <Form handleSubmit={handleSubmit} method={"PUT"} />
    </div>
  );
};
