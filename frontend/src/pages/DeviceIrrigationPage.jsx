import { LoadingScreenPage } from "./LoadingScreenPage";
import { DeviceIrrigation } from "../components/deviceIrrigation/DeviceIrrigation";
import { DevicesPage } from "./DevicesPage";
import { WeatherProvider } from "../contexts/WeatherContext";
import { useDevice } from "../contexts/DeviceContext";

export const DeviceIrrigationPage = () => {
  const { deviceSelected, loadingDevice } = useDevice();

  return (
    <>
      {loadingDevice == true ? (
        <LoadingScreenPage />
      ) : deviceSelected ? (
        <WeatherProvider>
          <DeviceIrrigation />
        </WeatherProvider>
      ) : (
        <DevicesPage />
      )}
    </>
  );
};
