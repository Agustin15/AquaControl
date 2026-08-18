import { Login } from "../components/login/Login";
import { LoginProvider } from "../contexts/LoginContext";

export const LoginPage = () => {
  return (
    <LoginProvider>
      <Login />
    </LoginProvider>
  );
};
