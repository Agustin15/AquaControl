import { createContext, useContext, useState } from "react";
import { getTokenSaved } from "../../securityStorage.js";
import { useAuth } from "../AuthContext";
import { useDevice } from "../DeviceContext.jsx";
const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;

const FormTankContext = createContext();

export const FormTankProvider = ({ children }) => {
  const [valuesForm, setValuesForm] = useState({
    id: 0,
    height: 0,
  });
  const [loadingForm, setLoadingForm] = useState(false);
  const [errorsForm, setErrorsForm] = useState({
    id: "",
    height: "",
  });

  const { updateAccessToken } = useAuth();
  const { deviceSelected } = useDevice();

  
  const fetchPostOrPut = async (method, retry) => {
    setLoadingForm(true);

    try {
      const accessToken = await getTokenSaved("accessToken");

      const response = await fetch(localhostBackend + "/api/tank", {
        method: method,
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ...valuesForm, ["device"]: deviceSelected }),
      });

      if (response.status === 401 && retry == true) {
        await updateAccessToken();
        return fetchPostOrPut(method, false);
      }
      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoadingForm(false);
    }
  };


  return (
    <FormTankContext.Provider
      value={{
        fetchPostOrPut,
        loadingForm,
        valuesForm,
        setValuesForm,
        errorsForm,
        setErrorsForm
      }}
    >
      {children}
    </FormTankContext.Provider>
  );
};

export const useFormTank = () => useContext(FormTankContext);
