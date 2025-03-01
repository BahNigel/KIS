import { getCachedDataByKey, setCachedDataByKey } from "@/src/routes/cache";
import { mockChats } from "../mockChatsData";
import { UserData } from "./chatInterfaces";
import { CacheKeys, CacheTypes } from "@/src/routes/cacheKeys";


const cacheType = CacheTypes.REGISTERED_CONTACTS;
const cacheKey = CacheKeys.REGISTERED_CONTACTS_KEY;
const filterType = CacheTypes.FILTER_TYPE;
const filterKey = CacheKeys.FILTER_KEY;

const defaultFilters = [
  { id: 1, name: 'all', icon_name: 'list' },
  { id: 2, name: 'single', icon_name: 'user' },
  { id: 3, name: 'group', icon_name: 'users' },
  { id: 4, name: 'unread', icon_name: 'envelope-open' },
  { id: 5, name: 'favorite', icon_name: 'star' }
];

export const getFilters = async (): Promise<{ name: string; icon_name: string }[]> => {
  const storedFilters = await getCachedDataByKey(filterType, filterKey);
  let filters = Array.isArray(storedFilters) ? [...storedFilters] : [];

  // Rearrange filters to ensure "all" filter is at the beginning and default filters follow
  filters = sortFilters(filters);

  // Ensure default filters exist in the stored filters
  for (const defaultFilter of defaultFilters) {
    const filterExists = filters.some(filter => filter.id === defaultFilter.id);
    if (!filterExists) {
      filters.unshift(defaultFilter); // Add default filter at the beginning
    }
  }

  // Re-sort filters after potential additions
  filters = sortFilters(filters);

  // Save updated filters
  await setCachedDataByKey(filterType, filterKey, filters);

  // Retrieve users' cached data
  const users = await getCachedDataByKey(cacheType, cacheKey);
  if (Array.isArray(users)) {
    const filterNames = filters.map(filter => filter.name);

    // Update users by removing invalid filter names from their `type` array
    const updatedUsers = users.map(user => ({
      ...user,
      type: Array.isArray(user.type)
        ? user.type.filter((typeName: string) => filterNames.includes(typeName))
        : user.type
    }));

    // Save updated users back to cache
    await setCachedDataByKey(cacheType, cacheKey, updatedUsers);
  }

  return filters;
};


// Helper function to sort filters ensuring "all" comes first and then default filters
const sortFilters = (filters: { id: number; name: string; icon_name: string }[]) => {
  return filters.sort((a, b) => {
    if (a.id === 1) return -1; // Ensure the "all" filter comes first based on ID (1 is for "all")
    if (b.id === 1) return 1;

    // Sort by ID in ascending order for the rest of the filters
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
};




export const addFilter = async (id: number | null, name: string, icon_name: string, selectedUsers: UserData[]) => {  

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

  if (id === null) {
    // If no ID is provided, generate a new random ID and add the filter
    const newFilter = {  id: Math.floor(Math.random() * 1000000), name: name, icon_name: icon_name };
    const filterExists = existingFilters.some((filter: { name: string }) => filter.name === name);

    if (!filterExists) {
      const updatedFilters = [...existingFilters, newFilter];
      await setCachedDataByKey(filterType, filterKey, updatedFilters);
      console.log("New filter added:", newFilter);
    } else {
      console.log("Filter already exists:", name);
    }
  } else {
    // If an ID is provided, keep the ID intact and update the filter
    const existingFilter = { id, name, icon_name };
    const filterIdExists = existingFilters.some((filter: { id: number }) => filter.id === id);

    if (filterIdExists) {
      const updatedFilters = existingFilters.map((filter: { id: number }) =>
        filter.id === id ? { ...filter, name, icon_name } : filter
      );
      await setCachedDataByKey(filterType, filterKey, updatedFilters);
      console.log("Filter updated:", existingFilter);
    } else {
      console.log("Filter with this ID does not exist:", id);
    }
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




export const deleteFilter = async (filterName: string | null) => {
  console.log("999999999999999999999999999999999999999999999999999999999999999999999: ", filterName)
  if (filterName != null && !filterName.trim()) {
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
