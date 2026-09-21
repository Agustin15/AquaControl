import iconEdit from "../../../assets/img/edit.png";
import styles from "./EditDevice.module.css";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { useDevice } from "../../../contexts/DeviceContext.jsx";
import { fetchUpdateDevice } from "./functions.js";

export const EditDevice = ({ editDevice, setEditDevice }) => {
  const [placeName, setPlacename] = useState(editDevice.placeName);
  const [error, setError] = useState("");
  const { updateAccessToken } = useAuth();
  const { getUserDevices } = useDevice();
  const [loadingForm, setLoadingForm] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    if (placeName.length == 0) {
      setError("Nombre de dispositivo puede estar vacio");
      return;
    }
    setLoadingForm(true);
    const result = await fetchUpdateDevice(
      { ...editDevice, placeName: placeName },
      updateAccessToken,
      true,
    );
    if (result) await getUserDevices();
    setLoadingForm(false);
  };

  return (
    <div className={styles.editDevice}>
      <div className={styles.header}>
        <img src={iconEdit}></img>
        <h3>Editar nombre del dispositivo</h3>
        <button disabled={loadingForm} onClick={() => setEditDevice(null)}>
          Cerrar
        </button>
      </div>

      <form onSubmit={(event) => handleSubmit(event)} className={styles.form}>
        <div className={styles.columnInput}>
          <label>Nombre del lugar</label>
          <input
            onChange={(event) => setPlacename(event.target.value)}
            value={placeName}
            placeholder="Ingrese nombre de lugar"
            type="text"
            className={error.length > 0 ? styles.inputError : ""}
          ></input>

          {error.length > 0 && <p>*{error}</p>}
        </div>

        <button disabled={loadingForm}>
          {loadingForm ? "Actualizando..." : "Actualizar"}
        </button>
      </form>
    </div>
  );
};
