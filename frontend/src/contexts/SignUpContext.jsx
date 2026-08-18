import { createContext, useContext, useState } from "react";
import { alertError } from "../components/alertSwal/alertSwal.js";
import { saveInfo, saveTokens } from "../securityStorage.js";
import { useAuth } from "./AuthContext.jsx";
const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;
const localhostFrontend = import.meta.env.VITE_FRONTEND_LOCALHOST;

const SignUpContext = createContext();

export const SignUpProvider = ({ children }) => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState([
    {
      validation: "Minimo 13 caracteres",
      regex: /^.{13,}$/,
      valid: false,
    },
    {
      validation: "Mayusculas",
      regex: /[A-Z]/,
      valid: false,
    },
    {
      validation: "Minusculas",
      regex: /[a-z]/,
      valid: false,
    },
    {
      validation: "Numeros",
      regex: /\d/,
      valid: false,
    },
    {
      validation: "Caracter especial",
      regex: /[^A-Za-z\d]/,
      valid: false,
    },
  ]);

  const { setUserAuth } = useAuth();

  const handleSubmit = (event, navigate) => {
    event.preventDefault();

    const errorsInput = { username: "", password: "", email: "" };

    if (values.username.length == 0)
      errorsInput.username = "Debe ingresar un nombre de usuario";
    if (values.password.length == 0)
      errorsInput.password = "Debe ingresar una contrasenia";

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.email))
      errorsInput.email = "Debe ingresar una correo valido";

    setErrors(errorsInput);

    if (
      passwordValidations.find((item) => !item.valid) ||
      Object.values(errorsInput).find((errorInput) => errorInput.length > 0)
    )
      return;

    return fetchSignUp(navigate);
  };

  const handleChangePassword = (event) => {
    const { value } = event.target;
    setValues({ ...values, ["password"]: value });

    setPasswordValidations(
      passwordValidations.map((item) => ({
        ...item,
        valid: item.regex.test(value),
      })),
    );
  };

  const fetchSignUp = async (navigate) => {
    setLoading(true);
    try {
      const response = await fetch(localhostBackend + "/api/user/signup", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-type": "application/json",
        },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      if (result) {
        await saveTokens(result.accessToken, result.refreshToken);
        await saveInfo("userLogued", result.user);
        setUserAuth(result.user);
        navigate("/devices");
      }
    } catch (error) {
      alertError("Ups, algo salio mal al registarse", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignUpContext.Provider
      value={{
        values,
        errors,
        setValues,
        passwordValidations,
        handleChangePassword,
        handleSubmit,
        loading,
      }}
    >
      {children}
    </SignUpContext.Provider>
  );
};

export const useSignUp = () => useContext(SignUpContext);
