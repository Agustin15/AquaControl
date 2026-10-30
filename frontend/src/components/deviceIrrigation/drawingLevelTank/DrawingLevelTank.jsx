import styles from "./DrawingLevelTank.module.css";
import { Recipient } from "./recipient/Recipient";

export const DrawingLevelTank = ({ currentLevelTank }) => {
  
  const liquidHeight =
    currentLevelTank < 25 ? 25 : (currentLevelTank * 90) / 100;

  const topLiquidHeight = currentLevelTank < 25 ? 25 : liquidHeight + 2;

  return (
    <div className={styles.levelTank}>
      <svg width={"8vw"} height={"18vh"}>
        {/* base recipiente */}
        <ellipse
          rx={"38%"}
          ry={"13%"}
          cx={"48%"}
          cy={"86%"}
          opacity={0.2}
          fill={"rgb(240, 240, 240)"}
        />

        {/* agua*/}
        <g>
          <rect
            rx={"35%"}
            ry={"13%"}
            x={"19%"}
            y={"12%"}
            width={"58%"}
            height={liquidHeight + "%"}
            fill={"rgb(57, 182, 191)"}
          >
            <animate
              attributeName={"height"}
              begin={0}
              dur={"2s"}
              from={"90%"}
              to={liquidHeight + "%"}
              repeatCount={1}
            />
          </rect>

          <ellipse
            rx={"29%"}
            ry={"10%"}
            cx={"48%"}
            cy={topLiquidHeight + "%"}
            fill={"rgb(78, 210, 219)"}
            strokeWidth={2}
          >
            <animate
              attributeName={"cy"}
              dur={"2s"}
              from={"92%"}
              to={topLiquidHeight + "%"}
              repeatCount={1}
            />
          </ellipse>
        </g>

        {/* contorno y tope del recipiente*/}
        <Recipient />
      </svg>
    </div>
  );
};
