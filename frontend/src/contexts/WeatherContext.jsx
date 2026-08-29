import { createContext, useContext, useEffect, useState } from "react";
import { useMqtt } from "../contexts/MqttContext";
import { useDevice } from "./DeviceContext";

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const { mqttClient } = useMqtt();
  const [currentWeather, setCurrentWeather] = useState(null);
  const { deviceSelected } = useDevice();

  useEffect(() => {
    if (!mqttClient.connected || !deviceSelected) return;

    mqttClient.subscribe(
      `device/${deviceSelected.id}/weather`,
      { qos: 2 },
      (error) => {
        if (!error) getCurrentWeather();
      },
    );
  }, [mqttClient, deviceSelected]);

  const getCurrentWeather = () => {
    mqttClient.on("message", (topic, message) => {
      if (topic != `device/${deviceSelected.id}/weather`) return;
      const weather = JSON.parse(message.toString());
      setCurrentWeather(weather);
    });
  };

  return (
    <WeatherContext.Provider value={{ currentWeather }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => useContext(WeatherContext);
