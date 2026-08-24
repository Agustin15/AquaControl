import styles from "./StateMqttConnection.module.css";
import iconConnected from "../../../assets/img/connected.png";
import iconWarning from "../../../assets/img/warningConnection.png";
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
        {mqttClient.connected == false && (
          <img className={styles.iconWarning} src={iconWarning}></img>
        )}
        <img className={styles.iconConnected} src={iconConnected}></img>
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
