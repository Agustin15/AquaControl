import styles from "./DeviceIrrigation.module.css";
import { useState } from "react";
import { LogsWeekdayProvider } from "../../contexts/LogsWeekdayContext";
import { PlantationProvider } from "../../contexts/plantationContext/PlantationContext";
import { TankProvider } from "../../contexts/tankContext/TankContext";
import { AlertProvider } from "../../contexts/AlertContext";
import { UserDevicesTokensProvider } from "../../contexts/UserDevicesTokenContext";
import { HumidityPlantationLogs } from "./humidityPlantationLogs/HumidityPlantationLogs";
import { Menu } from "./menu/Menu";
import { WaterTankLogs } from "./waterTankLogs/WaterTankLogs";
import { Settings } from "./settings/Settings";
import { Irrigation } from "./irrigation/Irrigation";
import { Notification } from "./notification/Notification";
import { Alerts } from "./alerts/Alerts";
import { Header } from "./header/Header";

export const DeviceIrrigation = () => {
  const [optionSelected, setOptionSelected] = useState("WaterTankLogs");

  return (
    <div id="contentBody" className={styles.contentBody}>
      <AlertProvider>
        <UserDevicesTokensProvider>
          <Notification />
        </UserDevicesTokensProvider>
      </AlertProvider>

      <Header />
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

          {optionSelected == "HumidityPlantationLogs" && (
            <PlantationProvider>
              <LogsWeekdayProvider>
                <HumidityPlantationLogs />
              </LogsWeekdayProvider>
            </PlantationProvider>
          )}

          {optionSelected == "Irrigation" && (
            <PlantationProvider>
              <TankProvider>
                <Irrigation />
              </TankProvider>
            </PlantationProvider>
          )}

          {optionSelected == "Settings" && <Settings />}

          {optionSelected == "Alerts" && (
            <AlertProvider>
              <Alerts />
            </AlertProvider>
          )}
        </div>
      </div>
    </div>
  );
};
