import styles from "./Plants.module.css";
import iconNoPlants from "../../../../assets/img/noPlants.png";
import iconAdd from "../../../../assets/img/add.png";
import iconDelete from "../../../../assets/img/delete.png";
import iconInfo from "../../../../assets/img/info.png";
import iconEdit from "../../../../assets/img/edit.png";
import iconPlant from "../../../../assets/img/plant.png";
import { usePlant } from "../../../../contexts/PlantContext";
import { useEffect } from "react";
import { Options } from "./options/Options";

export const Plants = () => {
  const {
    plants,
    loadingPlants,
    errorPlants,
    getPlants,
    setAddPlant,
    setInfoPlant,
    setEditPlant,
    setValuesForm,
    setDeletePlant,
  } = usePlant();

  useEffect(() => {
    getPlants();
  }, []);

  return (
    <div className={styles.containPlants}>
      {loadingPlants && (
        <div className={styles.loadingFilter}>
          <span className={styles.loader}></span>
          <p>Cargando plantas...</p>
        </div>
      )}

      {!loadingPlants && errorPlants && (
        <div className={styles.noPlants}>
          <img src={iconNoPlants}></img>
          <p>{errorPlants}</p>
        </div>
      )}

      {!loadingPlants && plants.length == 0 && (
        <div className={styles.addPlant}>
          <button onClick={() => setAddPlant(true)}>
            Nueva planta
            <img src={iconAdd}></img>
          </button>
        </div>
      )}
      
      <ul className={styles.plants}>
        {plants.map((plant, index) => (
          <li key={index}>
            <img src={iconPlant}></img>
            <span>Planta {plant.id}</span>
            <div className={styles.options}>
              <button onClick={() => setDeletePlant(plant)}>
                <img className={styles.iconDelete} src={iconDelete}></img>
              </button>
              <button
                onClick={() => {
                  setValuesForm({
                    id: plant.id,
                    image: plant.image,
                    umbralHumidity: plant.umbralHumidity,
                    description: plant.description,
                  });
                  setEditPlant(plant);
                }}
              >
                <img src={iconEdit}></img>
              </button>
              <button onClick={() => setInfoPlant(plant)}>
                <img src={iconInfo}></img>
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Options />
    </div>
  );
};
