import styles from "./Irrigate.module.css";
import iconNoPlants from "../../../assets/img/noPlants.png";
import iconNoTanks from "../../../assets/img/noTanks.png";
import { useEffect, useState } from "react";
import { usePlant } from "../../../contexts/PlantContext";
import { useTank } from "../../../contexts/TankContext";
import { useWaterPlant } from "../../../contexts/WaterPlantContext";
import { CurrentIrrigate } from "./currentIrrigate/CurrentIrrigate";
import { Record } from "./record/Record";
import { Menu } from "./menu/Menu";

export const Irrigate = () => {
  const [optionSelected, setOptionSelected] = useState("Irrigate");
  const [loadingInit, setLoadingInit] = useState(true);
  const { getPlants, errorPlants, plants, plantSelected, setPlantSelected } =
    usePlant();
  const { getTanks, errorTanks, setTankSelected, tankSelected } = useTank();

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
          {optionSelected == "Irrigate" ? <CurrentIrrigate /> : <Record />}
        </div>
      )}
    </div>
  );
};
