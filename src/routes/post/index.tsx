import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from "@/src/services/apiService";
import { isOnline } from "@/src/services/networkMonitor";
import { getCachedDataByKey, setCachedDataByKey } from '../cache';
import { CacheKeys, CacheTypes } from '../cacheKeys';

/**
 * Recursively scans the object and replaces file-like objects with their URI.
 * Supports { uri: string, name: string, type: string } structure from image/file pickers.
 */
const sanitizeFileData = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeFileData(item));
  }

  if (obj && typeof obj === 'object') {
    // Check if it looks like a file (common structure in React Native)
    if (obj.uri && obj.name && obj.type) {
      return obj.uri;
    }

    // Otherwise, recurse
    const sanitized: any = {};
    for (const key in obj) {
      sanitized[key] = sanitizeFileData(obj[key]);
    }
    return sanitized;
  }

  return obj;
};

/**
 * Generalized POST Function
 */
export const postRequest = async (
  url: string,
  data: any,
  options: {
    headers?: { [key: string]: string };
    cacheKey?: string;
    cacheType?: string;
    successMessage?: string;
    errorMessage?: string;
  } = {}
) => {
  try {
    const online = await isOnline();
    if (!online) throw new Error('No internet connection.');

    const cacheType = CacheTypes.AUTH_CACHE;
    const cacheKey = CacheKeys.LOGIN_DATA;

    let token = null;
    try {
      const userData = await getCachedDataByKey(cacheType, cacheKey);
      token = userData[0]?.token?.access || null;
    } catch (err) {
      console.log("Error retrieving token:", err);
    }

    console.log("token: ", token || "No token found");

    const defaultHeaders: { Authorization?: string; 'Content-Type': string } = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const headers = { ...defaultHeaders, ...options.headers };

    // 🧼 Sanitize file-like objects before sending
    const sanitizedData = sanitizeFileData(data);

    const response = await apiService.post(url, sanitizedData, headers);
    const responseData = await response.json();

    if (response.ok) {
      if (options.cacheKey) {
        const cacheType = options.cacheType || 'default';
        await setCachedDataByKey(cacheType, options.cacheKey, responseData);
      }
      return { success: true, data: responseData, message: options.successMessage || '' };
    } else {
      return { success: false, message: responseData.message || options.errorMessage || '' };
    }
  } catch (error: any) {
    console.log("Error:", error);
    return { success: false, message: error.message || options.errorMessage || 'An error occurred.' };
  }
};
