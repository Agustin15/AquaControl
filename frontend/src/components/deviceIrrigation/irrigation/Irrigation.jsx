import styles from "./Irrigation.module.css";
import iconNoPlants from "../../../assets/img/noPlants.png";
import iconNoTanks from "../../../assets/img/noTanks.png";
import { useEffect, useState } from "react";
import { usePlant } from "../../../contexts/plantContext/PlantContext";
import { useTank } from "../../../contexts/tankContext/TankContext";
import { CurrentIrrigation } from "./currentIrrigation/CurrentIrrigation";
import { Record } from "./record/Record";
import { Menu } from "./menu/Menu";
import { WaterPlantProvider } from "../../../contexts/WaterPlantContext";

export const Irrigation = () => {
  const [optionSelected, setOptionSelected] = useState("Irrigate");
  const [loadingInit, setLoadingInit] = useState(true);
  const { getPlants, errorPlants, plants, plantSelected, setPlantSelected } =
    usePlant();
  const { getTanks, errorTanks, setTankSelected } = useTank();

  useEffect(() => {
    loadInit();
  }, []);

  const loadInit = async () => {
    if (!loadingInit) setLoadingInit(true);
    try {
      const tanks = await getTanks();
      const plants = await getPlants();

      if (tanks) setTankSelected(plants[0]);
      if (plants) setPlantSelected(plants[0]);
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

      {!loadingInit && (errorPlants || errorTanks) && (
        <div className={styles.noData}>
          <img src={errorPlants ? iconNoPlants : iconNoTanks}></img>
          <p>{errorPlants ? errorPlants : errorTanks}</p>
        </div>
      )}

      {!loadingInit && !errorPlants && !errorTanks && plantSelected && (
        <div className={styles.option}>
          <select>
            {plants.map((plant, index) => (
              <option key={index} value={plant.id}>
                Planta {plant.id}
              </option>
            ))}
          </select>
          {optionSelected == "Irrigate" ? (
            <WaterPlantProvider>
              <CurrentIrrigation />
            </WaterPlantProvider>
          ) : (
            <WaterPlantProvider>
              <Record />
            </WaterPlantProvider>
          )}
        </div>
      )}
    </div>
  );
};
