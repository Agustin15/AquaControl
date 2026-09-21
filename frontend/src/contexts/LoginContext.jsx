import { createContext, useContext, useState } from "react";
import { alertError } from "../components/alertSwal/alertSwal.js";
import { saveAuthToken, saveInfo} from "../securityStorage.js";
import { useAuth } from "./AuthContext.jsx";
const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { setUserAuth } = useAuth();

  const handleSubmit = (event, navigate) => {
    event.preventDefault();

    const errorsInput = { username: "", password: "" };

    if (values.username.length == 0)
      errorsInput.username = "Debe ingresar un nombre de usuario";
    if (values.password.length == 0)
      errorsInput.password = "Debe ingresar una contrasenia";

    setErrors(errorsInput);

    if (Object.values(errorsInput).find((errorInput) => errorInput.length > 0))
      return;

    return fetchLogin(navigate);
  };

  const fetchLogin = async (navigate) => {
    setLoading(true);

    try {
      const response = await fetch(localhostBackend + "/api/user/login", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-type": "application/json",
        },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      if (result) {
        await saveAuthToken("accessToken", result.accessToken);
        await saveAuthToken("refreshToken", result.refreshToken);

        await saveInfo("userLogued", result.user);
        setUserAuth(result.user);
        navigate("/devices");
      }
    } catch (error) {
      const errorMessage =
        error?.message || "No se pudo iniciar sesión en este momento";
      alertError("Ups, algo salio mal al iniciar sesion", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContext.Provider
      value={{
        values,
        errors,
        setValues,
        handleSubmit,
        loading,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);
