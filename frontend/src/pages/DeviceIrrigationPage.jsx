import { LoadingScreenPage } from "./LoadingScreenPage";
import { DeviceIrrigation } from "../components/deviceIrrigation/DeviceIrrigation";
import { DevicesPage } from "./DevicesPage";
import { useDevice } from "../contexts/deviceContext/DeviceContext";
import { MqttProvider } from "../contexts/MqttContext";

export const DeviceIrrigationPage = () => {
  const { deviceSelected, loadingDevice } = useDevice();

  return (
    <>
      {loadingDevice == true ? (
        <LoadingScreenPage />
      ) : deviceSelected ? (
        <MqttProvider>
          <DeviceIrrigation />
        </MqttProvider>
      ) : (
        <DevicesPage />
      )}
    </>
  );
};
