import iconGarden from "../../../../../assets/img/garden.png";
import iconMiniGarden from "../../../../../assets/img/miniGarden.png";

export const HumidityPlantation = ({ plantationSelected }) => {
  let xPair = 173;
  let yPair = 30;
  let xImpair = 200;
  let yImpair = 45;

  const coordinatesCornsInGarden = [];

  if (plantationSelected.amountPlants > 1) {
    coordinatesCornsInGarden.push({ x: xPair, y: yPair });
    coordinatesCornsInGarden.push({ x: xImpair, y: yImpair });

    let limitDrawingSown =
      plantationSelected.amountPlants > 10
        ? 10
        : plantationSelected.amountPlants;

    for (let i = 3; i <= limitDrawingSown; i++) {
      if (i % 2 == 0) {
        xPair -= 22;
        yPair += 10;
        coordinatesCornsInGarden.push({ x: xPair, y: yPair });
      } else if (i % 2 != 0) {
        xImpair -= 22;
        yImpair += 10;
        coordinatesCornsInGarden.push({ x: xImpair, y: yImpair });
      }
    }
  }

  return (
    <>
      <image
        href={
          plantationSelected.amountPlants == 1 ? iconMiniGarden : iconGarden
        }
        x={30}
        y={-45}
        width={275}
        height={275}
      ></image>

      {plantationSelected.amountPlants == 1 && (
        <image
          href={plantationSelected.cropType.image}
          x={125}
          y={47}
          width={66}
          height={66}
        ></image>
      )}

      {coordinatesCornsInGarden.length > 0 &&
        coordinatesCornsInGarden.map((coordinate, index) => (
          <image
            key={index}
            href={plantationSelected.cropType.image}
            x={coordinate.x}
            y={coordinate.y}
            width={42}
            height={42}
          ></image>
        ))}
    </>
  );
};
