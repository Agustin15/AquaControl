import humidityIndicator from "../../../../../../assets/img/humidityIndicator.png";

export const HumidityLevel = ({ optimePercentege, colorLevel }) => {
  return (
    <svg width={65} height={85} viewBox="0 0 65 85">
      {/*medidor humedad*/}
      <rect
        x={10.5}
        y={4}
        rx={8}
        ry={8}
        width={18}
        height={60}
        fill={"#45454598"}
      ></rect>

      <circle r={14} cx={19} cy={65} fill={"#45454598"}></circle>

      {/* contenido */}
      <g transform="translate(0, 64) scale(1, -1)">
        <rect
          x={14.4}
          y={6}
          rx={4}
          ry={4}
          width={10}
          height={
            ((optimePercentege > 100 ? 100 : optimePercentege) * 50) / 100
          }
          fill={colorLevel}
        ></rect>

        {/* shadow */}
        <rect
          x={19}
          y={5}
          rx={4}
          ry={4}
          width={5}
          height={
            ((optimePercentege > 100 ? 100 : optimePercentege) * 50) / 100
          }
          fill={"#5555552d"}
        ></rect>
      </g>

      <circle r={11} cx={19} cy={65} fill={colorLevel}></circle>
      <path d="M 19,54 A 11,11 0 0,1 19,76" fill={"#5555552d"}></path>

      <image
        x={30}
        y={25}
        width={30}
        height={30}
        href={humidityIndicator}
      ></image>
    </svg>
  );
};
