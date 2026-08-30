import styles from "./List.module.css";
import { useCrudDevice } from "../../../contexts/CrudDeviceContext";
import iconInfo from "../../../assets/img/info.png";
import iconDelete from "../../../assets/img/delete.png";
import iconEdit from "../../../assets/img/edit.png";

export const Options = ({ device }) => {
  const {
    setValuesForm,
    valuesForm,
    setInfoDevice,
    setEditDevice,
    setDeleteDevice,
  } = useCrudDevice();

  return (
    <ul className={styles.options}>
      <li onClick={() => setDeleteDevice(device)}>
        <img width={"22px"} height={"22px"} src={iconDelete}></img>
      </li>
      <li
        onClick={() => {
          setValuesForm({
            ...valuesForm,
            id: device.id,
            placeName: device.placeName,
            location: device.location,
          });
          setEditDevice(device);
        }}
      >
        <img width={"19px"} height={"19px"} src={iconEdit}></img>
      </li>
      <li onClick={() => setInfoDevice(device)}>
        <img width={"19px"} height={"19px"} src={iconInfo}></img>
      </li>
    </ul>
  );
};
