import styles from "./DrawingLevelHumidity.module.css";
import humidityIcon from "../../../assets/img/humidityIndicator.png";
import { detailsHumidity } from "./function.js";
import { usePlantation } from "../../../contexts/plantationContext/PlantationContext";

export const DrawingLevelHumidity = ({ humidity }) => {
  const { plantationSelected } = usePlantation();

  let optimePercentege = (humidity * 100) / plantationSelected.humidityMax;

  let colorLevel = detailsHumidity(optimePercentege);

  return (
    <div className={styles.levelHumidity}>
      <svg width={65} height={70} viewBox="0 0 65 70">
        {/*medidor humedad*/}
        <rect
          x={10.5}
          y={4}
          rx={8}
          ry={8}
          width={16}
          height={50}
          fill={"#45454598"}
        ></rect>

        <circle r={13} cx={18} cy={56} fill={"#45454598"}></circle>

        {/* contenido */}
        <g transform="translate(0, 50) scale(1, -1)">
          <rect
            x={14}
            y={0}
            rx={4}
            ry={4}
            width={9}
            height={
              ((optimePercentege > 100 ? 100 : optimePercentege) * 41) / 100
            }
            fill={colorLevel}
          >
            <animate
              attributeName="height"
              dur={"1s"}
              begin={0}
              from={0}
              to={
                ((optimePercentege > 100 ? 100 : optimePercentege) * 41) / 100
              }
              repeatCount={1}
            ></animate>
          </rect>
          
          {/* shadow */}
          <rect
            x={18.6}
            y={0}
            rx={4}
            ry={4}
            width={4}
            height={
              ((optimePercentege > 100 ? 100 : optimePercentege) * 41) / 100
            }
            fill={"#5555552d"}
          >
            <animate
              attributeName="height"
              dur={"1s"}
              begin={0}
              from={0}
              to={
                ((optimePercentege > 100 ? 100 : optimePercentege) * 41) / 100
              }
              repeatCount={1}
            ></animate>
          </rect>
        </g>

        <circle r={10} cx={18.2} cy={56} fill={colorLevel}></circle>
        <path d="M 19,46 A 11,11 0 0,1 19,76" fill={"#5555552d"}></path>

        {/* imagen humedad plantationa */}
        <image x={36} y={17} width={18} height={18} href={humidityIcon}></image>
        <image x={36} y={40} width={25} height={25} href={plantationSelected.cropType.image}></image>
      </svg>
    </div>
  );
};
