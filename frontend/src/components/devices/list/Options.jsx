import styles from "./List.module.css";
import iconInfo from "../../../assets/img/info.png";
import iconEdit from "../../../assets/img/edit.png";

export const Options = ({ device, setEditDevice, setInfoDevice }) => {
  return (
    <ul className={styles.options}>
      <li onClick={() => setEditDevice(device)}>
        <img width={"19px"} height={"19px"} src={iconEdit}></img>
      </li>
      <li onClick={() => setInfoDevice(device)}>
        <img width={"19px"} height={"19px"} src={iconInfo}></img>
      </li>
    </ul>
  );
};
