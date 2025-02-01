import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  useColorScheme,
  useWindowDimensions,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import { Colors } from '@/constants/Colors';
import { styles } from './chatStyles';
import { isValidUrl } from './chatUtils';
import { UserData } from './chatInterfaces';
import { API_BASE_URL } from '@/src/routes';

interface ListChatsProps {
  chats: UserData[];  // Using `chats` instead of `filteredChats`
  select: boolean;
  setSelectedValue: (value: number) => void;
  setSelect: (value: boolean) => void;
  selectedChats: number[];
  setSelectedChats: React.Dispatch<React.SetStateAction<number[]>>;
  setSingleUserData: (data: UserData) => void;
  viewChart: number | null;
  setViewChart: (id: number | null) => void;
  setChatRoomModalVisible: (visible: boolean) => void;
  setChatRoomVisible: (visible: boolean) => void;
}

const ListChats: React.FC<ListChatsProps> = ({
  chats,  // Changed this to `chats`
  select,
  setSelectedValue,
  setSelect,
  selectedChats,
  setSelectedChats,
  setSingleUserData,
  viewChart,
  setViewChart,
  setChatRoomModalVisible,
  setChatRoomVisible,
}) => {
  const scheme = useColorScheme();
  const currentColors = Colors[scheme ?? 'light'];
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const isValid = (image: string) => isValidUrl(image);

  const handleLongPress = (chatId: number) => {
      if (!select) {
        setSelect(true); // Start selecting mode
      }
  
      // Mark chat as selected on long press
      setSelectedChats((prevSelectedChats) => {
        const updatedSelectedChats = [...prevSelectedChats];
        if (!updatedSelectedChats.includes(chatId)) {
          updatedSelectedChats.push(chatId);
        }
        setSelectedValue(updatedSelectedChats.length);
        console.log('Selected Chat IDs:', updatedSelectedChats); // Log selected chat IDs
        return updatedSelectedChats;
      });
    };
    
  useEffect(() => {
    if (!select) {
      setSelectedValue(0);
      setSelectedChats([]);
    }
  }, [select, setSelectedValue, setSelectedChats]);

  const handleChatPress = (chatId: number, chatData: any) => {
      if (select) {
        // If in selection mode, toggle selection
        setSelectedChats((prevSelectedChats) => {
          let updatedSelectedChats = [...prevSelectedChats];
          if (updatedSelectedChats.includes(chatId)) {
            updatedSelectedChats = updatedSelectedChats.filter((id) => id !== chatId);
          } else {
            updatedSelectedChats.push(chatId);
          }
          setSelectedValue(updatedSelectedChats.length);
          console.log('Selected Chat IDs:', updatedSelectedChats); // Log selected chat IDs
          return updatedSelectedChats;
        });
      } else {
        // If not in selection mode, proceed to chat room
        setSingleUserData(chatData);
        if(isTablet){
          setViewChart(chatId)
          setChatRoomModalVisible(true)
        }else{
         setChatRoomVisible(true); 
        }
      }
    };

  const renderChatItem = ({ item }: { item: UserData }) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.chatItem,
        selectedChats.includes(Number(item.id)) && styles.selectedChatItem,
        viewChart === Number(item.id) && styles.activeFilterButton,
      ]}
      onLongPress={() => handleLongPress(Number(item.id))}
      onPress={() => handleChatPress(Number(item.id), item)}
    >
      <View style={styles.profileImageWrapper}>
        {item.image ? (
          isValid(API_BASE_URL+item.image) ? (
            <Image source={{ uri: API_BASE_URL+item.image }} style={styles.profileImage} />
          ) : (
            <Icon name="users" size={25} color={currentColors.icon} />
          )
        ) : (
          <Icon name="users" size={25} color={currentColors.icon} />
        )}
      </View>
      <View style={styles.chatContent}>
        <Text style={[styles.chatName, { color: currentColors.textPrimary }]}>{item.name}</Text>
        <Text style={[styles.chatMessage, { color: currentColors.textSecondary }]}>{item.lastMessage}</Text>
      </View>
      <View style={styles.chatDetails}>
        <Text style={[styles.chatTime, { color: currentColors.messageTimestamp }]}>
          {moment(item.lastMessageTime, 'YYYY/MM/DD hh:mm A').format('hh:mm A')}
        </Text>
        {item.unreadCount > 0 && (
          <View style={[styles.unreadCount, { backgroundColor: currentColors.primary }]}>
            <Text style={styles.unreadCountText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={chats}  // Use `chats` instead of `filteredChats`
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderChatItem}
      contentContainerStyle={{ paddingBottom: 20 }}
      initialNumToRender={10} // To optimize initial rendering
      maxToRenderPerBatch={5}  // To limit the number of items rendered in each batch
      updateCellsBatchingPeriod={50}  // To optimize scrolling performance
    />
  );
};

export default ListChats;
