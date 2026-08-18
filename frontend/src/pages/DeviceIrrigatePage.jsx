import { LoadingScreenPage } from "./LoadingScreenPage";
import { DeviceIrrigate } from "../components/deviceIrrigate/DeviceIrrigate";
import { DevicesPage } from "./DevicesPage";
import { useDevice } from "../contexts/DeviceContext";

export const DeviceIrrigatePage = () => {
  const { deviceSelected, loadingDevice } = useDevice();

  return (
    <>
      {loadingDevice == true ? (
        <LoadingScreenPage />
      ) : deviceSelected ? (
        <DeviceIrrigate />
      ) : (
        <DevicesPage />
      )}
    </>
  );
};
