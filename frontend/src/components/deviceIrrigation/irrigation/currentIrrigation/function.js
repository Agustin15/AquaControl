export const getCustomsToTankAccordigMeasure = (currentLevelTank) => {
  let messageTank, colorMessageTank;
  switch (true) {
    case currentLevelTank > 100:
      messageTank = "Tanque demasiado lleno";
      colorMessageTank = "#e25555";
      break;
    case currentLevelTank == 100:
      messageTank = "Tanque lleno";
      colorMessageTank = "#55e26a";
      break;
    case currentLevelTank >= 70 && currentLevelTank < 100:
      messageTank = "Nivel optimo";
      colorMessageTank = "#55cde2";
      break;
    case currentLevelTank >= 50 && currentLevelTank < 70:
      messageTank = "Nivel Medio";
      colorMessageTank = "#dde255";
      break;
    case currentLevelTank >= 25 && currentLevelTank < 50:
      messageTank = "Nivel bajo";
      colorMessageTank = "#e27855";
      break;
    case currentLevelTank < 25:
      messageTank = "¡Reponga el tanque!";
      colorMessageTank = "#e25555";
      break;
  }
  return { messageTank: messageTank, colorMessageTank: colorMessageTank };
};

export const getCustomsToHumidityAccordigMeasure = (
  currentHumidityPlantation,
  plantationLiveSelected,
) => {
  const percentege =
    (currentHumidityPlantation * 100) / plantationLiveSelected.humidityMax;

  let messageHumidity, colorMessageHumidity;

  switch (true) {
    case percentege > 100:
      messageHumidity = "Exceso de agua en el cultivo";
      colorMessageHumidity = "#e25555";
      break;
    case percentege == 100:
      messageHumidity = "Humedad maxima, no regar";
      colorMessageHumidity = "#55e26a";
      break;
    case percentege >= 70 && percentege < 100:
      messageHumidity = "Humedad adecuada,no regar";
      colorMessageHumidity = "#55cde2";
      break;
    case percentege >= 50 && percentege < 70:
      messageHumidity = "Humedad media";
      colorMessageHumidity = "#dde255";
      break;
    case percentege >= 25 && percentege < 50:
      messageHumidity = "Suelo seco,riego sugerido";
      colorMessageHumidity = "#e27855";
      break;
    case percentege < 25:
      messageHumidity = "¡Riego obligatorio!";
      colorMessageHumidity = "#e25555";
      break;
  }

  return { messageHumidity, colorMessageHumidity };
};
