import styles from "./Buttons.module.css";
import { useFormPlantation } from "../../../../../../../contexts/plantationContext/FormPlantationContext";

export const Buttons = ({ method }) => {
  const { loadingForm, clean } = useFormPlantation();

  return (
    <div className={styles.options}>
      <button
        type="submit"
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
      <button
        type="reset"
        onClick={() => clean()}
        className={styles.btnClean}
        disabled={loadingForm}
      >
        Limpiar
      </button>
    </div>
  );
};
