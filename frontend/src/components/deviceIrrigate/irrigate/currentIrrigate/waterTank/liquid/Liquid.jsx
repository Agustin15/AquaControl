export const Liquid = ({ currentLevelTank }) => {
  return (
    <g transform="translate(0, 180) scale(1, -1)">
      <rect
        x={"10"}
        y={"7"}
        width={"90"}
        height={currentLevelTank < 27 ? 0 : (currentLevelTank * 140) / 100}
        fill={"rgb(57, 182, 191)"}
        rx={46}
        ry={15}
      ></rect>
      

      <ellipse
        rx={46}
        ry={15}
        cx={55}
        cy={
          (currentLevelTank * 135) / 100 < 27
            ? 27
            : (currentLevelTank * 135) / 100
        }
        fill={"rgb(78, 210, 219)"}
        strokeWidth={2}
      ></ellipse>
    </g>
  );
};
