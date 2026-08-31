import { LoadingScreenPage } from "./LoadingScreenPage";
import { DeviceIrrigation } from "../components/deviceIrrigation/DeviceIrrigation";
import { DevicesPage } from "./DevicesPage";
import { useDevice } from "../contexts/DeviceContext";
import { WeatherProvider } from "../contexts/WeatherContext";

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
