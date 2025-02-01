import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Define the base directory for Android, iOS, and Web
const getBaseDirectoryPath = () => {
  return Platform.OS === 'web' ? 'web-storage/' : `${FileSystem.documentDirectory}com.kis/`;
};

// Generate a subdirectory path based on type
const getSubDirectoryPath = (type: string) => {
  return `${getBaseDirectoryPath()}${type}/`;
};

// Ensure the directory exists before performing file operations
const ensureDirectoryExists = async (dirPath: string) => {
  if (Platform.OS !== 'web') {
    const dirInfo = await FileSystem.getInfoAsync(dirPath);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
    }
  }
};

// Retrieve cached data
export const getCache = async (type: string, key: string) => {
  const filePath = `${getSubDirectoryPath(type)}${key}.json`;

  try {
    if (Platform.OS === 'web') {
      const cachedData = localStorage.getItem(filePath);
      return cachedData ? JSON.parse(cachedData) : null;
    } else {
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists) {
        const data = await FileSystem.readAsStringAsync(filePath);
        return JSON.parse(data);
      }
    }
  } catch (error) {
    console.error(`Error reading cache file (${type}/${key}):`, error);
  }
  return null;
};

// Store or update cached data
export const setCache = async (type: string, key: string, newData: any) => {
  const dirPath = getSubDirectoryPath(type);
  const filePath = `${dirPath}${key}.json`;

  try {
    await ensureDirectoryExists(dirPath);
    let existingData = await getCache(type, key);
    
    if (!existingData || !Array.isArray(existingData)) {
      existingData = [];
    }

    const newDataArray = Array.isArray(newData) ? newData : [newData];

    // Merge or update existing data
    newDataArray.forEach((newItem) => {
      const existingIndex = existingData.findIndex((item: { id: any }) => item.id === newItem.id);
      if (existingIndex !== -1) {
        existingData[existingIndex] = newItem;
      } else {
        existingData.push(newItem);
      }
    });

    const jsonData = JSON.stringify(existingData);
    
    if (Platform.OS === 'web') {
      localStorage.setItem(filePath, jsonData);
    } else {
      await FileSystem.writeAsStringAsync(filePath, jsonData);
    }
  } catch (error) {
    console.error(`Error writing cache file (${type}/${key}):`, error);
  }
};

// Clear specific cached data
export const clearCacheByKey = async (type: string, key: string) => {
  const filePath = `${getSubDirectoryPath(type)}${key}.json`;

  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(filePath);
    } else {
      await FileSystem.deleteAsync(filePath, { idempotent: true });
    }
  } catch (error) {
    console.error(`Error clearing cache file (${type}/${key}):`, error);
  }
};

// Clear all cached data for a given type
export const clearCacheByType = async (type: string) => {
  const dirPath = getSubDirectoryPath(type);

  try {
    if (Platform.OS === 'web') {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(dirPath)) {
          localStorage.removeItem(key);
        }
      });
    } else {
      await FileSystem.deleteAsync(dirPath, { idempotent: true });
    }
  } catch (error) {
    console.error(`Error clearing cache directory (${type}):`, error);
  }
};

// Retrieve user data and token
export const getUserData = async () => {
  return {
    user: await getCache('users', 'user-info'),
    token: await getCache('tokens', 'userToken'),
  };
};

// Store user data and token
export const setUserData = async (user: any, token: any) => {
  await setCache('users', 'user-info', user);
  await setCache('tokens', 'userToken', token);
};

// Clear user data and token
export const clearUserData = async () => {
  await clearCacheByType('users');
  await clearCacheByType('tokens');
};

// Retrieve cached data by key dynamically
export const getCachedDataByKey = async (type: string, key: string) => {
  return await getCache(type, key);
};

// Store cached data by key dynamically
export const setCachedDataByKey = async (type: string, key: string, data: any) => {
  await setCache(type, key, data);
};

// Clear specific cached data dynamically
export const clearSpecificCache = async (type: string, key: string) => {
  await clearCacheByKey(type, key);
};

// Save private key securely
export const savePrivateKey = async (key: string, privateKey: string) => {
  try {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      await SecureStore.setItemAsync(key, privateKey);
    } else if (Platform.OS === 'web') {
      localStorage.setItem(key, privateKey);
    } else {
      console.warn('Unsupported platform for secure storage');
    }
  } catch (error) {
    console.error('Error saving private key:', error);
  }
};

// Retrieve private key securely
export const getPrivateKey = async (key: string) => {
  try {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      return await SecureStore.getItemAsync(key);
    } else if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      console.warn('Unsupported platform for secure storage');
    }
  } catch (error) {
    console.error('Error retrieving private key:', error);
  }
  return null;
};

// Remove private key securely
export const deletePrivateKey = async (key: string) => {
  try {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      await SecureStore.deleteItemAsync(key);
    } else if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      console.warn('Unsupported platform for secure storage');
    }
  } catch (error) {
    console.error('Error deleting private key:', error);
  }
};
