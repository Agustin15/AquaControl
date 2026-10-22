import styles from "./StateMqttConnection.module.css";
import iconConnected from "../../../assets/img/connected.png";
import iconNoConnected from "../../../assets/img/noConnected.png";
import { useMqtt } from "../../../contexts/MqttContext";
import { useState } from "react";
import { Modal } from "../../modal/Modal";
import { createPortal } from "react-dom";

export const StateMqttConnection = () => {
  const { reconnectToBroker, reconnecting, connected } = useMqtt();
  const [showStateConnection, setShowStateConnection] = useState(false);

  const handleClick = () => {
    if (connected) {
      setShowStateConnection(false);
    } else {
      reconnectToBroker();
    }
  };

  return (
    <div className={styles.connectionMqtt}>
      <button
        onClick={() =>
          showStateConnection
            ? setShowStateConnection(false)
            : setShowStateConnection(true)
        }
      >
        {reconnecting && <span class={styles.loader}></span>}
        <img
          src={connected || reconnecting ? iconConnected : iconNoConnected}
        ></img>
      </button>

      {showStateConnection &&
        createPortal(
          <Modal>
            <div className={styles.stateAdvice}>
              <div className={styles.title}>
                {reconnecting && <span class={styles.loader}></span>}
                <img
                  src={
                    connected || reconnecting ? iconConnected : iconNoConnected
                  }
                ></img>
              </div>
              {connected
                ? "App conectada con el servidor"
                : reconnecting
                ? "Reconectando al servidor..."
                : "App sin conexion con el servidor"}

              <button disabled={reconnecting} onClick={handleClick}>
                {connected
                  ? "Volver"
                  : reconnecting
                  ? "Reconectando..."
                  : "Reconectar"}
              </button>
            </div>
          </Modal>,
          document.getElementById("contentBody"),
        )}
    </div>
  );
};
