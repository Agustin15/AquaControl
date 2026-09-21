import styles from "./List.module.css";
import iconMore from "../../../assets/img/more.png";
import iconDevice from "../../../assets/img/device.png";
import { useState } from "react";
import { useDevice } from "../../../contexts/DeviceContext";
import { useNavigate } from "react-router";
import { Info } from "../info/Info";
import { Modal } from "../../modal/Modal";
import { createPortal } from "react-dom";
import { Options } from "./Options";
import { AddDevice } from "../addDevice/AddDevice";
import { EditDevice } from "../editDevice/EditDevice";

export const List = () => {
  const { devices, fetchSelectDevice } = useDevice();
  const [showOption, setShowOption] = useState(false);
  const [deviceToLink, setDeviceToLink] = useState(null);
  const [infoDevice, setInfoDevice] = useState(null);
  const [editDevice, setEditDevice] = useState(null);
  let navigate = useNavigate();

  const handleClickDevice = async (device) => {
    await fetchSelectDevice(device, true);
    if (device.linked) navigate("/deviceIrrigate");
    else setDeviceToLink(device);
  };

  return (
    <>
      <ul className={styles.listDevices}>
        {devices.map((device, index) => (
          <li key={index}>
            {device.linked && (
              <button
                onClick={() => setShowOption(showOption ? false : true)}
                className={styles.moreOptions}
              >
                <img src={iconMore}></img>
              </button>
            )}
            {showOption && (
              <Options
                device={device}
                setDeviceToLink={setDeviceToLink}
                setEditDevice={setEditDevice}
                setInfoDevice={setInfoDevice}
              />
            )}

            <img className={styles.iconDevice} src={iconDevice}></img>
            <span>{device.placeName}</span>

            <button
              onClick={() => handleClickDevice(device)}
              className={styles.watch}
            >
              {device.linked ? "Ver" : "Vincular"}
            </button>
          </li>
        ))}
      </ul>

      {infoDevice &&
        createPortal(
          <Modal>
            <Info infoDevice={infoDevice} setInfoDevice={setInfoDevice} />
          </Modal>,
          document.getElementById("containDevices"),
        )}
      {deviceToLink &&
        createPortal(
          <Modal>
            <AddDevice
              deviceToLink={deviceToLink}
              setDeviceToLink={setDeviceToLink}
            />
          </Modal>,
          document.getElementById("containDevices"),
        )}

      {editDevice &&
        createPortal(
          <Modal>
            <EditDevice editDevice={editDevice} setEditDevice={setEditDevice} />
          </Modal>,
          document.getElementById("containDevices"),
        )}
    </>
  );
};
