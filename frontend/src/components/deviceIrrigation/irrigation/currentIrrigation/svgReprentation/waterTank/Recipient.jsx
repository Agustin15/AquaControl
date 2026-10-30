import iconDrop from "../../../../../../assets/img/drop.svg";

export const Recipient = () => {
  return (
    <>
      <image width={"13%"} height={"13%"} x={"9%"} y={"33%"} href={iconDrop}></image>

      <ellipse
        rx={"8.5%"}
        ry={"7%"}
        cx={"13.5%"}
        cy={"15%"}
        opacity={0.2}
        fill={"rgb(240, 240, 240)"}
      />

      <rect
        x={"5%"}
        y={"16%"}
        rx={"1%"}
        ry={"1%"}
        width={"17%"}
        height={"43%"}
        opacity={0.08}
        fill={"rgb(240, 240, 240)"}
      ></rect>
    </>
  );
};
