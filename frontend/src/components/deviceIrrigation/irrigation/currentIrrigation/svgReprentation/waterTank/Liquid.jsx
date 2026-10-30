export const Liquid = ({ currentLevelTank }) => {
  const liquidHeight = (currentLevelTank * 52) / 100;

  const cyLiquidEllipse = currentLevelTank < 20 ? 55 : liquidHeight + 45;

  return (
    <g>
      <rect
        x={"7%"}
        y={"48%"}
        width={"13%"}
        height={liquidHeight + "%"}
        fill={"rgb(57, 182, 191)"}
        rx={"5%"}
        ry={"5%"}
      >
        <animate
          attributeName={"height"}
          begin={0}
          dur={"2s"}
          from={"52%"}
          to={liquidHeight + "%"}
          repeatCount={1}
        ></animate>
      </rect>

      <ellipse
        rx={"6.5%"}
        ry={"6%"}
        cx={"13.5%"}
        cy={cyLiquidEllipse + "%"}
        fill={"rgb(78, 210, 219)"}
        strokeWidth={2}
      >
        <animate
          attributeName={"cy"}
          begin={0}
          dur={"1.6s"}
          from={"94%"}
          to={cyLiquidEllipse + "%"}
          repeatCount={1}
        ></animate>
      </ellipse>
    </g>
  );
};
