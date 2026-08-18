export const formatDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const year = date.getFullYear();

  return (
    (day < 10 ? "0" + day : day) +
    "/" +
    (month < 10 ? "0" + month : month) +
    "/" +
    year +
    " " +
    (hour < 10 ? "0" + hour : hour) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes)
  );
};

export const calculateDuration = (dateStart, dateEnd) => {
  const durationMinutes = dateEnd.getMinutes() - dateStart.getMinutes();

  return durationMinutes + (durationMinutes == 1 ? " minuto" : " minutos");
};
