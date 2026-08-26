import { createContext, useContext, useState } from "react";
import { getTokenSaved } from "../../securityStorage.js";
import { useDevice } from "../DeviceContext.jsx";
import { useAuth } from "../AuthContext.jsx";
const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;

const FormPlantContext = createContext();

export const FormPlantProvider = ({ children }) => {
  const { updateAccessToken } = useAuth();
  const { deviceSelected } = useDevice();

  const [valuesForm, setValuesForm] = useState({
    id: 0,
    image: null,
    umbralHumidity: 0,
    description: "",
  });
  const [errorsForm, setErrorsForm] = useState({
    image: "",
    umbralHumidity: "",
    description: "",
  });
  const [loadingForm, setLoadingForm] = useState(false);

  const fetchPostOrPut = async (method, retry) => {
    setLoadingForm(true);
    try {
      const accessToken = await getTokenSaved("accessToken");

      const response = await fetch(localhostBackend + "/api/plant", {
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
    <FormPlantContext.Provider
      value={{
        fetchPostOrPut,
        valuesForm,
        setValuesForm,
        errorsForm,
        setErrorsForm,
        loadingForm,
      }}
    >
      {children}
    </FormPlantContext.Provider>
  );
};

export const useFormPlant = () => useContext(FormPlantContext);
