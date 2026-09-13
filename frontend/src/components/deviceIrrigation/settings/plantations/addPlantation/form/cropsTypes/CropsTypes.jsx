import styles from "./CropsTypes.module.css";
import { usePlantation } from "../../../../../../../contexts/plantationContext/PlantationContext";
import { useFormPlantation } from "../../../../../../../contexts/plantationContext/FormPlantationContext";
import { useEffect } from "react";

export const CropsTypes = () => {
  const { cropsTypes, errorLoadCrops } = usePlantation();
  const { valuesForm, setValuesForm } = useFormPlantation();

  useEffect(() => {
    setValuesForm({
      ...valuesForm,
      cropType: valuesForm.cropType ? valuesForm.cropType : cropsTypes[0],
    });
  }, []);

  const handleChange = (event) => {
    const cropTypeFound = cropsTypes.find(
      (crop) => crop.name == event.target.value,
    );
    setValuesForm({ ...valuesForm, cropType: cropTypeFound });
  };

  return (
    <div className={styles.columnInput}>
      <label>Tipo de cultivo:</label>

      {cropsTypes.length > 0 ? (
        <div className={styles.row}>
          <select
            defaultValue={valuesForm.cropType ? valuesForm.cropType.name : null}
            onChange={(event) => handleChange(event)}
          >
            {cropsTypes.map((crop, index) => (
              <option key={index} value={crop.name}>
                {crop.name}
              </option>
            ))}
          </select>
          {valuesForm.cropType && <img src={valuesForm.cropType.image}></img>}
        </div>
      ) : (
        <p>{errorLoadCrops}</p>
      )}

      {valuesForm.cropType && (
        <span>
          Humedad minima y maxima recomendada: {valuesForm.cropType.humidityMin}
          -{valuesForm.cropType.humidityMax}%
        </span>
      )}
    </div>
  );
};
