import iconDrop from "../../../../assets/img/drop.svg";

export const Recipient = () => {
  return (
    <>
      <image
        width={"25%"}
        height={"25%"}
        x={"44%"}
        y={"41%"}
        href={iconDrop}
      ></image>

      <ellipse
        rx={"38%"}
        ry={"13%"}
        cx={"48%"}
        cy={"15%"}
        opacity={0.2}
        fill={"rgb(240, 240, 240)"}
      />

      <rect
        rx={"20%"}
        ry={"10%"}
        x={"10%"}
        y={"8%"}
        width={"76%"}
        height={"87%"}
        opacity={0.1}
        fill={"rgb(174, 171, 171)"}
      ></rect>
    </>
  );
};
