import moment from "moment";
import { HandleScrollParams, UserData } from "./chatInterfaces";
import { Animated } from "react-native";


// Utility function to filter chats
export const filterChats = (chats: UserData[], activeFilter: string, isArchived: boolean, query: string = '') => {
  // First, filter by archived status
  const filteredChats = chats.filter(chat => (isArchived ? chat.archived : !chat.archived));

  // Apply search filter if query is provided
  const searchFilteredChats = query
    ? filteredChats.filter(chat =>
        chat.name.toLowerCase().includes(query.toLowerCase()) ||
        (chat.lastMessage?.toLowerCase().includes(query.toLowerCase()) ?? false)
      )
    : filteredChats;

    // If "all" is selected, return everything after search filter
  if (!activeFilter || activeFilter === 'all') {
    return searchFilteredChats;
  }

  // Apply activeFilter
  if (activeFilter) {
    return searchFilteredChats.filter(chat => {
      switch (activeFilter) {
        case 'unread':
          return chat.unreadCount > 0;
        case 'favorite':
          return chat.favorite;
        default:
          return chat.type.includes(activeFilter); // Ensure chat.type is an array and check if it includes the filter
      }
    });
  }

  return searchFilteredChats;
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
  

export const handleScroll = ({
  event,
  lastOffset,
  showFilter,
  setShowFilter,
  scrollAnim,
  setLastOffset,
}: HandleScrollParams) => {
  const contentOffsetY = event.nativeEvent.contentOffset.y;
  if (contentOffsetY <= 0 && contentOffsetY < lastOffset) {
    if (!showFilter) {
      setShowFilter(true);
      Animated.timing(scrollAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  } else if (contentOffsetY > 0) {
    if (showFilter) {
      Animated.timing(scrollAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowFilter(false));
    }
  }
  setLastOffset(contentOffsetY);
};