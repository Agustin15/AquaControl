import styles from "./AddDevice.module.css";
import iconLink from "../../../assets/img/config.png";
import { useDevice } from "../../../contexts/DeviceContext";
import { useState } from "react";
import { InfoToBind } from "./infoToBind/InfoToBind";
import { Form } from "./form/Form";
import { validation, fetchUpdateDevice } from "./function.js";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { alertSuccess } from "../../alertSwal/alertSwal.js";

export const AddDevice = ({ deviceToLink, setDeviceToLink }) => {
  const { getUserDevices } = useDevice();
  const { updateAccessToken } = useAuth();
  const [optionSelected, setOptionSelected] = useState("Form");
  const [loadingForm, setLoadingForm] = useState(false);
  const [valuesForm, setValuesForm] = useState({
    wifi: "",
    wifiPassword: "",
    location: "",
  });
  const [errorsForm, setErrorsForm] = useState({
    wifi: "",
    wifiPassword: "",
    location: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorsForm({
      wifi: "",
      wifiPassword: "",
      location: "",
    });

    const errorsForm = validation(valuesForm);

    if (Object.values(errorsForm).find((error) => error.length > 0)) {
      setErrorsForm(errorsForm);
      return;
    }

    setLoadingForm(true);
    const result = await fetchUpdateDevice(
      deviceToLink,
      valuesForm,
      updateAccessToken,
      true,
    );

    setLoadingForm(false);
    if (result) {
      alertSuccess("Dispositivo vinculado");
      return getUserDevices();
    }
  };

  return (
    <div className={styles.addDevice}>
      <div className={styles.header}>
        <img src={iconLink}></img>
        <h3>
          {deviceToLink.linked ? "Editar vinculacion del" : "Vincular"}{" "}
          dispositivo
        </h3>
        <button disabled={loadingForm} onClick={() => setDeviceToLink(null)}>
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
            ? "Ver informacion para vincular el dispositivo"
            : "Regresar a vincular"}
        </button>
      </div>

      {optionSelected == "InfoBind" ? (
        <InfoToBind />
      ) : (
        <Form
          handleSubmit={handleSubmit}
          valuesForm={valuesForm}
          setValuesForm={setValuesForm}
          errorsForm={errorsForm}
          loadingForm={loadingForm}
        />
      )}
    </div>
  );
};
