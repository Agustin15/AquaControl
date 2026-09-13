import styles from "./Irrigation.module.css";
import iconNoPlantations from "../../../assets/img/noPlantations.png";
import iconNoTanks from "../../../assets/img/noTanks.png";
import { useEffect, useState } from "react";
import { usePlantation } from "../../../contexts/plantationContext/PlantationContext";
import { useTank } from "../../../contexts/tankContext/TankContext";
import { CurrentIrrigation } from "./currentIrrigation/CurrentIrrigation";
import { Record } from "./record/Record";
import { Menu } from "./menu/Menu";
import { WaterPlantationProvider } from "../../../contexts/WaterPlantationContext";

export const Irrigation = () => {
  const [optionSelected, setOptionSelected] = useState("Irrigate");
  const [loadingInit, setLoadingInit] = useState(true);
  const {
    getPlantations,
    errorPlantations,
    plantations,
    plantationSelected,
    setPlantationSelected,
  } = usePlantation();
  const { getTanks, errorTanks, setTankSelected } = useTank();

  useEffect(() => {
    loadInit();
  }, []);

  const loadInit = async () => {
    if (!loadingInit) setLoadingInit(true);
    try {
      const tanks = await getTanks();
      const plantations = await getPlantations();

      if (tanks) setTankSelected(plantations[0]);
      if (plantations) setPlantationSelected(plantations[0]);
    } catch (error) {
    } finally {
      setLoadingInit(false);
    }
  };

  return (
    <div className={styles.irrigate}>
      <Menu
        optionSelected={optionSelected}
        setOptionSelected={setOptionSelected}
      />

      {loadingInit && (
        <div className={styles.loadingFilter}>
          <span className={styles.loader}></span>
          <p>Cargando</p>
        </div>
      )}

      {!loadingInit && (errorPlantations || errorTanks) && (
        <div className={styles.noData}>
          <img src={errorPlantations ? iconNoPlantations : iconNoTanks}></img>
          <p>{errorPlantations ? errorPlantations : errorTanks}</p>
        </div>
      )}

      {!loadingInit &&
        !errorPlantations &&
        !errorTanks &&
        plantationSelected && (
          <div className={styles.option}>
            <ul>
              {plantations.map((plantation, index) => (
                <li
                  className={
                    plantation.id == plantationSelected.id
                      ? styles.selected
                      : ""
                  }
                  key={index}
                >
                  <img src={plantation.cropType.image}></img>
                </li>
              ))}
            </ul>
            {optionSelected == "Irrigate" ? (
              <WaterPlantationProvider>
                <CurrentIrrigation />
              </WaterPlantationProvider>
            ) : (
              <WaterPlantationProvider>
                <Record />
              </WaterPlantationProvider>
            )}
          </div>
        )}
    </div>
  );
};
