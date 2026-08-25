import styles from "./StateMqttConnection.module.css";
import iconConnected from "../../../assets/img/connected.png";
import iconNoConnected from "../../../assets/img/noConnected.png";
import { useMqtt } from "../../../contexts/MqttContext";
import { useState } from "react";

export const StateMqttConnection = () => {
  const { mqttClient } = useMqtt();
  const [showState, setShowState] = useState(false);

  return (
    <div className={styles.connectionMqtt}>
      <button
        onClick={() => (showState ? setShowState(false) : setShowState(true))}
      >
        <img
          className={styles.iconConnected}
          src={mqttClient.connected == false ? iconNoConnected : iconConnected}
        ></img>
      </button>

      {showState && (
        <div className={styles.stateAdvice}>
          {mqttClient.connected ? "Conectado" : "Sin conexion"}
          <img src={iconConnected}></img>
        </div>
      )}
    </div>
  );
};
