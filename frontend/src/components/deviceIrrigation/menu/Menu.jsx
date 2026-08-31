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
            <img width={"34px"} height={"34px"} src={iconWaterTank} />
          </button>
        </li>
        <li>
          <button
            onClick={() => setOptionSelected("HumidityPlantLogs")}
            className={
              optionSelected == "HumidityPlantLogs" ? styles.selected : ""
            }
          >
            <img width={"30px"} height={"30px"} src={iconHumidity} />
          </button>
        </li>
        <li className={optionSelected == "Irrigation" ? styles.selected : ""}>
          <button onClick={() => setOptionSelected("Irrigation")}>
            <img width={"31px"} height={"31px"} src={iconWaterPlant} />
          </button>
        </li>
        <li>
          <button onClick={() => setOptionSelected("Settings")}>
            <img width={"33px"} height={"33px"} src={iconSetting} />
          </button>
        </li>
      </ul>
    </nav>
  );
};
