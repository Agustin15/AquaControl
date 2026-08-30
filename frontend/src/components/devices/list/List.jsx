import styles from "./List.module.css";
import iconMore from "../../../assets/img/more.png";
import iconDevice from "../../../assets/img/device.png";
import { useState } from "react";
import { useDevice } from "../../../contexts/DeviceContext";
import { useCrudDevice } from "../../../contexts/CrudDeviceContext";
import { useNavigate } from "react-router";
import { Info } from "../info/Info";
import { Modal } from "../../modal/Modal";
import { createPortal } from "react-dom";
import { EditDevice } from "../editDevice/EditDevice";
import { DeleteDevice } from "../deleteDevice/DeleteDevice";
import { Options } from "./Options";

export const List = () => {
  const { devices, fetchSelectDevice } = useDevice();
  const [showOption, setShowOption] = useState(false);
  let navigate = useNavigate();

  const { infoDevice, editDevice, setDeleteDevice, deleteDevice } =
    useCrudDevice();

  return (
    <>
      <ul className={styles.listDevices}>
        {devices.map((device, index) => (
          <li key={index}>
            <button
              onClick={() => setShowOption(showOption ? false : true)}
              className={styles.moreOptions}
            >
              <img src={iconMore}></img>
            </button>

            {showOption && <Options device={device} />}

            <img className={styles.iconDevice} src={iconDevice}></img>
            <span>{device.placeName}</span>

            <button
              onClick={() => fetchSelectDevice(device, true, navigate)}
              className={styles.watch}
            >
              Ver
            </button>
          </li>
        ))}
      </ul>

      {infoDevice &&
        createPortal(
          <Modal>
            <Info />
          </Modal>,
          document.getElementById("containDevices"),
        )}

      {editDevice &&
        createPortal(
          <Modal>
            <EditDevice />
          </Modal>,
          document.getElementById("containDevices"),
        )}

      {deleteDevice && (
        <DeleteDevice
          setDeleteDevice={setDeleteDevice}
          deleteDevice={deleteDevice}
        />
      )}
    </>
  );
};
