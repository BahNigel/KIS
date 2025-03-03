import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Colors } from '@/constants/Colors';
import { mockChats } from '../mockChatsData';
import { styles } from './chatStyles';
import Archived from './Archived';
import { calculateAchievedUnreadCount, filterChats, handleScroll, sortChatsByLastMessageTime } from './chatUtils';
import { ChatsProps, UserData, userDataInit } from './chatInterfaces';
import ChatRoom from './ChatRoom';
import ChatRoom2 from './ChartRoom2';
import AddContacts from './AddContacts';
import { useRoute } from '@react-navigation/native';
import { getFilters } from './filterService';
import AddFilterScreen from './AddFilterScreen';
import FilterSection from './FilterSection';
import ChatsSection from './ChatsSection';
import AddUsers from '../addUsers';

const Chats: React.FC<ChatsProps> = ({ select, setSelectedValue, setSelect }) => {
  const scheme = useColorScheme();
  const currentColors = Colors[scheme ?? 'light'];

  const [scrollAnim] = useState(new Animated.Value(1));
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewChart, setViewChart] = useState<number | null>(null);
  const [unreadArchived, setUnreadArchived] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [ChatRoomModalVisible, setChatRoomModalVisible] = useState(false);
  const [ChatRoomVisible, setChatRoomVisible] = useState(false);
  const [singleUserData, setSingleUserData] = useState<UserData>(userDataInit);
  const [isArchived, setIsArchived] = useState(false);
  const [addContacts, setAddContacts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const route = useRoute();
  const [isModalAddFilterVisible, setModalAddFilterVisible] = useState(false);

  const [filters, setFilters] = useState<{ name: string; icon_name: string }[]>([]);

  // State for storing chats
  const [chats, setChats] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);  // Loading state
  const [refresh, setRefresh] = useState(false);  // New refresh state

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  useEffect(() => {
    const fetchFilters = async () => {
      const retrievedFilters = await getFilters();
      setFilters(retrievedFilters);
    };

    fetchFilters();
  }, []); // Runs once on mount

  const handleFilterUpdate = async () => {
    const updatedFilters = await getFilters();
    setFilters(updatedFilters); // Trigger re-render when filters change
  };

  // Function to fetch chats
  const fetchChats = async () => {
    try {
      const data = await mockChats();
      setChats(data);
      setUnreadArchived(calculateAchievedUnreadCount(data));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setLoading(false);
    }
  };
  

  // Trigger fetching chats whenever `refresh` state changes
  useEffect(() => {
    if (refresh) {
      setLoading(true);
      fetchChats();
      setRefresh(false); // Reset refresh state after fetching
      setModalAddFilterVisible(false);
    }
  }, [refresh]);

  useEffect(() => {
    fetchChats(); // Initial data fetch
  }, []);  // Runs once on mount

  const sortedChats = sortChatsByLastMessageTime(chats);
  const filteredChats = filterChats(sortedChats, activeFilter, isArchived, searchQuery);  // Pass searchQuery

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: currentColors.textPrimary }}>Loading chats...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }, {paddingHorizontal: isTablet ? 0: 15,}]}>
      <View style={{flexDirection: isTablet ? 'row' : 'column', width: isTablet ? '31%' : '100%', minWidth: 300, }}>
        <Animated.View
          style={{
            width: isTablet ? '13%' : 'auto',
            transform: !isTablet ? [{ translateY: scrollAnim.interpolate({ inputRange: [0, 1], outputRange: [-100, 0] }) }] : [],
            zIndex: 9,
          }}
        >
          {/* Display titles based on screen width */}
          <FilterSection 
            isTablet={isTablet} 
            setIsArchived={setIsArchived} 
            isArchived={isArchived} 
            currentColors={currentColors} 
            unreadArchived={unreadArchived} 
            filters={filters} 
            activeFilter={activeFilter} 
            setActiveFilter={setActiveFilter} 
            setModalAddFilterVisible={setModalAddFilterVisible} 
            route={route} 
            setModalVisible={setModalVisible} 
            onFilterUpdate={handleFilterUpdate}
            setRefresh={setRefresh}
          />
        </Animated.View>

        {/* Chats section */}
        <Animated.View
          style={{
            position: 'relative',
            borderTopLeftRadius: 10,
            backgroundColor: isTablet ? currentColors.backgroundSecondary : 'transparent',
            width: isTablet ? '87%' : 'auto',
            borderRightWidth: isTablet ? 0.5 : 0,
            transform: !isTablet ? [{ translateY: scrollAnim.interpolate({ inputRange: [0, 1], outputRange: [-100, 0] }) }] : [],
            zIndex: 1,
          }}
        >
          <ChatsSection 
            isTablet={isTablet}
            currentColors={currentColors} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            filteredChats={filteredChats} 
            select={select} 
            setSelectedValue={setSelectedValue} 
            setSelect={setSelect} 
            setAddContacts={setAddContacts} 
            setSingleUserData={setSingleUserData} 
            viewChart={viewChart} 
            setViewChart={setViewChart} 
            setChatRoomModalVisible={setChatRoomModalVisible} 
            setChatRoomVisible={setChatRoomVisible} 
            handleScroll={()=>handleScroll}
          />
        </Animated.View>
      </View>

      {isTablet && (
        <View style={{ padding: 20, width: '69%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: isTablet ? currentColors.backgroundSecondary : 'transparent' }}>
          <ChatRoom2 userData={singleUserData} />
        </View>
      )}

      {!isTablet && (
        <TouchableOpacity onPress={() => setAddContacts(true)} style={styles.addButton}>
          <Icon name="plus" size={15} color={currentColors.framButtonText} />
        </TouchableOpacity>
      )}

      <ChatRoom visible={ChatRoomVisible} onClose={()=>setChatRoomVisible(false)} userData={singleUserData}/>

      <AddContacts visible={addContacts} onClose={() => setAddContacts(false)} />

      <Archived visible={modalVisible} onClose={() => setModalVisible(false)} />

      <AddFilterScreen visible={isModalAddFilterVisible} 
            onFilterUpdate={handleFilterUpdate}  onClose={() => setModalAddFilterVisible(false) } 
            setRefresh={setRefresh}
      />
    </View>
  );
};

export default Chats;
