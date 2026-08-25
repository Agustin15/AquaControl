import iconPlant from "../../../../../../assets/img/plant.png";
import { useWaterPlant } from "../../../../../../contexts/WaterPlantContext";
import { Rain } from "./Rain";

export const AnimationIrrigate = () => {
  const { waterPlantInProgress } = useWaterPlant();

  return (
    <svg
      style={{ marginLeft: "0.5rem" }}
      width={100}
      height={170}
      viewBox="0 0 65 170"
    >
      <rect
        strokeWidth={1}
        fill="#dadada"
        width={62}
        height={11}
        x={2}
        y={10}
        rx={2}
        ry={10}
      ></rect>

      <path
        d="M 18,15 L 20,22 Q 18,25 22,28 L 42,28 Q 46,25 44,22 L 47,15"
        fill="#dadada"
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(0 4)"
      ></path>

      {waterPlantInProgress && (
        <g>
          <Rain cx={15} cy={36} duration={"1s"} />
          <Rain cx={30} cy={36} duration={"1s"} />
          <Rain cx={46} cy={36} duration={"1s"} />
          <Rain cx={15} cy={47} duration={"0.6s"} />
          <Rain cx={30} cy={47} duration={"0.6s"} />
          <Rain cx={46} cy={47} duration={"0.6s"} />
        </g>
      )}

      <image href={iconPlant} x={-15} y={73} width={95} height={95}></image>
    </svg>
  );
};
