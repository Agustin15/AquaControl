import styles from "./SignUp.module.css";
import iconTick from "../../assets/img/tick.png";
import iconError from "../../assets/img/error.png";

export const ValidationPassword = ({ passwordValidations }) => {
  return (
    <ul className={styles.validationPassword}>
      {passwordValidations.map((item, index) => (
        <li key={index}>
          <p className={item.valid ? styles.valid : styles.error}>
            {item.validation}
          </p>
          <img src={item.valid ? iconTick : iconError}></img>
        </li>
      ))}
    </ul>
  );
};
