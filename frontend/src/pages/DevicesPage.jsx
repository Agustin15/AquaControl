import { Devices } from "../components/devices/Devices";
import { DeviceProvider } from "../contexts/DeviceContext";

export const DevicesPage = () => {
  return (
    <DeviceProvider>
      <Devices />
    </DeviceProvider>
  );
};
