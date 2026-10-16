import styles from "./CurrentWeather.module.css";
import iconTemperature from "../../../assets/img/temperatureWeather.png";
import iconHumidity from "../../../assets/img/humidityIndicator.png";
import iconNoWeather from "../../../assets/img/noWeather.png";
import { useMqtt } from "../../../contexts/MqttContext";

export const CurrentWeather = () => {
  const { liveWeather } = useMqtt();
  return (
    <ul className={styles.currentWeather}>
      <li className={liveWeather == null ? styles.noWeather : ""}>
        <img
          className={liveWeather ? styles.iconSky : ""}
          src={liveWeather ? `https:${liveWeather.icon}` : iconNoWeather}
        ></img>

        {liveWeather ? (
          <div className={styles.column}>
            <div>
              <img src={iconTemperature}></img>
              <span>{liveWeather.temperature}°</span>
            </div>

            <div>
              <img src={iconHumidity}></img>
              <span>{liveWeather.humidity}%</span>
            </div>
          </div>
        ) : (
          <span>Sin datos del clima</span>
        )}
      </li>
    </ul>
  );
};
