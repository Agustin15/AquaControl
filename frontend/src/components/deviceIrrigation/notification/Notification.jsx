import styles from "./Notification.module.css";
import iconWarningWaterLevel from "../../../assets/img/adviceNoWater.png";
import iconWarning from "../../../assets/img/warning.png";
import iconTick from "../../../assets/img/tick.png";
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { useUserDevicesTokens } from "../../../contexts/UserDevicesTokenContext";

export const Notification = () => {
  const { userAuth } = useAuth();
  const {
    notificationReceived,
    setNotificationReceived,
    registerNotifications,
  } = useUserDevicesTokens();

  const [classNotification, setClassNotification] = useState(
    styles.notification,
  );

  useEffect(() => {
    if (!userAuth) return;
    registerNotifications();
  }, [userAuth]);

  useEffect(() => {
    if (!notificationReceived) return;
    setClassNotification(styles.notification + " " + styles.showNotification);
  }, [notificationReceived]);

  const handleHideNotification = () => {
    setClassNotification(styles.notification + " " + styles.hideNotification);
    
    setTimeout(() => {
      setClassNotification(styles.notification);
      setNotificationReceived(null);
    }, [600]);
  };

  return (
    <>
      {notificationReceived && (
        <div
          onTouchEnd={() => handleHideNotification()}
          className={classNotification}
        >
          <img src={iconWarningWaterLevel} />
          <div className={styles.column}>
            <h3>
              <img
                src={
                  notificationReceived.data.alertType == "Advertencia"
                    ? iconWarning
                    : iconTick
                }
              />
              {notificationReceived.title}
            </h3>
            <p>{notificationReceived.body}</p>
          </div>
        </div>
      )}
    </>
  );
};
