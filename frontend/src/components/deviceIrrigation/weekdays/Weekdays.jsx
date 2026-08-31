import styles from "./Weekdays.module.css";
import { useWeekdayLogs } from "../../../contexts/LogsWeekdayContext";

export const Weekdays = () => {
  const { weekdays, setWeekdaySelected, weekdaySelected } = useWeekdayLogs();

  return (
    <div className={styles.weekdays}>
      <ul>
        {weekdays.map((weekday, index) => (
          <li
            key={index}
            className={weekdaySelected == index + 1 ? styles.selected : ""}
          >
            <button onClick={() => setWeekdaySelected(index + 1)}>
              {new Date().getDay() + 1 == index + 1
                ? weekday + " (hoy)"
                : weekday}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
