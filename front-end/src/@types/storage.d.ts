// src/types/storage.d.ts
declare module '@react-native-async-storage/async-storage' {
  interface AsyncStorageStatic {
    multiRemove(arg0: string[]): unknown;
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
  }
  const AsyncStorage: AsyncStorageStatic;
  export default AsyncStorage;
}