import styles from "./Plantations.module.css";
import iconNoPlantations from "../../../../assets/img/noPlantations.png";
import iconAdd from "../../../../assets/img/add.png";
import iconDelete from "../../../../assets/img/delete.png";
import iconInfo from "../../../../assets/img/info.png";
import iconEdit from "../../../../assets/img/edit.png";
import { usePlantation } from "../../../../contexts/plantationContext/PlantationContext";
import { useEffect } from "react";
import { useFormPlantation } from "../../../../contexts/plantationContext/FormPlantationContext";
import { Options } from "./options/Options";

export const Plantations = () => {
  const {
    plantations,
    loadingPlantations,
    errorPlantations,
    getPlantations,
    loadCropsTypes,
    setShowFormAdd,
    setInfoPlantation,
    setEditPlantation,
    setDeletePlantation,
  } = usePlantation();

  const { setValuesForm } = useFormPlantation();

  useEffect(() => {
    getPlantations();
    loadCropsTypes();
  }, []);

  return (
    <div className={styles.containPlantations}>
      {loadingPlantations && (
        <div className={styles.loadingFilter}>
          <span className={styles.loader}></span>
          <p>Cargando plantationas...</p>
        </div>
      )}

      {!loadingPlantations && plantations.length == 0 && (
        <div className={styles.addPlantation}>
          <button onClick={() => setShowFormAdd(true)}>
            Nueva plantacion
            <img src={iconAdd}></img>
          </button>
        </div>
      )}

      {!loadingPlantations && errorPlantations && (
        <div className={styles.noPlantations}>
          <img src={iconNoPlantations}></img>
          <p>{errorPlantations}</p>
        </div>
      )}

      <ul className={styles.plantations}>
        {plantations.map((plantation, index) => (
          <li key={index}>
            <img
              className={styles.iconPlantation}
              src={plantation.cropType.image}
            ></img>
            <div className={styles.details}>
              <span>Plantacion N°{plantation.id}</span>
              <span>Cultivo:{plantation.cropType.name}s</span>
              <div className={styles.options}>
                <button onClick={() => setDeletePlantation(plantation)}>
                  <img className={styles.iconDelete} src={iconDelete}></img>
                </button>
                <button
                  onClick={() => {
                    setValuesForm(plantation);
                    setEditPlantation(plantation);
                  }}
                >
                  <img src={iconEdit}></img>
                </button>
                <button onClick={() => setInfoPlantation(plantation)}>
                  <img src={iconInfo}></img>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Options />
    </div>
  );
};
