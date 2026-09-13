import { createContext, useContext, useState } from "react";
import { getTokenSaved } from "../../securityStorage.js";
import { useDevice } from "../DeviceContext.jsx";
import { useAuth } from "../AuthContext.jsx";
const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;

const FormPlantationContext = createContext();

export const FormPlantationProvider = ({ children }) => {
  const { updateAccessToken } = useAuth();
  const { deviceSelected } = useDevice();

  const [valuesForm, setValuesForm] = useState({
    id: 0,
    image: null,
    humidityMin: 0,
    humidityMax: 0,
    cropType: null,
    amountPlants: 0,
  });
  const [errorsForm, setErrorsForm] = useState({
    image: "null",
    humidityMin: "",
    humidityMax: "",
    cropType: "",
    amountPlants: "",
  });
  const [loadingForm, setLoadingForm] = useState(false);

  const fetchPostOrPut = async (method, retry) => {
    setLoadingForm(true);
    try {
      const accessToken = await getTokenSaved("accessToken");

      const response = await fetch(localhostBackend + "/api/plantation", {
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

  const handleClose = () => {
    setValuesForm({
      id: 0,
      image: null,
      humidityMin: 0,
      humidityMax: 0,
      cropType: null,
      amountPlants: 0,
    });

    setErrorsForm({
      image: "null",
      humidityMin: "",
      humidityMax: "",
      cropType: "",
      amountPlants: "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValuesForm({ ...valuesForm, [name]: value });

    let messageError = "";

    switch (name) {
      case "cropType":
        if (!value) messageError = "Debe seleccionar un tipo de cultivo";
        break;

      case "humidityMin":
      case "humidityMax":
        if (value.length == 0 || value < 0 || value > 100) {
          messageError =
            (name == "humidityMin" ? "Humedad minima" : "Humedad maxima") +
            " debe estar entre 0 y 100";
        }
        break;
      case "amountPlants":
        if (value.length == 0 || value <= 0 || value > 10)
          messageError = "Cantidad de plantas debe ser entre 1 y 10";
        break;
    }

    setErrorsForm({
      ...errorsForm,
      [name]: messageError,
    });
  };

  return (
    <FormPlantationContext.Provider
      value={{
        fetchPostOrPut,
        valuesForm,
        setValuesForm,
        errorsForm,
        setErrorsForm,
        loadingForm,
        handleClose,
        handleChange,
      }}
    >
      {children}
    </FormPlantationContext.Provider>
  );
};

export const useFormPlantation = () => useContext(FormPlantationContext);
