import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useColorScheme,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import { Colors } from '@/constants/Colors';
import { mockChats } from '../mockChatsData';
import { styles } from './chatStyles';
import Archived from './Archived';
import { calculateAchievedUnreadCount, calculateUnreadCount, filterChats, sortChatsByLastMessageTime } from './chatUtils';
import { ChatsProps, UserData, userDataInit } from './chatInterfaces';
import ChatRoom from './ChatRoom';
import ChatRoom2 from './ChartRoom2';
import ListChats from './ListChats';
import AddContacts from './AddContacts';
import SearchBarModel from '@/models/searchBarModel';
import NavigationButtons from './NavigationButtons';
import { useRoute } from '@react-navigation/native';

const Chats: React.FC<ChatsProps> = ({ select, setSelectedValue, setSelect }) => {
  const scheme = useColorScheme();
  const currentColors = Colors[scheme ?? 'light'];

  const [showFilter, setShowFilter] = useState(false);
  const [lastOffset, setLastOffset] = useState(0);
  const [scrollAnim] = useState(new Animated.Value(1));
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewChart, setViewChart] = useState<number | null>(null);
  const [unreadArchived, setUnreadArchived] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [ChatRoomModalVisible, setChatRoomModalVisible] = useState(false);
  const [ChatRoomVisible, setChatRoomVisible] = useState(false);
  const [singleUserData, setSingleUserData] = useState<UserData>(userDataInit);
  const [selectedChats, setSelectedChats] = useState<number[]>([]);
  const [isArchived, setIsArchived] = useState(false);
  const [addContacts, setAddContacts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const route = useRoute();
  
  // State for storing chats
  const [chats, setChats] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);  // Loading state
  
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  useEffect(() => {
    // Fetch chats from mockChats
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
    
    fetchChats();
  }, []);

  const sortedChats = sortChatsByLastMessageTime(chats);
  const filteredChats = filterChats(sortedChats, activeFilter, isArchived, searchQuery);  // Pass searchQuery

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
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
            zIndex: 1,
          }}
        >
          {/* Display titles based on screen width */}
          {isTablet ? (
            <ScrollView showsHorizontalScrollIndicator={false}>
              <View>
                <View style={styles.achieveSection}>
                  <TouchableOpacity onPress={() => setIsArchived((prev) => !prev)} style={[styles.achieveButton, isArchived ? styles.activeSelectButton : '']}>
                    <Icon name="archive" size={15} color={isArchived ? 'white' : currentColors.textPrimary} solid={false} />
                    <Text style={[styles.archivedText, { color: currentColors.coloredText }]}>{unreadArchived}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.filterSection}>
                  <View style={{ flexDirection: 'column', flexWrap: 'wrap' }}>
                    {['all', 'single', 'group', 'unread', 'favorite'].map((filter) => (
                      <TouchableOpacity
                        key={filter}
                        style={[{ marginVertical: 4, padding: 10, borderRadius: 5 }, activeFilter === filter && styles.activeFilterButton]}
                        onPress={() => setActiveFilter(filter)}
                      >
                        <Icon
                          name={filter === 'all' ? 'list' : filter === 'single' ? 'user' : filter === 'group' ? 'users' : filter === 'unread' ? 'envelope' : 'star'}
                          size={15}
                          color={currentColors.textPrimary}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
              <View>
              <View style={{ flex: 1 }}>
                <NavigationButtons activeTab={route.name} />
              </View>
              </View>
              
            </ScrollView>
          ) : (
            <>
              <View style={styles.filterSection}>
                <Text style={[styles.filterText, { color: currentColors.textPrimary }]}>Filter</Text>
                <FlatList
                  horizontal
                  contentContainerStyle={styles.filterButtons}
                  showsHorizontalScrollIndicator={false}
                  data={['all', 'single', 'group', 'unread', 'favorite']}
                  renderItem={({ item: filter }) => (
                    <TouchableOpacity key={filter} style={[styles.filterButton, activeFilter === filter && styles.activeFilterButton]} onPress={() => setActiveFilter(filter)}>
                      <Text style={[styles.filterButtonText, { color: currentColors.textPrimary }]}>{filter}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
              <View style={styles.achieveSection}>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.achieveButton}>
                  <Icon name="archive" size={20} color={currentColors.textPrimary} solid={false} />
                  <Text style={[styles.archivedText, { color: currentColors.textPrimary }]}>Archived</Text>
                  <Text style={[styles.archivedText, { color: currentColors.coloredText }]}>{unreadArchived}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
          {isTablet &&(
            <>
             <View style={styles.headerContainer1}>
              {/* Top Layer */}
              <View style={styles.topLayer}>
                {/* Chat Text */}
                <Text style={[styles.archivedText, { color: currentColors.textPrimary }]}>Chats</Text>
                

                <View style={styles.rightSection1}>
                  {/* Camera Icon */}
                  <TouchableOpacity style={{marginRight: 20}} onPress={() => {/* Handle camera action */}}>
                    <Icon name="camera" size={24} color="gray" />
                  </TouchableOpacity>

                  {/* Hamburger Icon */}
                  <TouchableOpacity onPress={() => {/* Handle hamburger menu */}}>
                    <Icon name="bars" size={24} color="gray" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Bottom Layer - Search Bar */}
              <View style={styles.centerSection1}>
                <SearchBarModel
                  value={searchQuery}
                  onSearch={(query) => {
                    setSearchQuery(query);  // Update search query state
                  }}
                />
              </View>
            </View>

              
            </>
           
            
          )}
          
          <FlatList
            data={filteredChats}
            renderItem={({ item }) => (
              <ListChats
                chats={[item]}
                select={select}
                setSelectedValue={setSelectedValue}
                setSelect={setSelect}
                selectedChats={selectedChats}
                setSelectedChats={setSelectedChats}
                setSingleUserData={setSingleUserData}
                viewChart={viewChart}
                setViewChart={setViewChart}
                setChatRoomModalVisible={setChatRoomModalVisible}
                setChatRoomVisible={setChatRoomVisible}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={handleScroll}
          />

          {isTablet && (
            <TouchableOpacity onPress={() => setAddContacts(true)} style={styles.addButton}>
              <Icon name="plus" size={20} color={currentColors.framButtonText} />
            </TouchableOpacity>
          )}
        </Animated.View>

        
      </View>

      {isTablet && (
          <View style={{ padding: 20, width: '69%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: isTablet ? currentColors.backgroundSecondary : 'transparent' }}>
            <ChatRoom2 userData={singleUserData} />
          </View>
        )}

      {!isTablet && (
        <TouchableOpacity onPress={() => setAddContacts(true)} style={styles.addButton}>
          <Icon name="plus" size={20} color={currentColors.framButtonText} />
        </TouchableOpacity>
      )}

      <AddContacts visible={addContacts} onClose={() => setAddContacts(false)} />

      <Archived visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
};

export default Chats;
