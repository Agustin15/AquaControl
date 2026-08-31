import { BrowserRouter, Routes, Route } from "react-router";
import { SignUpPage } from "./pages/SignUpPage";
import { LoginPage } from "./pages/LoginPage";
import { LoadingScreenPage } from "./pages/LoadingScreenPage";
import { DevicesPage } from "./pages/DevicesPage";
import { DeviceIrrigationPage } from "./pages/DeviceIrrigationPage";
import { useAuth } from "./contexts/AuthContext";
import { DeviceProvider } from "./contexts/DeviceContext";
export const App = () => {
  const { userAuth, loadingAuth } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            loadingAuth ? (
              <LoadingScreenPage />
            ) : userAuth ? (
              <DevicesPage />
            ) : (
              <LoginPage />
            )
          }
        />

        <Route
          path="/devices"
          element={
            loadingAuth ? (
              <LoadingScreenPage />
            ) : userAuth ? (
              <DevicesPage />
            ) : (
              <LoginPage />
            )
          }
        />

        <Route
          path="/deviceIrrigate"
          element={
            <DeviceProvider>
              <DeviceIrrigationPage />
            </DeviceProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
