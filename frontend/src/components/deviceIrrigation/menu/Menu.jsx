import iconHumidity from "../../../assets/img/humidity.png";
import iconWaterPlantation from "../../../assets/img/waterPlantation.png";
import iconAlert from "../../../assets/img/notification.png";
import iconWaterTank from "../../../assets/img/waterTank.png";
import iconSetting from "../../../assets/img/config.png";
import styles from "./Menu.module.css";
import { useAuth } from "../../../contexts/AuthContext";
import { useDevice } from "../../../contexts/deviceContext/DeviceContext";
import { useEffect, useState } from "react";

export const Menu = ({ optionSelected, setOptionSelected }) => {
  const { userAuth } = useAuth();
  const { deviceSelected } = useDevice();
  const [userIsOperator, setUserIsOperator] = useState(false);

  useEffect(() => {
    if (!userAuth) return;
    let userIsOperator = deviceSelected.usersOfDevice.find(
      (ud) => ud.user.id == userAuth.id && ud.role == "Operador",
    );

    setUserIsOperator(userIsOperator);
  }, [userAuth]);

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
            onClick={() => setOptionSelected("HumidityPlantationLogs")}
            className={
              optionSelected == "HumidityPlantationLogs" ? styles.selected : ""
            }
          >
            <img src={iconHumidity} />
          </button>
        </li>
        <li className={optionSelected == "Irrigation" ? styles.selected : ""}>
          <button onClick={() => setOptionSelected("Irrigation")}>
            <img src={iconWaterPlantation} />
          </button>
        </li>
        <li>
          <button onClick={() => setOptionSelected("Alerts")}>
            <img src={iconAlert} />
          </button>
        </li>
        {userIsOperator && (
          <li>
            <button onClick={() => setOptionSelected("Settings")}>
              <img src={iconSetting} />
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};
