import { useState } from "react";
import iconGarden from "../../../../../assets/img/garden.png";

export const HumidityPlantation = ({ plantationSelected }) => {
  const [waterPlantationInProgress, setWaterPlantationInProgress] =
    useState(false);

  let xPair = 189;
  let yPair = 42;
  let xImpair = 212;
  let yImpair = 55;

  const coordinatesCornsInGarden = [
    { x: xPair, y: yPair },
    { x: xImpair, y: yImpair },
  ];

  for (let i = 3; i <= plantationSelected.amountPlants; i++) {
    if (i % 2 == 0) {
      xPair -= 24;
      yPair += 11;
      coordinatesCornsInGarden.push({ x: xPair, y: yPair });
    } else if (i % 2 != 0) {
      xImpair -= 24;
      yImpair += 11;
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
          width={23}
          height={23}
        ></image>
      ))}
    </>
  );
};
