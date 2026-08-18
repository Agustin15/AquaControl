import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";

export const saveTokens = async (accessToken, refreshToken) => {
  await SecureStoragePlugin.set({ key: "accessToken", value: accessToken });
  await SecureStoragePlugin.set({ key: "refreshToken", value: refreshToken });
};

export const saveAccessToken = async (accessToken) => {
  await SecureStoragePlugin.set({ key: "accessToken", value: accessToken });
};

export const getTokenSaved = async (key) => {
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
  await SecureStoragePlugin.remove({ key: "deviceSelected" });
};
