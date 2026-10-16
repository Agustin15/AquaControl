import { Recipient } from "./recipient/Recipient.jsx";
import { Liquid } from "./liquid/Liquid.jsx";
import { useMqtt } from "../../../../../contexts/MqttContext.jsx";

export const WaterTank = () => {
  const { currentLevelTank } = useMqtt();

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
