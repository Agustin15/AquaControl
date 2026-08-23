import mqtt from "mqtt";
const mqttUrlBroker = import.meta.env.VITE_URL_MQTT_BROKER;
const brokerUsername = import.meta.env.VITE_BROKER_USERNAME;
const brokerPassword = import.meta.env.VITE_BROKER_PASSWORD;
import { createContext, useContext, useEffect, useState } from "react";

const MqttContext = createContext();

export const MqttProvider = ({ children }) => {
  const [mqttClient, setMqttClient] = useState(
    mqtt.connect(mqttUrlBroker, {
      username: brokerUsername,
      password: brokerPassword,
    }),
  );

  useEffect(() => {
    if (!mqttClient) return;

    mqttClient.on("connect", () => {
      console.log("Connectado al broker");
    });

    mqttClient.on("error", (error) => {
      console.log(error);
      mqttClient.end();
    });

    if (mqttClient.disconnected) connect();
  }, [mqttClient]);

  const connect = async () => {
    const connection = mqtt.connect(mqttUrlBroker, {
      username: brokerUsername,
      password: brokerPassword,
    });

    setMqttClient(connection);
  };

  return (
    <MqttContext.Provider value={{ mqttClient }}>
      {children}
    </MqttContext.Provider>
  );
};

export const useMqtt = () => useContext(MqttContext);
