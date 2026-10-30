import "./WaterTank.module.css";
import { Recipient } from "./Recipient.jsx";
import { Liquid } from "./Liquid.jsx";
import { useMqtt } from "../../../../../../contexts/MqttContext.jsx";

export const WaterTank = () => {
  const { currentLevelTank } = useMqtt();
  return (
    <>
      <ellipse
        rx={"8.5%"}
        ry={"7%"}
        cx={"13.5%"}
        cy={"60%"}
        opacity={0.2}
        fill={"rgb(240, 240, 240)"}
      />

      <Liquid currentLevelTank={currentLevelTank} />
      <Recipient />
    </>
  );
};
