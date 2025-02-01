import { getCachedDataByKey } from '@/src/routes/cache';
import { CacheKeys, CacheTypes } from '@/src/routes/cacheKeys';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getRandomTime = () => {
  const date = new Date();
  const hours = Math.floor(Math.random() * 12) + 1; // Random hours between 1 and 12
  const minutes = Math.floor(Math.random() * 60); // Random minutes between 0 and 59
  const ampm = Math.random() < 0.5 ? 'AM' : 'PM'; // Random AM or PM
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${formattedHours}:${formattedMinutes} ${ampm}`;
};

export const mockChats = async () => {
  try {
    const cacheType = CacheTypes.REGISTERED_CONTACTS;
    const cacheKey = CacheKeys.REGISTERED_CONTACTS_KEY;

    // Get the cached data
    const usersData = await getCachedDataByKey(cacheType, cacheKey);
    console.log("usersData:", usersData); // Debugging log

    // Check if usersData is a valid JSON string and parse it
    let users = [];
    if (usersData) {
      try {
        users = Array.isArray(usersData) ? usersData : JSON.parse(usersData) || [];
      } catch (parseError) {
        console.error("Error parsing usersData:", parseError);
        users = []; // Default to an empty array in case of parsing error
      }
    }

    // Return the users with mock chat data
    return users.map((user: { id: any; name: any; image: any; type: any; favorite: any; }) => ({
      id: user.id,
      name: user.name,
      lastMessage: 'Some mock message', // Replace with actual message logic if needed
      image: user.image || require('../../../assets/images/logo.png'),
      lastMessageTime: getRandomTime(),
      unreadCount: Math.floor(Math.random() * 5), // Random unread count
      type: user.type || 'single', // Assuming type is part of user data
      favorite: user.favorite || false, // Assuming favorite flag is part of user data
    }));
  } catch (error) {
    console.error('Error fetching users from storage:', error);
    return [];
  }
};
