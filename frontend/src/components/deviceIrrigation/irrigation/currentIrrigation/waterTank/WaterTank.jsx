import { Recipient } from "./recipient/Recipient.jsx";
import { Liquid } from "./liquid/Liquid.jsx";
import { useTank } from "../../../../../contexts/tankContext/TankContext.jsx";

export const WaterTank = () => {
  const { currentLevelTank } = useTank();

  return (
    <>
      <ellipse
        rx={26}
        ry={10}
        cx={40}
        cy={80}
        opacity={0.2}
        fill={"rgb(240, 240, 240)"}
      />

      <Liquid currentLevelTank={currentLevelTank} />
      <Recipient />
    </>
  );
};
