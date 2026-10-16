import mqtt from "mqtt";
const mqttUrlBroker = import.meta.env.VITE_URL_MQTT_BROKER;
const brokerUsername = import.meta.env.VITE_BROKER_USERNAME;
const brokerPassword = import.meta.env.VITE_BROKER_PASSWORD;
import { createContext, useContext, useEffect, useState } from "react";
import { alertError, alertWarning } from "../components/alertSwal/alertSwal";
import { useDevice } from "./deviceContext/DeviceContext";

const MqttContext = createContext();

export const MqttProvider = ({ children }) => {
  const [mqttClient, setMqttClient] = useState(
    mqtt.connect(mqttUrlBroker, {
      username: brokerUsername,
      password: brokerPassword,
      reconnectPeriod: 1000,
    }),
  );

  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);

  const [tankLiveSelected, setTankLiveSelected] = useState(null);
  const [plantationLiveSelected, setPlantationLiveSelected] = useState(null);
  const [currentHumidityPlantation, setCurrentHumidityPlantation] = useState(0);
  const [currentLevelTank, setCurrentLevelTank] = useState(0);
  const [waterPlantationLiveInProgress, setWaterPlantationLiveInProgress] =
    useState(false);
  const [liveWeather, setLiveWeather] = useState(null);
  const { deviceSelected } = useDevice();

  useEffect(() => {
    if (!mqttClient) return;

    setConnected(mqttClient.connected);

    mqttClient.on("connect", () => {
      setConnected(true);
      setReconnecting(false);
    });

    mqttClient.on("error", (error) => {
      console.log(error);
    });

    mqttClient.on("offline", () => {
      setConnected(false);
    });

    mqttClient.on("disconect", () => {
      setConnected(false);
    });

    mqttClient.on("reconnect", () => {
      setConnected(false);
      setReconnecting(true);
    });
  }, [mqttClient]);

  useEffect(() => {
    if (!deviceSelected) return;

    mqttClient.removeListener("message", receiveMessages);
    mqttClient.on("message", receiveMessages);
  }, [
    deviceSelected,
    tankLiveSelected,
    plantationLiveSelected,
    waterPlantationLiveInProgress,
  ]);

  useEffect(() => {
    if (!deviceSelected) return;

    subscribeWeather();
  }, [deviceSelected]);

  const reconnectToBroker = () => {
    mqttClient.reconnect();
  };

  const subscribeToTopic = (topic, qos) => {
    mqttClient.subscribe(topic, { qos: qos }, (error) => {
      if (error) {
        throw error;
      }
    });
  };

  const subscribeHumidityPlantation = (plantation) => {
    let topic = `device/${deviceSelected.id}/plantation/${plantation.id}/humidity`;
    try {
      if (plantationLiveSelected) {
        mqttClient.unsubscribe(topic);
      }
      subscribeToTopic(topic, 0);
    } catch {
      alertError(
        "Error al conectar con la plantacion",
        "No se pudo establecer conexion con el servidor",
      );
    }
  };

  const subscribeWaterTankLevel = (tank) => {
    let topic = `device/${deviceSelected.id}/tank/${tank.id}/waterLevel`;
    try {
      if (tankLiveSelected) {
        mqttClient.unsubscribe(topic);
      }

      subscribeToTopic(topic, 0);
    } catch {
      alertError(
        "Error al conectar con el tanque",
        "No se pudo establecer conexion con el servidor",
      );
    }
  };

  const subscribeWaterPlantation = () => {
    try {
      subscribeToTopic(`device/${deviceSelected.id}/waterPlantation`, 2);
    } catch {
      alertError(
        "Error al conectar con el riego",
        "No se pudo establecer conexion con el servidor",
      );
    }
  };

  const subscribeWeather = () => {
    try {
      subscribeToTopic(`device/${deviceSelected.id}/weather`, 2);
    } catch {
      alertError(
        "Error al conectar con los datos del clima del dispositivo",
        "No se pudo establecer conexion con el servidor",
      );
    }
  };

  function receiveMessages(topic, message) {
    switch (true) {
      case tankLiveSelected &&
        topic ==
          `device/${deviceSelected.id}/tank/${tankLiveSelected.id}/waterLevel`:
        const { waterLevel } = JSON.parse(message.toString());
        setCurrentLevelTank(waterLevel);
        break;
      case plantationLiveSelected &&
        topic ==
          `device/${deviceSelected.id}/plantation/${plantationLiveSelected.id}/humidity`:
        const { humidity } = JSON.parse(message.toString());
        setCurrentHumidityPlantation(humidity);
        break;

      case topic == `device/${deviceSelected.id}/waterPlantation`:
        const { state } = JSON.parse(message.toString());

        if (state == "En curso" && !waterPlantationLiveInProgress) {
          setWaterPlantationLiveInProgress(true);
        } else setWaterPlantationLiveInProgress(false);
        break;

      case topic == `device/${deviceSelected.id}/weather`:
        const weather = JSON.parse(message.toString());
        setLiveWeather(weather);
        break;
    }
  }

  const sendStartWaterPlantation = async () => {
    const result = await mqttClient.publishAsync(
      `device/${deviceSelected.id}/waterPlantation`,
      JSON.stringify({
        idPlantation: plantationLiveSelected.id,
        idTank: tankLiveSelected.id,
        state: "En curso",
      }),
      { qos: 2, retain: true },
    );

    if (!result)
      return alertWarning(
        "Ups,la conexion con el sistema de riego no se pudo establecer",
      );

    setWaterPlantationLiveInProgress(true);
  };

  const sendStopWaterPlantation = async () => {
    const result = await mqttClient.publishAsync(
      `device/${deviceSelected.id}/waterPlantation`,
      JSON.stringify({
        idPlantation: plantationLiveSelected.id,
        idTank: tankLiveSelected.id,
        state: "Interrumpido",
      }),
      { qos: 2, retain: true },
    );

    if (!result)
      return alertWarning(
        "Ups,la conexion con el sistema de riego no se pudo establecer",
      );

    setWaterPlantationLiveInProgress(false);
  };

  return (
    <MqttContext.Provider
      value={{
        connected,
        reconnecting,
        reconnectToBroker,
        subscribeHumidityPlantation,
        subscribeWaterTankLevel,
        subscribeWaterPlantation,
        currentHumidityPlantation,
        currentLevelTank,
        sendStartWaterPlantation,
        sendStopWaterPlantation,
        plantationLiveSelected,
        setPlantationLiveSelected,
        tankLiveSelected,
        setTankLiveSelected,
        waterPlantationLiveInProgress,
        liveWeather,
      }}
    >
      {children}
    </MqttContext.Provider>
  );
};

export const useMqtt = () => useContext(MqttContext);
