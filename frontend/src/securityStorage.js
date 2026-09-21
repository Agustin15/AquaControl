import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";

export const saveAuthToken = async (key, value) => {
  await SecureStoragePlugin.set({ key: key, value: value });
};
export const getAuthTokenSaved = async (key) => {
  const { value } = await SecureStoragePlugin.get({ key: key });
  return value;
};

export const saveInfo = async (key, value) => {
  return await SecureStoragePlugin.set({
    key: key,
    value: JSON.stringify(value),
  });
};

export const getInfoSaved = async (key) => {
  try {
    const { value } = await SecureStoragePlugin.get({ key: key });
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

export const cleanInfo = async () => {
  await SecureStoragePlugin.remove({ key: "accessToken" });
  await SecureStoragePlugin.remove({ key: "refreshToken" });
  await SecureStoragePlugin.remove({ key: "userLogued" });

  if (await getInfoSaved("deviceSelected"))
    await SecureStoragePlugin.remove({ key: "deviceSelected" });
};
