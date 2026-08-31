import styles from "./CurrentWeather.module.css";
import iconTemperature from "../../../assets/img/temperatureWeather.png";
import iconHumidity from "../../../assets/img/humidityIndicator.png";
import iconNoWeather from "../../../assets/img/noWeather.png";

export const CurrentWeather = ({ currentWeather }) => {
  return (
    <ul className={styles.currentWeather}>
      <li className={currentWeather == null ? styles.noWeather : ""}>
        <img
          className={currentWeather ? styles.iconSky : ""}
          src={currentWeather ? `https:${currentWeather.icon}` : iconNoWeather}
        ></img>

        {currentWeather ? (
          <div className={styles.column}>
            <div>
              <img src={iconTemperature}></img>
              <span>{currentWeather.temperature}°</span>
            </div>

            <div>
              <img src={iconHumidity}></img>
              <span>{currentWeather.humidity}%</span>
            </div>
          </div>
        ) : (
          <span>Sin datos del clima</span>
        )}
      </li>
    </ul>
  );
};
