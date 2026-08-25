export const Rain = ({ cx, cy,duration }) => {
  return (
    <circle cx={cx} cy={cy} r={4} fill="#3cbbd1">
      <animate
        attributeName="cy"
        from={cy}
        to={74}
        dur={duration}
        repeatCount={"indefinite"}
      ></animate>
    </circle>
  );
};
