import styles from "./DeviceIrrigation.module.css";
import iconDevice from "../../assets/img/device.png";
import { useState } from "react";
import { useDevice } from "../../contexts/DeviceContext";
import { useNavigate } from "react-router";
import { useWeather } from "../../contexts/WeatherContext";
import { LogsWeekdayProvider } from "../../contexts/LogsWeekdayContext";
import { PlantProvider } from "../../contexts/plantContext/PlantContext";
import { TankProvider } from "../../contexts/tankContext/TankContext";
import { UserDevicesTokensProvider } from "../../contexts/UserDevicesTokenContext";
import { HumidityPlantLogs } from "./humidityPlantLogs/HumidityPlantLogs";
import { Menu } from "./menu/Menu";
import { WaterTankLogs } from "./waterTankLogs/WaterTankLogs";
import { Settings } from "./settings/Settings";
import { Irrigation } from "./irrigation/Irrigation";
import { StateMqttConnection } from "./stateMqttConnection/StateMqttConnection";
import { CurrentWeather } from "./currentWeather/CurrentWeather";
import { Notification } from "./notification/Notification";

export const DeviceIrrigation = () => {
  const [optionSelected, setOptionSelected] = useState("Irrigation");
  const { deviceSelected } = useDevice();
  const { currentWeather } = useWeather();

  let navigate = useNavigate();

  return (
    <div id="contentBody" className={styles.contentBody}>
      <UserDevicesTokensProvider>
        <Notification />
      </UserDevicesTokensProvider>
      
      <div className={styles.menuDevice}>
        {deviceSelected.location && (
          <CurrentWeather currentWeather={currentWeather} />
        )}
        <StateMqttConnection />
        
        <img src={iconDevice}></img>
        <h3>{deviceSelected.placeName}</h3>
        <button className={styles.back} onClick={() => navigate("/devices")}>
          Volver
        </button>
      </div>

      <div className={styles.row}>
        <Menu
          optionSelected={optionSelected}
          setOptionSelected={setOptionSelected}
        />
        <div className={styles.mainContent}>
          {optionSelected == "WaterTankLogs" && (
            <TankProvider>
              <LogsWeekdayProvider>
                <WaterTankLogs />
              </LogsWeekdayProvider>
            </TankProvider>
          )}

          {optionSelected == "HumidityPlantLogs" && (
            <PlantProvider>
              <LogsWeekdayProvider>
                <HumidityPlantLogs />
              </LogsWeekdayProvider>
            </PlantProvider>
          )}

          {optionSelected == "Irrigation" && (
            <PlantProvider>
              <TankProvider>
                <Irrigation />
              </TankProvider>
            </PlantProvider>
          )}

          {optionSelected == "Settings" && <Settings />}
        </div>
      </div>
    </div>
  );
};
