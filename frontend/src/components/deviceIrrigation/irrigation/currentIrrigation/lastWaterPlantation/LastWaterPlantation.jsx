import styles from "./LastWaterPlantation.module.css";

export const LastWaterPlantation = ({ lastWaterPlantation }) => {
  let ago;
  let datetimeStart = new Date(lastWaterPlantation.datetimeStart);

  let differenceSeconds =
    new Date(new Date().getTime() - datetimeStart.getTime()) / 1000;

  switch (true) {
    case differenceSeconds < 60:
      ago = "Hace menos de 1 minuto";
      break;
    case differenceSeconds >= 60 && differenceSeconds < 3600:
      let minutes = Math.round(differenceSeconds / 60);
      ago = "Hace " + minutes + (minutes > 1 ? " minutos" : " minuto");
      break;

    case differenceSeconds >= 3600 && differenceSeconds < 86400:
      let hours = Math.round(differenceSeconds / 3600);
      ago = "Hace " + hours + (hours > 1 ? " horas" : " hora");
      break;

    case differenceSeconds >= 86400 && differenceSeconds < 604800:
      let days = Math.round(differenceSeconds / 86400);
      ago = "Hace " + days + (days > 1 ? " dias" : " dia");
      break;

    case differenceSeconds >= 604800:
      let weeks = Math.round(differenceSeconds / 604800);
      ago = "Hace " + weeks + (weeks > 1 ? " semanas" : " semana");
      break;
  }

  return (
    <div className={styles.lastWaterPlantation}>
      <span>Ultimo riego: {ago}</span>
    </div>
  );
};
