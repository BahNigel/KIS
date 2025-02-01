import moment from "moment";
import { UserData } from "./chatInterfaces";


// Utility function to filter chats
export const filterChats = (chats: UserData[], activeFilter: string, isArchived: boolean) => {
  const nonArchivedChats = chats.filter((chat) => isArchived? chat.archived : !chat.archived);
  switch (activeFilter) {
    case 'single':
      return nonArchivedChats.filter((chat) => chat.type === 'single');
    case 'group':
      return nonArchivedChats.filter((chat) => chat.type === 'group');
    case 'unread':
      return nonArchivedChats.filter((chat) => chat.unreadCount > 0);
    case 'favorite':
      return nonArchivedChats.filter((chat) => chat.favorite);
    default:
      return nonArchivedChats;
  }
};

// Utility function to calculate unread count
export const calculateUnreadCount = (chats: UserData[]) => {
  return chats.filter((chat) => !chat.archived && chat.unreadCount > 0).length;
};

// Utility function to calculate archived unread count
export const calculateAchievedUnreadCount = (chats: UserData[]) => {
  return chats.filter((chat) => chat.archived && chat.unreadCount > 0).length;
};


export const isValidUrl = (url: string) => {
    const regex = /^(http|https):\/\/[^ "]+$/;
    return regex.test(url);
};


export const sortChatsByLastMessageTime = (chats: UserData[]): UserData[] => {
    return [...chats].sort((a, b) => {
      const timeA = moment(`1970/01/01 ${a.lastMessageTime}`, 'YYYY/MM/DD hh:mm A');
      const timeB = moment(`1970/01/01 ${b.lastMessageTime}`, 'YYYY/MM/DD hh:mm A');
      return timeA.diff(timeB);
    });
  };