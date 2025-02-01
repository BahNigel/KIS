/**
 * Fetch Data Utility Function
 *
 * Updated to integrate dynamic directories for caching based on type.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from "@/src/services/apiService";
import { getCachedDataByKey, setCachedDataByKey } from '../cache';
import { CacheKeys, CacheTypes } from '../cacheKeys';

interface FetchDataOptions {
  useCache?: boolean; // Whether to retrieve data from cache
  saveToCache?: boolean; // Whether to save fetched data to cache
  headers?: Record<string, string>; // Custom headers for the API request
  messages?: {
    success?: string; // Custom success message
    error?: string; // Custom error message
  };
  cacheType?: string; // Type of cache directory (e.g., 'users', 'data')
}

export const fetchData = async (
  url: string,
  storageKey: string,
  options: FetchDataOptions = {}
): Promise<any> => {
  const {
    useCache = true,
    saveToCache = true,
    headers = {},
    messages = {},
    cacheType = 'default', // Use a 'default' type if not specified
  } = options;

  try {
    // Check if cached data is available and return it if useCache is enabled
    if (useCache) {
      const cachedData = await getCachedDataByKey(cacheType, storageKey);
      if (cachedData) {
        return {
          success: true,
          data: cachedData,
          message: messages.success || 'Data retrieved from cache.',
        };
      }
    }

    // Retrieve the user token from AsyncStorage for authorization
    const cacheType = CacheTypes.AUTH_CACHE;
    const cacheKey = CacheKeys.LOGIN_DATA;

    const userData = await getCachedDataByKey(cacheType, cacheKey);
    const token = userData.token.access
    
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    // Fetch data from the API
    const response = await apiService.get(url, {
      headers: { ...authHeaders, ...headers },
    });

    // Parse the API response
    const data = await response.json();

    // Check the API response status
    if (response.status === 200) {
      // Save the fetched data to cache if saveToCache is enabled
      if (saveToCache) {
        await setCachedDataByKey(cacheType, storageKey, data);
      }
      return {
        success: true,
        data,
        message: messages.success || 'Data retrieved successfully.',
      };
    } else {
      return {
        success: false,
        message: messages.error || 'Failed to fetch data from API.',
      };
    }
  } catch (error: any) {
    // Handle errors during the fetch operation
    console.error(error);
    return {
      success: false,
      message: error.message || 'An error occurred while fetching data.',
    };
  }
};
