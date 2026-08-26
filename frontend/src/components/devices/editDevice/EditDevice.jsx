import styles from "./EditDevice.module.css";
import iconEdit from "../../../assets/img/edit.png";
import { useState } from "react";
import { EditPlace } from "./editPlace/EditPlace";
import { EditWifiCredentials } from "./editWifiCredentials/EditWifiCredentials";
import { useCrudDevice } from "../../../contexts/CrudDeviceContext";

export const EditDevice = () => {
  const { handleClose, loadingForm, setEditDevice } =
    useCrudDevice();
  const [optionSelected, setOptionSelected] = useState("editPlace");

  return (
    <div className={styles.editDevice}>
      <div className={styles.header}>
        <img src={iconEdit}></img>
        <h3>Editar dispositivo</h3>
        <button
          disabled={loadingForm}
          onClick={() => {
            setEditDevice(null);
            handleClose();
          }}
        >
          Cerrar
        </button>
      </div>

      <div className={styles.option}>
        <button
          onClick={() =>
            setOptionSelected(
              optionSelected == "editPlace" ? "editConnection" : "editPlace",
            )
          }
        >
          {optionSelected == "editConnection"
            ? "Ir a editar nombre del lugar"
            : "Ir a editar credenciales de conexion WIFI"}
        </button>
      </div>

      {optionSelected == "editPlace" ? <EditPlace /> : <EditWifiCredentials />}
    </div>
  );
};
