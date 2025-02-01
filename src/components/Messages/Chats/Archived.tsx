import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Colors } from '@/constants/Colors';
import { mockChats } from '../mockChatsData'; // Assuming this is a function returning a Promise
import moment from 'moment';
import ModalRightToLeft from '@/models/ModalRightToLeft';
import ChatRoom from './ChatRoom';
import { isValidUrl, sortChatsByLastMessageTime } from './chatUtils';
import { API_BASE_URL } from '@/src/routes';
import { UserData } from './chatInterfaces';

interface ArchivedProps {
  visible: boolean;
  onClose: () => void;
}

const Archived: React.FC<ArchivedProps> = ({ visible, onClose }) => {
  const scheme = useColorScheme(); // Detect the current color scheme (light or dark)
  const currentColors = Colors[scheme === 'dark' ? 'dark' : 'light']; // Use appropriate colors based on the scheme
  const [ChatRoomVisible, setChatRoomVisible] = useState(false); // State for modal visibility
  const [archivedChats, setArchivedChats] = useState<UserData[]>([]); // State to hold the archived chats

  const [singleUserData, setSingleUserData] = useState<UserData>({
    id: '',
    name: '',
    lastMessage: '',
    image: null,
    lastMessageTime: '',
    unreadCount: 0,
    type: 'single',
    favorite: false,
    archived: false,
  });

  useEffect(() => {
    // Fetch the mockChats data asynchronously if it's a promise
    const fetchMockChats = async () => {
      try {
        const chats = await mockChats(); // Assuming mockChats returns a Promise of data
        const sortedChats = sortChatsByLastMessageTime(chats);
        const archivedChatsData = sortedChats.filter((chat) => chat.archived);
        setArchivedChats(archivedChatsData);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchMockChats();
  }, []); // Only run on initial mount

  const handleScroll = () => {
    // Scroll handling logic here, if needed
  };

  const isValid = (image: string) => isValidUrl(image);

  return (
    <ModalRightToLeft visible={visible} onClose={onClose} name="Archived Chats" headerContent={<Text style={[styles.modalTitle, { color: currentColors.textPrimary }]}>Archived Chats</Text>}>
      
      {/* Archiving Information */}
      <View>
        <Text style={[styles.archivingText, { color: currentColors.textSecondary }]}>
          Archiving chats allows you to keep your conversations organized while preventing new notifications for incoming messages. It’s perfect for chats you don’t need to actively monitor but still want to keep for reference.
        </Text>
      </View>

      <FlatList
        data={archivedChats}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chatItem]}
            onPress={() => {
              setSingleUserData(item); // Correctly set singleUserData
              setChatRoomVisible(true);
            }}
          >
            <View style={styles.profileImageWrapper}>
              {item.image ? (
                isValid(API_BASE_URL+item.image) ? (
                  <Image
                    source={{ uri: item.image }}  // Use uri for valid URLs
                    style={styles.profileImage}
                  />
                ) : (
                  <Icon name="users" size={25} color={currentColors.icon} />
                )
              ) : (
                <Icon name="users" size={25} color={currentColors.icon} />
              )}
            </View>

            <View style={styles.chatContent}>
              <Text style={[styles.chatName, { color: currentColors.textPrimary }]}>{item.name}</Text>
              <Text style={[{ color: currentColors.textSecondary }]}>{item.lastMessage}</Text>
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
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      <ChatRoom
        visible={ChatRoomVisible}
        onClose={() => setChatRoomVisible(false)}
        userData={singleUserData}  // Pass correct user data to the ChatRoom
      />
    </ModalRightToLeft>
  );
};

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginTop: 15,
  },
  profileImageWrapper: {
    marginRight: 15,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  chatContent: {
    flex: 1,
  },
  chatName: {
    fontWeight: 'bold',
  },
  chatDetails: {
    alignItems: 'flex-end',
  },
  chatTime: {
    fontSize: 12,
  },
  unreadCount: {
    marginTop: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  unreadCountText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  archivingText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default Archived;
