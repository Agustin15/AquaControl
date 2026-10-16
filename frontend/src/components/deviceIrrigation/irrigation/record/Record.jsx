import styles from "./Record.module.css";
import { useEffect, useState } from "react";
import { useWaterPlantation } from "../../../../contexts/WaterPlantationContext";
import { useMqtt } from "../../../../contexts/MqttContext.jsx";
import { createPortal } from "react-dom";
import { Info } from "./info/Info.jsx";
import { Modal } from "../../../modal/Modal.jsx";
import { Pagination } from "./pagination/Pagination.jsx";
import { Tbody } from "./Tbody.jsx";

export const Record = () => {
  const { fetchGetLogs, index, pages } = useWaterPlantation();
  const { plantationLiveSelected, tankLiveSelected } = useMqtt();
  const [info, setInfo] = useState(null);

  useEffect(() => {
    let offset = (index - 1) * 5;
    loadRecord(offset);
  }, [index]);

  const loadRecord = async (offset) => {
    await fetchGetLogs(
      tankLiveSelected.id,
      plantationLiveSelected.id,
      offset,
      true,
    );
  };

  return (
    <>
      <div className={styles.record}>
        <h3>
          Historial de riegos de plantacion N° {plantationLiveSelected.id}
        </h3>

        <table>
          <thead>
            <tr>
              <th>Tipo de riego</th>
              <th>Fecha</th>
              <th>Duracion</th>
              <th>Estado</th>
              <th>Ver detalles</th>
            </tr>
          </thead>
          <Tbody info={info} setInfo={setInfo} />
        </table>
        {pages && <Pagination />}
      </div>

      {info &&
        createPortal(
          <Modal>
            <Info info={info} setInfo={setInfo} />
          </Modal>,
          document.getElementById("contentBody"),
        )}
    </>
  );
};
