import styles from "./DrawingLevelHumidity.module.css";
import humidityIcon from "../../../assets/img/humidityIndicator.png";
import semicircleIcon from "../../../assets/img/semicircle.png";
import { detailsHumidity } from "./function.js";

export const DrawingLevelHumidity = ({ humidity, plantation }) => {
  let percentege = (humidity * 100) / plantation.humidityMax;
  let heightLevel = percentege > 100 ? 58 : (percentege * 58) / 100;
  let colorLevel = detailsHumidity(percentege);

  return (
    <div className={styles.levelHumidity}>
      <svg width={"8vw"} height={"20vh"}>
        {/*medidor humedad*/}
        <rect
          x={"18%"}
          y={"6%"}
          rx={"13%"}
          ry={"13%"}
          width={"26%"}
          height={"70%"}
          fill={"#45454598"}
        ></rect>

        <circle r={"19%"} cx={"30.4%"} cy={"78%"} fill={"#45454598"}></circle>

        {/* contenido */}
        <g>
          <rect
            x={"23.6%"}
            y={"0%"}
            rx={"6%"}
            ry={"6%"}
            width={"14.5%"}
            height={heightLevel + "%"}
            fill={colorLevel}
          >
            <animate
              attributeName="height"
              dur={"1s"}
              begin={"0%"}
              from={"0%"}
              to={heightLevel + "%"}
              repeatCount={1}
            ></animate>
          </rect>

          {/* shadow */}
          <rect
            x={"31%"}
            y={"0%"}
            rx={"6%"}
            ry={"6%"}
            width={"7%"}
            height={heightLevel + "%"}
            fill={"#5555552d"}
          >
            <animate
              attributeName="height"
              dur={"1s"}
              begin={"0%"}
              from={"0%"}
              to={heightLevel + "%"}
              repeatCount={1}
            ></animate>
          </rect>
        </g>

        <circle r={"15%"} cx={"30.5%"} cy={"78%"} fill={colorLevel}></circle>
        <image
          x={"15%"}
          y={"52%"}
          width={"32%"}
          height={"50%"}
          opacity={0.1}
          href={semicircleIcon}
        ></image>

        {/* imagen humedad plantacion */}
        <image
          x={"57%"}
          y={"21%"}
          width={"32%"}
          height={"32%"}
          href={humidityIcon}
        ></image>
        <image
          x={"52%"}
          y={"50%"}
          width={"45%"}
          height={"45%"}
          href={plantation.cropType.image}
        ></image>
      </svg>
    </div>
  );
};
