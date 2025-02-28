import { getCachedDataByKey, setCachedDataByKey } from "@/src/routes/cache";
import { mockChats } from "../mockChatsData";
import { UserData } from "./chatInterfaces";
import { CacheKeys, CacheTypes } from "@/src/routes/cacheKeys";


const cacheType = CacheTypes.REGISTERED_CONTACTS;
const cacheKey = CacheKeys.REGISTERED_CONTACTS_KEY;
const filterType = CacheTypes.FILTER_TYPE;
const filterKey = CacheKeys.FILTER_KEY;

const defaultFilters = [
  {id: 1, name: 'all', icon_name: 'list' },
  {id: 2, name: 'single', icon_name: 'user' },
  {id: 3, name: 'group', icon_name: 'users' },
  {id: 4, name: 'unread', icon_name: 'envelope-open' },
  {id: 5, name: 'favorite', icon_name: 'star' }
];

export const getFilters = async (): Promise<{ name: string; icon_name: string }[]> => {
  const storedFilters = await getCachedDataByKey(filterType, filterKey);
  const mergedFilters = Array.isArray(storedFilters)
    ? Array.from(new Map([...defaultFilters, ...storedFilters].map(filter => [filter.name, filter])).values())
    : defaultFilters;

  await setCachedDataByKey(filterType, filterKey, mergedFilters);

  return mergedFilters;
};

export const addFilter = async (name: string, icon_name: string, selectedUsers: UserData[]) => {  
  

  if (!name.trim()) {
    console.warn("Filter name must not be empty");
    return;
  }

  const allUsers = await mockChats();

  if (selectedUsers.length < 1) {
    console.warn("You need at least one user");
    return;
  }

  // Ensure selected users exist in allUsers
  const validUsers = selectedUsers.filter(user =>
    allUsers.some((allUser: { id: any }) => allUser.id === user.id)
  );

  if (validUsers.length === 0) {
    console.warn("Selected users are either not valid");
    return;
  }

  // Retrieve existing filters
  const existingFilters = (await getCachedDataByKey(filterType, filterKey)) || [];

  // Ensure we do not overwrite existing filters, but append new ones
  const newFilter = { 
    id: Math.floor(Math.random() * 1000000), // Generate a random number as ID
    name, 
    icon_name 
  };
  
  const filterExists = existingFilters.some((filter: { name: string }) => filter.name === name);

  if (!filterExists) {
    const updatedFilters = [...existingFilters, newFilter];
    await setCachedDataByKey(filterType, filterKey, updatedFilters);
    console.log("New filter added:", newFilter);
  } else {
    console.log("Filter already exists:", name);
  }

  // Update allUsers by adding the filter name to the type array of selected users (if not already present)
  const updatedUsers = allUsers.map((user: UserData) => {
    if (validUsers.some(validUser => validUser.id === user.id)) {
      return {
        ...user,
        type: Array.isArray(user.type) 
          ? user.type.includes(name) ? user.type : [...user.type, name] 
          : typeof user.type === "string" ? [user.type, name] : [name] 
      };
    }
    return user;
  });

  // Save updated users back
  await setCachedDataByKey(cacheType, cacheKey, updatedUsers);
  console.log("Updated users with new filter:", updatedUsers);
};



export const deleteFilter = async (filterName: string) => {
  if (!filterName.trim()) {
    console.warn("Filter name must not be empty");
    return;
  }

  const existingFilters = (await getCachedDataByKey(filterType, filterKey)) || [];

  // Check if filter exists
  if (!existingFilters.some((filter: { name: string }) => filter.name === filterName)) {
    console.warn("Filter not found");
    return;
  }

  // Remove the filter from the list
  const updatedFilters = existingFilters.filter((filter: { name: string }) => filter.name !== filterName);
  await setCachedDataByKey(filterType, filterKey, updatedFilters);

  // Remove filter from users' type arrays
  const allUsers = await mockChats();
  const updatedUsers = allUsers.map((user: UserData) => {
    if (Array.isArray(user.type)) {
      return { ...user, type: user.type.filter(type => type !== filterName) };
    }
    return user;
  });

  // Save updated users back
  const cacheType = CacheTypes.REGISTERED_CONTACTS;
  const cacheKey = CacheKeys.REGISTERED_CONTACTS_KEY;
  await setCachedDataByKey(cacheType, cacheKey, updatedUsers);

  console.log("Deleted filter:", filterName);
  console.log("Updated filters list:", updatedFilters);
  console.log("Updated users after filter deletion:", updatedUsers);
};
