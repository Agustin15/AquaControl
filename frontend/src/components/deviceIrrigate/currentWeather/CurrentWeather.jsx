import styles from "./CurrentWeather.module.css";
import iconTemperature from "../../../assets/img/temperatureWeather.png";
import iconHumidity from "../../../assets/img/humidityIndicator.png";

export const CurrentWeather = ({ currentWeather }) => {
  return (
    <ul className={styles.currentWeather}>
      <li>
        <img
          className={styles.iconSky}
          src={"https:" + currentWeather.icon}
        ></img>
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
      </li>
    </ul>
  );
};
