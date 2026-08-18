import { Devices } from "../components/devices/Devices";
import { DeviceProvider } from "../contexts/DeviceContext";
import { CrudDeviceProvider } from "../contexts/CrudDeviceContext";

export const DevicesPage = () => {
  return (
    <DeviceProvider>
      <CrudDeviceProvider>
        <Devices />
      </CrudDeviceProvider>
    </DeviceProvider>
  );
};
