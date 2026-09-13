export const detailsHumidity = (optimePercentege) => {
  let colorLevel;
  switch (true) {
    case optimePercentege > 70 && optimePercentege <= 100:
      colorLevel = "rgb(40, 191, 218)";
      break;
    case optimePercentege >= 50 && optimePercentege <= 70:
      colorLevel = "rgb(216, 213, 47)";

      break;
    case optimePercentege >= 40 && optimePercentege < 50:
      colorLevel = "rgb(231, 84, 40)";
      break;
    case optimePercentege < 40:
      colorLevel = "rgb(209, 29, 29)";
      break;
    case optimePercentege > 100:
      colorLevel = "rgb(93, 5, 5)";
      break;
  }
  return colorLevel;
};
