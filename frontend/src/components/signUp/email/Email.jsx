import styles from "./Email.module.css";
import iconWarningInput from "../../../assets/img/warningInput.png";
import { useSignUp } from "../../../contexts/SignUpContext";

export const Email = () => {
  const { errors, values, setValues } = useSignUp();

  return (
    <div className={styles.columnEmailInput}>
      <label>Email:</label>
      <input
        className={errors.email.length > 0 ? styles.inputError : ""}
        onChange={(event) =>
          setValues({ ...values, ["email"]: event.target.value })
        }
        maxLength={30}
        placeholder="Ingrese email"
        type="text"
      ></input>
      {errors.email.length > 0 && (
        <div className={styles.msjError}>
          <p>
            <img src={iconWarningInput}></img>
            {errors.email}
          </p>
        </div>
      )}
    </div>
  );
};
