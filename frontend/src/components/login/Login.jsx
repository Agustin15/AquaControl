import styles from "./Login.module.css";
import iconLogo from "../../assets/img/logo.png";
import iconWarningInput from "../../assets/img/warningInput.png";
import iconShowedPassword from "../../assets/img/showedPassword.png";
import iconHiddedPassword from "../../assets/img/hiddedPassword.png";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useLogin } from "../../contexts/LoginContext";

export const Login = () => {
  const { handleSubmit, setValues, values, errors, loading } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  let navigate = useNavigate();

  return (
    <div className={styles.containLogin}>
      <div className={styles.title}>
        <img src={iconLogo}></img>
        <h3>Bienvenido a AquaControl</h3>
      </div>

      <form onSubmit={() => handleSubmit(event, navigate)}>
        <h4>Iniciar sesion</h4>

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

        <div className={styles.columnInput}>
          <label>Contraseña</label>
          <input
            className={errors.password.length > 0 ? styles.inputError : ""}
            onChange={(event) =>
              setValues({ ...values, ["password"]: event.target.value })
            }
            placeholder="Ingrese contraseña"
            type={showPassword ? "text" : "password"}
          ></input>

          <img
            onClick={() => setShowPassword(showPassword ? false : true)}
            className={styles.viewPassword}
            src={showPassword ? iconShowedPassword : iconHiddedPassword}
          ></img>

          {errors.password && (
            <div className={styles.msjError}>
              <p>
                <img src={iconWarningInput}></img>
                {errors.password}
              </p>
            </div>
          )}
        </div>

        <button disabled={loading}>
          {loading ? "Iniciando sesion..." : "Iniciar sesion"}
        </button>
      </form>
      <p className={styles.alreadyHaveAccount}>
        ¿No posee una cuenta? <a href="/signup">Registrese</a>
      </p>
    </div>
  );
};
