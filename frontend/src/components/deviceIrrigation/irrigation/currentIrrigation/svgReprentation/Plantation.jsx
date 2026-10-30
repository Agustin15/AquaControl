import iconGarden from "../../../../../assets/img/garden.png";
import iconMiniGarden from "../../../../../assets/img/miniGarden.png";
import { useMqtt } from "../../../../../contexts/MqttContext";

export const Plantation = () => {
  const { plantationLiveSelected } = useMqtt();

  let xPair = 55;
  let yPair = 9;
  let xImpair = 64
  let yImpair = 19;

  const coordinatesCornsInGarden = [];

  if (plantationLiveSelected.amountPlants > 1) {
    coordinatesCornsInGarden.push({ x: xPair, y: yPair });
    coordinatesCornsInGarden.push({ x: xImpair, y: yImpair });

    let limitDrawingSown =
      plantationLiveSelected.amountPlants > 10
        ? 10
        : plantationLiveSelected.amountPlants;

    for (let i = 3; i <= limitDrawingSown; i++) {
      if (i % 2 == 0) {
        xPair -= 8.5;
        yPair += 8.5;
        coordinatesCornsInGarden.push({ x: xPair, y: yPair });
      } else if (i % 2 != 0) {
        xImpair -= 8.5;
        yImpair += 8.5;
        coordinatesCornsInGarden.push({ x: xImpair, y: yImpair });
      }
    }
  }

  return (
    <>
      <image
        href={
          plantationLiveSelected.amountPlants == 1 ? iconMiniGarden : iconGarden
        }
        x={"10%"}
        y={"7%"}
        width={"95%"}
        height={"95%"}
      ></image>

      {plantationLiveSelected.amountPlants == 1 && (
        <image
          href={plantationLiveSelected.cropType.image}
          x={"34%"}
          y={"20%"}
          width={"44%"}
          height={"44%"}
        ></image>
      )}

      {coordinatesCornsInGarden.length > 0 &&
        coordinatesCornsInGarden.map((coordinate, index) => (
          <image
            key={index}
            href={plantationLiveSelected.cropType.image}
            x={coordinate.x + "%"}
            y={coordinate.y + "%"}
            width={"29%"}
            height={"29%"}
          ></image>
        ))}
    </>
  );
};
