import { Devices } from "../components/devices/Devices";
import { DeviceProvider } from "../contexts/deviceContext/DeviceContext";
import { OptionsDeviceProvider } from "../contexts/deviceContext/OptionsDeviceContext";

export const DevicesPage = () => {
  return (
    <DeviceProvider>
      <OptionsDeviceProvider>
        <Devices />
      </OptionsDeviceProvider>
    </DeviceProvider>
  );
};
