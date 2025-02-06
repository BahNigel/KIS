import moment from "moment";
import { UserData } from "./chatInterfaces";


// Utility function to filter chats
export const filterChats = (chats: UserData[], activeFilter: string, isArchived: boolean, query: string = '') => {
  // First filter by archived status
  const nonArchivedChats = chats.filter((chat) => isArchived ? chat.archived : !chat.archived);

  // Apply search filter if query is provided
  const searchFilteredChats = query
    ? nonArchivedChats.filter((chat) =>
        chat.name.toLowerCase().includes(query.toLowerCase()) || chat.lastMessage.toLowerCase().includes(query.toLowerCase())
      )
    : nonArchivedChats;

  // Apply other filters based on activeFilter
  switch (activeFilter) {
    case 'single':
      return searchFilteredChats.filter((chat) => chat.type === 'single');
    case 'group':
      return searchFilteredChats.filter((chat) => chat.type === 'group');
    case 'unread':
      return searchFilteredChats.filter((chat) => chat.unreadCount > 0);
    case 'favorite':
      return searchFilteredChats.filter((chat) => chat.favorite);
    default:
      return searchFilteredChats;
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






export  const handleSearch = (setSearchQuery: (arg0: string) => void, chats: any[], setFilteredChats: (arg0: any) => void, query: string) => {
    setSearchQuery(query);
    const lowerQuery = query.toLowerCase();
  
    const filtered = chats.filter(
      (chat) =>
        chat.name.toLowerCase().includes(lowerQuery) ||
        (chat.contacts && chat.contacts.toLowerCase().includes(lowerQuery)) || // Check if contacts string includes query
        moment(chat.lastMessageTime, 'YYYY/MM/DD hh:mm A')
          .format('YYYY/MM/DD')
          .includes(lowerQuery)
    );
  
    setFilteredChats(filtered);
  };
  