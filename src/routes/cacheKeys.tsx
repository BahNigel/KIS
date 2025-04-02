// cacheKeys.tsx

/**
 * Enum for Cache Types
 * These represent different cache directories to organize your cached data.
 */
export enum CacheTypes {
    DEFAULT = 'default',            // Default cache type
    USER_CACHE = 'user_cache',      // Cache related to user data
    MESSAGES_CACHE = 'messages_cache', // Cache related to messages
    AUTH_CACHE = 'auth13_cache',      // Cache related to authentication
    NOTIFICATIONS_CACHE = 'notifications_cache', // Cache for notifications
    MEDIA_CACHE = 'media_cache',    // Cache for media files (images, videos, etc.)
    REGISTERED_CONTACTS = 'registered_contacts',
    FILTER_TYPE = 'filters',
  }
  
  /**
   * Enum for Cache Keys
   * These represent specific cache keys that can be used to identify and store specific pieces of data.
   */
  export enum CacheKeys {
    LOGIN_DATA = 'login_data',                // Cache key for login-related data
    USER_PROFILE = 'user_profile',            // Cache key for user profile data
    USER_TOKEN = 'user_token',                // Cache key for storing user token
    MESSAGES_LIST = 'messages_list',          // Cache key for storing list of messages
    MESSAGE_DETAILS = 'message_details',      // Cache key for storing message details
    NOTIFICATIONS = 'notifications',          // Cache key for storing notifications
    MEDIA_IMAGES = 'media_images',            // Cache key for storing images in media cache
    MEDIA_VIDEOS = 'media_videos',            // Cache key for storing videos in media cache
    REGISTERED_CONTACTS_KEY = 'registered_contacts_key',
    FILTER_KEY = 'userFilters',
  }
  
  /**
   * Example of using cache keys with cache types for storing data
   * This is where you define which type of cache and which key to use for specific pieces of data.
   */
  export const CacheConfig = {
    loginData: {
      type: CacheTypes.AUTH_CACHE,
      key: CacheKeys.LOGIN_DATA,
    },
    userProfile: {
      type: CacheTypes.USER_CACHE,
      key: CacheKeys.USER_PROFILE,
    },
    userToken: {
      type: CacheTypes.AUTH_CACHE,
      key: CacheKeys.USER_TOKEN,
    },
    messagesList: {
      type: CacheTypes.MESSAGES_CACHE,
      key: CacheKeys.MESSAGES_LIST,
    },
    messageDetails: {
      type: CacheTypes.MESSAGES_CACHE,
      key: CacheKeys.MESSAGE_DETAILS,
    },
    notifications: {
      type: CacheTypes.NOTIFICATIONS_CACHE,
      key: CacheKeys.NOTIFICATIONS,
    },
    mediaImages: {
      type: CacheTypes.MEDIA_CACHE,
      key: CacheKeys.MEDIA_IMAGES,
    },
    mediaVideos: {
      type: CacheTypes.MEDIA_CACHE,
      key: CacheKeys.MEDIA_VIDEOS,
    },
  };
  
  export default CacheConfig;
  