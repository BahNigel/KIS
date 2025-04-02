import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from "@/src/services/apiService";
import { isOnline } from "@/src/services/networkMonitor";
import { getCachedDataByKey, setCachedDataByKey } from '../cache';
import { CacheKeys, CacheTypes } from '../cacheKeys';

/**
 * Generalized POST Function
 *
 * @param {string} url - The API endpoint URL to send the POST request to.
 * @param {any} data - The payload data to send in the POST request.
 * @param {object} options - Additional options:
 *   @param {object} [options.headers] - Additional headers for the request.
 *   @param {string} [options.cacheKey] - Key to cache the response.
 *   @param {string} [options.cacheType] - Type of cache directory (default: 'default').
 *   @param {string} [options.successMessage] - Message to display on success.
 *   @param {string} [options.errorMessage] - Message to display on error.
 *
 * @returns {Promise<{ success: boolean, data?: any, message: string }>}
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

    const response = await apiService.post(url, data, headers);
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
