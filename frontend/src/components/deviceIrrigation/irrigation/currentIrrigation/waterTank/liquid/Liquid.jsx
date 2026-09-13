export const Liquid = ({ currentLevelTank }) => {
  const liquidHeight = (currentLevelTank * 72) / 100;

  const cyLiquidEllipse = currentLevelTank < 20 ? 100 : liquidHeight + 89;

  return (
    <g transform="translate(0, 180) scale(1, -1)">
      <rect
        x={20}
        y={94}
        width={40}
        height={liquidHeight}
        fill={"rgb(57, 182, 191)"}
        rx={20}
        ry={7}
      >
        <animate
          attributeName={"height"}
          begin={0}
          dur={"1s"}
          from={72}
          to={liquidHeight}
          repeatCount={1}
        ></animate>
      </rect>

      <ellipse
        rx={20}
        ry={7}
        cx={40}
        cy={cyLiquidEllipse}
        fill={"rgb(78, 210, 219)"}
        strokeWidth={2}
      >
        <animate
          attributeName={"cy"}
          begin={0}
          dur={"0.9s"}
          from={160}
          to={cyLiquidEllipse}
          repeatCount={1}
        ></animate>
      </ellipse>
    </g>
  );
};
