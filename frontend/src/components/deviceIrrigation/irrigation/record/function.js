export const calculateDuration = (dateStart, dateEnd) => {
  const durationMinutes = dateEnd.getMinutes() - dateStart.getMinutes();

  return durationMinutes + (durationMinutes == 1 ? " minuto" : " minutos");
};
