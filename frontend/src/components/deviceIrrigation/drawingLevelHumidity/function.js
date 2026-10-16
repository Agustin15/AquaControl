export const detailsHumidity = (percentege) => {
  let colorLevel;
  switch (true) {
    case percentege > 100:
      colorLevel = "rgb(209, 29, 29)";
      break;

    case percentege > 70 && percentege <= 100:
      colorLevel = "rgb(40, 191, 218)";
      break;
    case percentege >= 50 && percentege <= 70:
      colorLevel = "rgb(216, 213, 47)";

      break;
    case percentege >= 25 && percentege < 50:
      colorLevel = "rgb(231, 84, 40)";
      break;
    case percentege < 25:
      colorLevel = "rgb(209, 29, 29)";
      break;
  }
  return colorLevel;
};
