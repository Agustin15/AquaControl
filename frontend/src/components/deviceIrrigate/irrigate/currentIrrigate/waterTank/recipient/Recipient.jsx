import iconDrop from "../../../../../../assets/img/drop.svg";

export const Recipient = () => {
  return (
    <>
      <image width={30} height={30} x={42} y={82} href={iconDrop}></image>

      <ellipse rx={58} ry={20} cx={55} cy={30} fill={"rgba(43, 42, 42, 0.8)"} />
      <line
        x1={0}
        y1={30}
        x2={0}
        y2={164}
        stroke={"rgba(43, 42, 42, 0.8)"}
        strokeWidth={"5"}
      />
      <line
        x1={110}
        y1={30}
        x2={110}
        y2={164}
        stroke={"rgba(43, 42, 42, 0.8)"}
        strokeWidth={"5"}
      />
    </>
  );
};
