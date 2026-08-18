import styles from "./Tanks.module.css";
import iconNoTanks from "../../../../assets/img/noTanks.png";
import iconAdd from "../../../../assets/img/add.png";
import iconDelete from "../../../../assets/img/delete.png";
import iconInfo from "../../../../assets/img/info.png";
import iconEdit from "../../../../assets/img/edit.png";
import { LevelTank } from "../../waterTankLogs/logs/levelTank/LevelTank";
import { usePlant } from "../../../../contexts/PlantContext";
import { useEffect, useState } from "react";
import { Options } from "./options/Options";
import { useTank } from "../../../../contexts/TankContext";

export const Tanks = () => {
  const {
    tanks,
    loadingTanks,
    errorTanks,
    getTanks,
    setAddTank,
    setEditTank,
    setDeleteTank,
    setValuesForm,
    valuesForm,
    currentLevelTank,
  } = useTank();

  useEffect(() => {
    getTanks();
  }, []);

  return (
    <div className={styles.containTanks}>
      {loadingTanks && (
        <div className={styles.loadingFilter}>
          <span className={styles.loader}></span>
          <p>Cargando tanques...</p>
        </div>
      )}

      {!loadingTanks && errorTanks && (
        <div className={styles.noTanks}>
          <img src={iconNoTanks}></img>
          <p>{errorTanks}</p>
        </div>
      )}

      {!loadingTanks && tanks.length == 0 && (
        <div className={styles.addTank}>
          <button onClick={() => setAddTank(true)}>
            Nuevo tanque
            <img src={iconAdd}></img>
          </button>
        </div>
      )}

      <ul className={styles.tanks}>
        {tanks.map((tank, index) => (
          <li key={index}>
            <LevelTank currentLevelTank={100} />
            <span>Tanque {tank.id}</span>

            <div className={styles.edit}>
              <span>Altura: {tank.height}cm</span>
            </div>

            <div className={styles.options}>
              <button onClick={() => setDeleteTank(tank)}>
                <img className={styles.iconDelete} src={iconDelete}></img>
              </button>
              <button
                onClick={() => {
                  setValuesForm({ id: tank.id, height: tank.height });
                  setEditTank(tank);
                }}
              >
                <img src={iconEdit}></img>
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Options />
    </div>
  );
};
