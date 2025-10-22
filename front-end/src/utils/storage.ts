import AsyncStorage from "@react-native-async-storage/async-storage";


interface Usuario{
  nome: string,
  email: string
  imagemPerfil: string
}

export const saveUser = async (user: Usuario, token: string) => {
  await AsyncStorage.setItem("usuario", JSON.stringify(user));
  await AsyncStorage.setItem("token", token);
};

export const obterUsuario = async(): Promise<Usuario | null> => {
 const usuario = await AsyncStorage.getItem('usuario');
 return usuario ? JSON.parse(usuario) : null;
};

export const getToken = async () => {
  return await AsyncStorage.getItem("token");
};

export const clearStorage = async () => {
  await AsyncStorage.multiRemove(["usuario", "token"]);
};
