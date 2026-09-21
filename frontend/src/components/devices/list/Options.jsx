import styles from "./List.module.css";
import iconInfo from "../../../assets/img/info.png";
import iconLink from "../../../assets/img/config.png";
import iconEdit from "../../../assets/img/edit.png";
import { useDevice } from "../../../contexts/DeviceContext";

export const Options = ({
  device,
  setDeviceToLink,
  setEditDevice,
  setInfoDevice,
}) => {
  const { fetchSelectDevice } = useDevice();

  const handleClickLink = async () => {
    await fetchSelectDevice(device,true);
    setDeviceToLink(true);
  };

  return (
    <ul className={styles.options}>
      <li onClick={() => handleClickLink()}>
        <img width={"19px"} height={"19px"} src={iconLink}></img>
      </li>
      <li onClick={() => setEditDevice(device)}>
        <img width={"19px"} height={"19px"} src={iconEdit}></img>
      </li>
      <li onClick={() => setInfoDevice(device)}>
        <img width={"19px"} height={"19px"} src={iconInfo}></img>
      </li>
    </ul>
  );
};
