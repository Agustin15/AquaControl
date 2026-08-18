import styles from "./Record.module.css";
import { useEffect, useState } from "react";
import { useWaterPlant } from "../../../../contexts/WaterPlantContext";
import { usePlant } from "../../../../contexts/PlantContext";
import { useTank } from "../../../../contexts/TankContext";
import { createPortal } from "react-dom";
import { Info } from "./info/Info.jsx";
import { Modal } from "../../../modal/Modal.jsx";
import { Pagination } from "./pagination/Pagination.jsx";
import { Tbody } from "./Tbody.jsx";

export const Record = () => {
  const { fetchGetLogs, index, pages } = useWaterPlant();
  const { plants, plantSelected } = usePlant();
  const { tankSelected } = useTank();
  const [info, setInfo] = useState(null);

  useEffect(() => {
    let offset = (index - 1) * 5;
    loadRecord(offset);
  }, [index]);

  const loadRecord = async (offset) => {
    await fetchGetLogs(tankSelected.id, plantSelected.id, offset, true);
  };

  return (
    <>
      <div className={styles.record}>
        <h3>Historial de riegos de planta N° {plantSelected.id}</h3>

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
