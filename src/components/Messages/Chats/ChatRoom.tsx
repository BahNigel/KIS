import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Colors } from '@/constants/Colors'; // Use the Colors file for theming
import ModalRightToLeft from '@/models/ModalRightToLeft';
import ChatRoomModal from '@/models/ChatRoomModel';
import { ChatRoomProps } from './chatInterfaces';
import { isValidUrl } from './chatUtils';
import { API_BASE_URL } from '@/src/routes';



const ChatRoom: React.FC<ChatRoomProps> = ({
  visible,
  onClose,
  userData,
}) => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const [inputMessage, setInputMessage] = React.useState('');
  const [messages, setMessages] = React.useState([
    { id: '1', text: userData.lastMessage, sender: userData.id },
  ]);

  const handleSend = () => {
    if (inputMessage.trim()) {
      setMessages([
        ...messages,
        { id: Date.now().toString(), text: inputMessage.trim(), sender: 'me' },
      ]);
      setInputMessage('');
    }
  };

  const isValid = (image: string) => isValidUrl(image);

  return (
    <ModalRightToLeft
      visible={visible}
      onClose={onClose}
      name="Chat Room"
      headerContent={
        <View style={styles.header}>
          {/* User avatar */}
          {userData.image ? (
            isValid(API_BASE_URL+userData.image) ? (
              <Image
                source={{ uri: API_BASE_URL+userData.image }}  // Use uri for valid URLs
                style={styles.avatar}
              />
            ) : (
              <Icon name="users" style={styles.avatar1} size={25} color={currentColors.icon} />
            )
          ) : (
            <Icon name="users" style={styles.avatar1} size={25} color={currentColors.icon} />
          )}
          {/* User info */}
          <View style={styles.userInfo}>
            {/* User name and status */}
            <View style={styles.mainUserInfo}>
            <Text style={[styles.userName, { color: currentColors.textPrimary }]} >
                {userData.name.split(' ').slice(0, 2).join(' ').slice(0, 20)}
            </Text>

                <View style={styles.statusContainer}>
                {/* Active Now Icon with text */}
                {userData.type === 'single' ? (
                    <View style={styles.statusRow}>
                    <Icon name="check-circle" size={16} color={currentColors.icon} />
                    <Text
                        style={[
                        styles.userStatus,
                        { color: currentColors.textSecondary },
                        ]}
                    >
                        {' Active now'}
                    </Text>
                    </View>
                ) : (
                    <Text
                    style={[
                        styles.userStatus,
                        { color: currentColors.textSecondary },
                    ]}
                    >
                    {`${userData.unreadCount} new messages`}
                    </Text>
                )}
                </View>
            </View>
            

            {/* Action buttons */}
            <View style={styles.actionButtonsContainer}>
                
                {/* Favorite icon */}
                <TouchableOpacity>
                    <Icon
                    name={userData.favorite ? 'star' : 'star-o'}
                    size={15}
                    color={currentColors.textSecondary}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Icon name="video-camera" size={15} color={currentColors.icon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Icon name="phone" size={15} color={currentColors.icon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Icon name="bars" size={15} color={currentColors.icon} />
                </TouchableOpacity>
            </View>
          </View>

        </View>
      }
    >

        <ChatRoomModal />
    </ModalRightToLeft>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  avatar1: {
    width: 40,
    height: 30,
    borderRadius: 20,
    marginRight: 1,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  mainUserInfo: {
    width: '53%'
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusContainer: {
    marginTop: 5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userStatus: {
    fontSize: 14,
    marginLeft: 2, // Adds space between the icon and the status text
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  actionButton: {
    padding: 8,
    marginHorizontal: 1,
    backgroundColor: 'transparent', // Optional for better touchable effect
  },
});

export default ChatRoom;
