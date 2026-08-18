import styles from "./SignUp.module.css";
import iconLogo from "../../assets/img/logo.png";
import iconShowedPassword from "../../assets/img/showedPassword.png";
import iconHiddedPassword from "../../assets/img/hiddedPassword.png";
import iconWarningInput from "../../assets/img/warningInput.png";
import { ValidationPassword } from "./ValidationPassword";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSignUp } from "../../contexts/SignUpContext.jsx";
import { Email } from "./email/Email.jsx";

export const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    errors,
    values,
    setValues,
    loading,
    passwordValidations,
    handleChangePassword,
    handleSubmit,
  } = useSignUp();

  let navigate = useNavigate();

  return (
    <div className={styles.containSignUp}>
      <div className={styles.title}>
        <img src={iconLogo}></img>
        <h3>Bienvenido a AquaControl</h3>
      </div>

      <form onSubmit={() => handleSubmit(event, navigate)}>
        <h4>Crear cuenta</h4>

        <div className={styles.columnInput}>
          <label>Nombre de usuario</label>
          <input
            className={errors.username.length > 0 ? styles.inputError : ""}
            onChange={(event) =>
              setValues({ ...values, ["username"]: event.target.value })
            }
            maxLength={15}
            placeholder="Ingrese nombre de usuario"
            type="text"
          ></input>
          {errors.username.length > 0 && (
            <div className={styles.msjError}>
              <p>
                <img src={iconWarningInput}></img>
                {errors.username}
              </p>
            </div>
          )}
        </div>

        <Email />

        <div className={styles.columnInputPassword}>
          <label>Contraseña</label>

          <input
            className={errors.password.length > 0 ? styles.inputError : ""}
            placeholder="Ingrese contraseña"
            type={showPassword ? "text" : "password"}
            onChange={(event) => handleChangePassword(event)}
          ></input>

          <img
            onClick={() => setShowPassword(showPassword ? false : true)}
            className={styles.viewPassword}
            src={showPassword ? iconShowedPassword : iconHiddedPassword}
          ></img>

          {values.password.length > 0 && (
            <ValidationPassword passwordValidations={passwordValidations} />
          )}

          {values.password == 0 && errors.password && (
            <div className={styles.msjError}>
              <p>
                <img src={iconWarningInput}></img>
                {errors.password}
              </p>
            </div>
          )}
        </div>

        <button disabled={loading}>
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>
      <p className={styles.alreadyHaveAccount}>
        ¿Ya tiene una cuenta? <a href="/login">Inicie sesion</a>
      </p>
    </div>
  );
};
