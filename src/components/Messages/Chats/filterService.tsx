// filterService.tsx

import { getCachedDataByKey, setCachedDataByKey } from "@/src/routes/cache";

const defaultFilters = [
  { name: 'all', icon_name: 'list' },
  { name: 'single', icon_name: 'user' },
  { name: 'group', icon_name: 'users' },
  { name: 'unread', icon_name: 'envelope-open' },
  { name: 'favorite', icon_name: 'star' }
];

export const getFilters = async (): Promise<{ name: string; icon_name: string }[]> => {
  const storedFilters = await getCachedDataByKey('filters', 'userFilters');

  const mergedFilters = Array.isArray(storedFilters)
    ? Array.from(new Map([...defaultFilters, ...storedFilters].map(filter => [filter.name, filter])).values())
    : defaultFilters;

  await setCachedDataByKey('filters', 'userFilters', mergedFilters);

  return mergedFilters;
};


export const addFilter = async (name: string, icon_name: string) => {
  if (!name.trim() || !icon_name.trim()) {
    console.warn("Filter name and icon must not be empty");
    return;
  }

  const existingFilters = await getCachedDataByKey('filters', 'userFilters') || [];
  
  // Check if filter already exists
  if (existingFilters.some((filter: { name: string }) => filter.name === name)) {
    console.warn("Filter with this name already exists");
    return;
  }
  const newFilter = { name, icon_name };
  const updatedFilters = [...existingFilters, newFilter];

  await setCachedDataByKey('filters', 'userFilters', updatedFilters);
};
