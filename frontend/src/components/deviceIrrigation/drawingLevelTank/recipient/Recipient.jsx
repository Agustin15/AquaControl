import iconDrop from "../../../../assets/img/drop.svg";

export const Recipient = () => {
  return (
    <>
      <image width={14} height={14} x={18} y={28} href={iconDrop}></image>

      <ellipse
        rx={20}
        ry={8}
        cx={25}
        cy={14}
        opacity={0.2}
        fill={"rgb(240, 240, 240)"}
      />

      <rect
        rx={5}
        ry={5}
        x={5}
        y={11}
        width={40}
        height={51}
        opacity={0.1}
        fill={"rgb(174, 171, 171)"}
      ></rect>
    </>
  );
};
