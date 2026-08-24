export const detailsHumidity = (optimePercentege) => {
  let colorLevel, state, background;

  switch (true) {
    case optimePercentege > 70 && optimePercentege <= 100:
      colorLevel = "rgb(67, 195, 215)";
      state = "Optimo";
      break;
    case optimePercentege >= 50 && optimePercentege <= 70:
      colorLevel = "rgb(216, 213, 47)";
      state = "Medio";
      break;
    case optimePercentege >= 40 && optimePercentege < 50:
      colorLevel = "rgb(231, 84, 40)";
      state = "Seco";
      break;
    case optimePercentege < 40:
      colorLevel = " rgb(215, 66, 66)";
      state = "¡Debe regarse!";
      break;
    case optimePercentege > 100:
      colorLevel = "rgb(93, 5, 5)";
      state = "¡Demasiada agua!";
      break;
  }

  return { colorLevel: colorLevel, state: state };
};
