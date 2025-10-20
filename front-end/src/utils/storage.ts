import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveUser = async (user: any, token: string) => {
  await AsyncStorage.setItem("usuario", JSON.stringify(user));
  await AsyncStorage.setItem("token", token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem("token");
};

export const clearStorage = async () => {
  await AsyncStorage.multiRemove(["usuario", "token"]);
};
