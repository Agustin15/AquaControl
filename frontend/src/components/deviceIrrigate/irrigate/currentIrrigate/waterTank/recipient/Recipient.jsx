import iconDrop from "../../../../../../assets/img/drop.svg";

export const Recipient = () => {
  return (
    <>
      <image width={30} height={30} x={42} y={82} href={iconDrop}></image>

      <ellipse
        rx={58}
        ry={20}
        cx={55}
        cy={30}
        opacity={0.1}
        fill={"rgb(240, 240, 240)"}
      />

      <rect
        x={"0"}
        y={"31"}
        rx={1}
        ry={1}
        width={110}
        height={130}
        opacity={0.1}
        fill={"rgb(174, 171, 171)"}
      ></rect>
    </>
  );
};
