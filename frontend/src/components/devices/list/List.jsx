import styles from "./List.module.css";
import iconDelete from "../../../assets/img/delete.png";
import iconInfo from "../../../assets/img/info.png";
import iconEdit from "../../../assets/img/edit.png";
import iconDevice from "../../../assets/img/device.png";
import { useDevice } from "../../../contexts/DeviceContext";
import { useCrudDevice } from "../../../contexts/CrudDeviceContext";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Info } from "../info/Info";
import { Modal } from "../../modal/Modal";
import { createPortal } from "react-dom";
import { EditDevice } from "../editDevice/EditDevice";
import { DeleteDevice } from "../deleteDevice/DeleteDevice";

export const List = () => {
  const { devices, fetchSelectDevice } = useDevice();
  let navigate = useNavigate();

  const {
    setValuesForm,
    valuesForm,
    infoDevice,
    setInfoDevice,
    setEditDevice,
    editDevice,
    setDeleteDevice,
    deleteDevice,
  } = useCrudDevice();

  return (
    <>
      <ul className={styles.listDevices}>
        {devices.map((device, index) => (
          <li key={index}>
            <img src={iconDevice}></img>
            <span>{device.placeName}</span>
            <div className={styles.options}>
              <button onClick={() => setDeleteDevice(device)}>
                <img className={styles.iconDelete} src={iconDelete}></img>
              </button>
              <button
                onClick={() => {
                  setValuesForm({
                    ...valuesForm,
                    id: device.id,
                    placeName: device.placeName,
                  });
                  setEditDevice(device);
                }}
              >
                <img src={iconEdit}></img>
              </button>
              <button onClick={() => setInfoDevice(device)}>
                <img src={iconInfo}></img>
              </button>
            </div>

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
