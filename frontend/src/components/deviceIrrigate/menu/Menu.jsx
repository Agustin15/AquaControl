import iconHumidity from "../../../assets/img/humidity.png";
import iconWaterPlant from "../../../assets/img/waterPlant.png";
import iconWaterTank from "../../../assets/img/waterTank.png";
import iconSetting from "../../../assets/img/config.png";
import styles from "./Menu.module.css";

export const Menu = ({ optionSelected, setOptionSelected }) => {
  return (
    <nav className={styles.menu}>
      <ul>
        <li>
          <button
            onClick={() => setOptionSelected("WaterTankLogs")}
            className={optionSelected == "WaterTankLogs" ? styles.selected : ""}
          >
            <img src={iconWaterTank} />
          </button>
        </li>
        <li>
          <button
            onClick={() => setOptionSelected("HumidityPlantLogs")}
            className={
              optionSelected == "HumidityPlantLogs" ? styles.selected : ""
            }
          >
            <img src={iconHumidity} />
          </button>
        </li>
        <li className={optionSelected == "Irrigate" ? styles.selected : ""}>
          <button onClick={() => setOptionSelected("Irrigate")}>
            <img src={iconWaterPlant} />
          </button>
        </li>
        <li>
          <button onClick={() => setOptionSelected("Settings")}>
            <img src={iconSetting} />
          </button>
        </li>
      </ul>
    </nav>
  );
};
