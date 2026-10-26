import styles from "./CurrentIrrigation.module.css";
import {
  getCustomsToHumidityAccordigMeasure,
  getCustomsToTankAccordigMeasure,
} from "./function.js";
import iconInfo from "../../../../assets/img/info.png";
import { useMqtt } from "../../../../contexts/MqttContext.jsx";
import { useState } from "react";
import { DrawingLevelTank } from "../../drawingLevelTank/DrawingLevelTank.jsx";
import { DrawingLevelHumidity } from "../../drawingLevelHumidity/DrawingLevelHumidity.jsx";
import { SvgRepresentation } from "./svgReprentation/SvgRepresentation.jsx";
import { DetailsPlantation } from "./detailsPlantation/DetailsPlantation.jsx";
import { createPortal } from "react-dom";
import { Modal } from "../../../modal/Modal.jsx";

export const CurrentIrrigation = () => {
  const {
    currentHumidityPlantation,
    currentLevelTank,
    plantationLiveSelected,
  } = useMqtt();

  const [showInfoPlantation, setShowInfoPlantation] = useState(false);

  const { messageTank, colorMessageTank } =
    getCustomsToTankAccordigMeasure(currentLevelTank);

  const { messageHumidity, colorMessageHumidity } =
    getCustomsToHumidityAccordigMeasure(
      currentHumidityPlantation,
      plantationLiveSelected,
    );

  return (
    <div className={styles.currentIrrigate}>
      <SvgRepresentation />

      <ul className={styles.details}>
        <li>
          <DrawingLevelTank currentLevelTank={currentLevelTank} />
          <div className={styles.column}>
            <span>Nivel de agua tanque:{currentLevelTank}%</span>
            <b style={{ color: colorMessageTank }}>{messageTank}</b>
          </div>
        </li>

        <li>
          <DrawingLevelHumidity humidity={currentHumidityPlantation} />
          <div className={styles.column}>
            <span>
              Humedad tierra:{currentHumidityPlantation}/
              {plantationLiveSelected.cropType.humidityMax}%
            </span>
            <b style={{ color: colorMessageHumidity }}>{messageHumidity}</b>
          </div>
        </li>

        <li>
          <img src={iconInfo}></img>
          <div className={styles.column}>
            <span>
              Plantacion N°
              <b>{plantationLiveSelected.id}</b>
            </span>

            <b
              onClick={() => setShowInfoPlantation(true)}
              style={{ color: "#25b0d0" }}
            >
              Ver detalles del cultivo
            </b>
          </div>

          {showInfoPlantation &&
            createPortal(
              <Modal>
                <DetailsPlantation
                  plantation={plantationLiveSelected}
                  setShowInfoPlantation={setShowInfoPlantation}
                />
              </Modal>,
              document.getElementById("contentBody"),
            )}
        </li>
      </ul>
    </div>
  );
};
