import styles from "./Notification.module.css";
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { useUserDevicesTokens } from "../../../contexts/UserDevicesTokenContext";
import { getIcon } from "./function.js";

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
          <img src={getIcon(notificationReceived.title)} />
          <div className={styles.column}>
            <h3>
              <img src={getIcon(notificationReceived.title)} />
              {notificationReceived.title}
            </h3>
            <p>{notificationReceived.body}</p>
          </div>
        </div>
      )}
    </>
  );
};
