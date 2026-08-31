import styles from "./TakePhoto.module.css";
import { Filesystem } from "@capacitor/filesystem";
import { Camera } from "@capacitor/camera";
import { alertError } from "../../../../../../alertSwal/alertSwal.js";
import { useFormPlant } from "../../../../../../../contexts/plantContext/FormPlantContext.jsx";

export const TakePhoto = () => {
  const { loadingForm, setValuesForm, valuesForm } = useFormPlant();

  const handleTakePhoto = async () => {
    try {
      const result = await Camera.takePhoto({
        quality: 90,
        includeMetadata: true,
        targetWidth: 150,
        targetHeight: 130,
        editable: "in-app",
      });

      const { data } = await Filesystem.readFile({ path: result.uri });
      setValuesForm({ ...valuesForm, image: data });
      return;
    } catch (error) {
      if (error.indexOf("canceled") > -1) return;
      return alertError("Ups algo salio mal al capturar la foto", "");
    }
  };

  return (
    <div className={styles.takePhoto}>
      <label>Imagen (opcional)</label>
      {valuesForm.image && (
        <img src={"data:image/jpg;base64," + valuesForm.image}></img>
      )}

      <div className={styles.row}>
        <button
          className={styles.btnTake}
          disabled={loadingForm}
          type="button"
          onClick={() => handleTakePhoto()}
        >
          Tomar foto
        </button>

        {valuesForm.image && (
          <button
            className={styles.btnDelete}
            disabled={loadingForm || !valuesForm.image}
            type="button"
            onClick={() => setValuesForm({ ...valuesForm, image: null })}
          >
            Eliminar foto
          </button>
        )}
      </div>
    </div>
  );
};
