import { SignUp } from "../components/signUp/SignUp";
import { SignUpProvider } from "../contexts/SignUpContext";

export const SignUpPage = () => {
  return (
    <SignUpProvider>
      <SignUp></SignUp>
    </SignUpProvider>
  );
};
