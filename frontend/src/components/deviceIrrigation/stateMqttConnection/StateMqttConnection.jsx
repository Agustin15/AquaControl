import styles from "./StateMqttConnection.module.css";
import iconConnected from "../../../assets/img/connected.png";
import iconNoConnected from "../../../assets/img/noConnected.png";
import { useMqtt } from "../../../contexts/MqttContext";
import { useState } from "react";
import { Modal } from "../../modal/Modal";
import { createPortal } from "react-dom";

export const StateMqttConnection = () => {
  const { reconnectToBroker, connected } = useMqtt();
  const [showState, setShowState] = useState(false);

  const handleClick = () => {
    if (connected) {
      setShowState(false);
    } else {
      reconnectToBroker();
    }
  };

  return (
    <div className={styles.connectionMqtt}>
      <button
        onClick={() => (showState ? setShowState(false) : setShowState(true))}
      >
        <img
          className={styles.iconConnected}
          src={connected == false ? iconNoConnected : iconConnected}
        ></img>
      </button>

      {showState &&
        createPortal(
          <Modal>
            <div className={styles.stateAdvice}>
              <img src={iconConnected}></img>

              {connected
                ? "Conectado al servidor"
                : "Sin conexion con el servidor"}

              <button onClick={handleClick}>
                {connected ? "Volver" : "Reconectar"}
              </button>
            </div>
          </Modal>,
          document.getElementById("contentBody"),
        )}
    </div>
  );
};
