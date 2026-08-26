import styles from "./AddDevice.module.css";
import iconAdd from "../../../assets/img/add.png";
import { useDevice } from "../../../contexts/DeviceContext";
import { useState } from "react";
import { InfoToBind } from "./infoToBind/InfoToBind";
import { Form } from "./form/Form";
import { alertWarning } from "../../alertSwal/alertSwal.js";
import { useCrudDevice } from "../../../contexts/CrudDeviceContext.jsx";

export const AddDevice = () => {
  const { getUserDevices } = useDevice();
  const {
    loadingForm,
    valuesForm,
    handleClose,
    fetchPostOrPut,
  } = useCrudDevice();


  const [optionSelected, setOptionSelected] = useState("Form");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (Object.values(valuesForm).some((value) => value.length == 0))
      return alertWarning("Debe completar los campos correctamente");

    const result = await fetchPostOrPut("POST", true);
    if (result) getUserDevices();
  };

  return (
    <div className={styles.addDevice}>
      <div className={styles.header}>
        <img src={iconAdd}></img>
        <h3>Agregar nuevo dispositivo</h3>
        <button disabled={loadingForm} onClick={() => handleClose()}>
          Cerrar
        </button>
      </div>

      <div className={styles.option}>
        <button
          onClick={() =>
            setOptionSelected(optionSelected == "Form" ? "InfoBind" : "Form")
          }
        >
          {optionSelected == "Form"
            ? "Ver informacion para agregar un nuevo dispositivo"
            : "Regresar a agregar"}
        </button>
      </div>

      {optionSelected == "InfoBind" ? (
        <InfoToBind />
      ) : (
        <Form handleSubmit={handleSubmit} />
      )}
    </div>
  );
};
