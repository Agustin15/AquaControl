import styles from "./Add.module.css";
import iconAdd from "../../../../../assets/img/add.png";
import { Form } from "./form/Form.jsx";
import { useTank } from "../../../../../contexts/tankContext/TankContext.jsx";
import { useFormTank } from "../../../../../contexts/tankContext/FormTankContext.jsx";
import {
  alertError,
  alertSuccess,
  alertWarning,
} from "../../../../alertSwal/alertSwal.js";

export const Add = () => {
  const { setShowFormAdd, getTanks } = useTank();
  const { fetchPostOrPut, valuesForm, setValuesForm, setErrorsForm } =
    useFormTank();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (valuesForm.height.length == 0 || valuesForm.height <= 0)
      return alertWarning("Debe completar correctamente el campo altura");

    try {
      await fetchPostOrPut("POST", true);
      alertSuccess("¡Tanque agregado exitosamente!");

      setValuesForm({
        id: 0,
        height: 0,
      });

      setErrorsForm({
        id: "",
        height: "",
      });

      await getTanks();
    } catch (error) {
      alertError("Ups algo salio mal al agregar un nuevo tanque", error);
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

    setShowFormAdd(false);
  };
  return (
    <div className={styles.add}>
      <div className={styles.header}>
        <img src={iconAdd}></img>
        <h3>Agregar tanque</h3>
        <button onClick={() => handleClose()}>Cerrar</button>
      </div>

      <Form handleSubmit={handleSubmit} method={"POST"} />
    </div>
  );
};
