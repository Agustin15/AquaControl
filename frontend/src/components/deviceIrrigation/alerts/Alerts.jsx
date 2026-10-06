import styles from "./Alerts.module.css";
import iconNotification from "../../../assets/img/notification.png";
import iconNoNotifications from "../../../assets/img/noNotifications.png";
import iconWarning from "../../../assets/img/warning.png";
import iconTick from "../../../assets/img/tick.png";
import { useAlert } from "../../../contexts/AlertContext";
import { useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { getIcon, alertIsSeen } from "./function.js";
import { Pagination } from "./pagination/Pagination.jsx";

export const Alerts = () => {
  const {
    alerts,
    pages,
    index,
    setIndex,
    errorAlerts,
    loadingAlerts,
    fetchGetAlerts,
    updateAlertStateToSeen,
  } = useAlert();

  const { userAuth } = useAuth();

  useEffect(() => {
    fetchGetAlerts(index * 5, true);
  }, [index]);

  return (
    <div className={styles.alerts}>
      <div className={styles.title}>
        <img src={iconNotification} />
        <h2>Alertas</h2>
      </div>
      {loadingAlerts && <p className={styles.loading}>Cargando alertas...</p>}

      {!loadingAlerts && errorAlerts && (
        <div className={styles.errorAlerts}>
          <img src={iconNoNotifications} />
          {errorAlerts}
        </div>
      )}

      {!loadingAlerts && !errorAlerts && alerts.length > 0 && (
        <ul className={styles.list}>
          {alerts.map((notificationReceived, index) => (
            <li
              onClick={() =>
                updateAlertStateToSeen(notificationReceived.id, true)
              }
              className={
                alertIsSeen(notificationReceived, userAuth.id)
                  ? styles.seen
                  : styles.notSeen
              }
              key={index}
            >
              <img src={getIcon(notificationReceived.title)} />
              <span className={styles.datetimeAlert}>
                {new Date(notificationReceived.datetimeAlert).toLocaleString(
                  "en-GB",
                )}
              </span>
              <div className={styles.column}>
                <h3>
                  <img
                    src={
                      notificationReceived.type == "Advertencia"
                        ? iconWarning
                        : iconTick
                    }
                  />
                  {notificationReceived.title}
                </h3>
                <p>{notificationReceived.message}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {alerts.length > 0 && (
        <Pagination
          pages={pages}
          index={index}
          setIndex={setIndex}
        ></Pagination>
      )}
    </div>
  );
};
