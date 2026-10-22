import styles from "./Header.module.css";
import iconConnected from "../../../assets/img/connected.png";
import iconNotConnected from "../../../assets/img/noConnected.png";
import { createPortal } from "react-dom";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useDevice } from "../../../contexts/deviceContext/DeviceContext";
import { useMqtt } from "../../../contexts/MqttContext";
import { StateMqttConnection } from "../stateMqttConnection/StateMqttConnection";
import { CurrentWeather } from "../currentWeather/CurrentWeather";
import { Modal } from "../../modal/Modal";

export const Header = () => {
  const [showDeviceConnection, setShowDeviceConnection] = useState(false);
  const { deviceSelected } = useDevice();
  const { deviceStateConnection } = useMqtt();
  let navigate = useNavigate();

  return (
    <ul className={styles.header}>
      <li className={styles.back}>
        <button onClick={() => navigate("/devices")}>Volver</button>
      </li>

      <li className={styles.deviceConnection}>
        <button onClick={() => setShowDeviceConnection(true)}>
          <h3>{deviceSelected.placeName}</h3>
          <img
            className={styles.deviceConnection}
            src={
              deviceStateConnection == "online"
                ? iconConnected
                : iconNotConnected
            }
          />
        </button>
      </li>

      <li className={styles.info}>
        <CurrentWeather />
        <StateMqttConnection />
      </li>

      {showDeviceConnection &&
        createPortal(
          <Modal>
            <div className={styles.stateAdvice}>
              <img
                src={
                  deviceStateConnection == "online"
                    ? iconConnected
                    : iconNotConnected
                }
              ></img>

              <h4>
                {deviceStateConnection == "online"
                  ? "¡Equipo de riego está en línea con el servidor!"
                  : "El equipo de riego no pudo establecer conexion con el servidor"}
              </h4>
              {deviceStateConnection == "offline" && (
                <div className={styles.steps}>
                  <span>Pasos a revisar:</span>
                  <ul>
                    <li>
                      Revise que el router al que se conecta el equipo esté
                      encendido y funcionando correctamente.
                    </li>
                    <li>
                      Revise que el equipo este conectado a la red del router.
                    </li>
                    <li>
                      Revise si el equipo esta conectado a una fuente de
                      energia.
                    </li>
                    <li>
                      Si ha realizado todo lo anterior y sigue sin establecerse
                      la conexion, es problema es de nuestros servidores.
                    </li>
                  </ul>
                </div>
              )}
              <button onClick={() => setShowDeviceConnection(false)}>
                Volver
              </button>
            </div>
          </Modal>,
          document.getElementById("contentBody"),
        )}
    </ul>
  );
};
