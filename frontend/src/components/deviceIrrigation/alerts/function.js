import iconIrrigationCompleted from "../../../assets/img/irrigationCompleted.png";
import iconCropDry from "../../../assets/img/cropDryWarning.png";
import iconCropAwashWarning from "../../../assets/img/cropAwashWarning.png";
import iconTankWarning from "../../../assets/img/tankWarning.png";

export const getIcon = (type) => {
  switch (true) {
    case type.indexOf("Nivel del tanque de agua") !== -1:
      return iconTankWarning;
    case type.indexOf("riego realizado") !== -1:
      return iconIrrigationCompleted;
    case type.indexOf("tierra muy seca en el cultivo") !== -1:
      return iconCropDry;
    case type.indexOf("exceso de agua en el cultivo") !== -1:
      return iconCropAwashWarning;
  }
};

export const alertIsSeen = (alert, idUser) => {
  return alert.usersOfAlert.some(
    (userOfAlert) =>
      userOfAlert.seen === true && userOfAlert.user.id === idUser,
  );
};
