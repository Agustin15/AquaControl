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
      mqttClient.subscribe("device/plant/humidity", { qos: 0 }, (error) => {
        if (!error) console.log("Subscripcion humedad planta realizada");
      });

      mqttClient.subscribe("device/tank/waterLevel", { qos: 0 }, (error) => {
        if (!error) console.log("Subscripcion nivel del agua tanque realizada");
      });
    });

    mqttClient.on("error", (error) => {
      console.log(error);
      mqttClient.end();
    });
  }, [mqttClient]);

  return (
    <MqttContext.Provider value={{ mqttClient }}>
      {children}
    </MqttContext.Provider>
  );
};

export const useMqtt = () => useContext(MqttContext);
