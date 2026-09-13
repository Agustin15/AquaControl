import styles from "./DrawingLevelTank.module.css";
import { Recipient } from "./recipient/Recipient";

export const DrawingLevelTank = ({ currentLevelTank }) => {
  return (
    <div className={styles.levelTank}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 50 65"
        width={50}
        height={65}
      >
        {/* base recipiente */}
        <ellipse
          rx={20}
          ry={8}
          cx={25}
          cy={55}
          opacity={0.2}
          fill={"rgb(240, 240, 240)"}
        />

        {/* agua*/}
        <g transform="translate(0, 70) scale(1, -1)">
          <rect
            rx={14}
            ry={7}
            x={11}
            y={10}
            width={28}
            height={currentLevelTank < 16 ? 0 : (currentLevelTank * 50) / 100}
            fill={"rgb(57, 182, 191)"}
          >
            <animate
              attributeName={"height"}
              begin={0}
              dur={"1s"}
              from={50}
              to={(currentLevelTank * 50) / 100}
              repeatCount={1}
            />
          </rect>

          <ellipse
            rx={14}
            ry={7}
            cx={25}
            cy={
              (currentLevelTank * 56) / 100 < 16
                ? 16
                : (currentLevelTank * 56) / 100
            }
            fill={"rgb(78, 210, 219)"}
            strokeWidth={2}
          >
            <animate
              attributeName={"cy"}
              dur={"1s"}
              from={56}
              to={
                (currentLevelTank * 56) / 100 < 16
                  ? 16
                  : (currentLevelTank * 56) / 100
              }
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
