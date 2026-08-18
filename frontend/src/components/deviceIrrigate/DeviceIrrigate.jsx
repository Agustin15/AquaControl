import styles from "./DeviceIrrigate.module.css";
import iconLogo from "../../assets/img/logo.png";
import iconDevice from "../../assets/img/device.png";
import { useState } from "react";
import { useDevice } from "../../contexts/DeviceContext";
import { useNavigate } from "react-router";
import { LogsWeekdayProvider } from "../../contexts/LogsWeekdayContext";
import { PlantProvider } from "../../contexts/PlantContext";
import { TankProvider } from "../../contexts/TankContext";
import { HumidityPlantLogs } from "./humidityPlantLogs/HumidityPlantLogs";
import { Menu } from "./menu/Menu";
import { WaterTankLogs } from "./waterTankLogs/WaterTankLogs";
import { Settings } from "./settings/Settings";
import { Irrigate } from "./irrigate/Irrigate";
import { WaterPlantProvider } from "../../contexts/WaterPlantContext";

export const DeviceIrrigate = () => {
  const [optionSelected, setOptionSelected] = useState("Irrigate");
  const { deviceSelected } = useDevice();
  let navigate = useNavigate();

  return (
    <div id="contentBody" className={styles.contentBody}>
      <div className={styles.menuDevice}>
        <img src={iconDevice}></img>
        <h3>{deviceSelected.placeName}</h3>
        <button onClick={() => navigate("/devices")}>Volver</button>
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

          {optionSelected == "Irrigate" && (
            <PlantProvider>
              <TankProvider>
                <WaterPlantProvider>
                  <Irrigate />
                </WaterPlantProvider>
              </TankProvider>
            </PlantProvider>
          )}

          {optionSelected == "Settings" && <Settings />}
        </div>
      </div>
    </div>
  );
};
