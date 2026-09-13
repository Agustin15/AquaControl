import iconDrop from "../../../../../../assets/img/drop.svg";

export const Recipient = () => {
  return (
    <>
      <image width={17} height={17} x={37} y={43} href={iconDrop}></image>

      <ellipse
        rx={26}
        ry={10}
        cx={40}
        cy={20}
        opacity={0.2}
        fill={"rgb(240, 240, 240)"}
      />

      <rect
        x={14.5}
        y={21}
        rx={1}
        ry={1}
        width={51}
        height={60}
        opacity={0.08}
        fill={"rgb(240, 240, 240)"}
      ></rect>
    </>
  );
};
