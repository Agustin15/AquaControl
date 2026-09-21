import iconGarden from "../../../../../assets/img/garden.png";

export const HumidityPlantation = ({ plantationSelected }) => {
  let xPair = 190;
  let yPair = 39;
  let xImpair = 211;
  let yImpair = 52;

  const coordinatesCornsInGarden = [
    { x: xPair, y: yPair },
    { x: xImpair, y: yImpair },
  ];

  let limitDrawingSown =
    plantationSelected.amountPlants > 10 ? 10 : plantationSelected.amountPlants;

  for (let i = 3; i <= limitDrawingSown; i++) {
    if (i % 2 == 0) {
      xPair -= 16;
      yPair += 6;
      coordinatesCornsInGarden.push({ x: xPair, y: yPair });
    } else if (i % 2 != 0) {
      xImpair -= 16;
      yImpair += 7;
      coordinatesCornsInGarden.push({ x: xImpair, y: yImpair });
    }
  }

  return (
    <>
      <image href={iconGarden} x={30} y={-45} width={275} height={275}></image>

      {coordinatesCornsInGarden.map((coordinate, index) => (
        <image
          key={index}
          href={plantationSelected.cropType.image}
          x={coordinate.x}
          y={coordinate.y}
          width={29}
          height={29}
        ></image>
      ))}
    </>
  );
};
