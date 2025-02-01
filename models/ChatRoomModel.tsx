import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import ChatInputSectionModel from './ChatInputSectionModel'; // Adjust the path as needed
import { ChatRoomModalProps } from '@/src/components/Messages/Chats/chatInterfaces';
import { getCachedDataByKey } from '@/src/routes/cache';
import { CacheKeys, CacheTypes } from '@/src/routes/cacheKeys';

const ChatRoomModal: React.FC<ChatRoomModalProps> = ({ userData }) => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const cacheType = CacheTypes.AUTH_CACHE;
  const cacheKey = CacheKeys.LOGIN_DATA;

  const [messages, setMessages] = useState<any[]>([]); // A flat array of messages
  const { width } = Dimensions.get('window');
  const isTablet = width >= 768; // Adjust threshold for tablet size

  // Reference to the FlatList to scroll to the bottom when messages are updated
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Scroll to the bottom whenever messages are updated
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = async (newMessage: any) => {
    try {
      // Await for the user data from cache
      const userData = await getCachedDataByKey(cacheType, cacheKey);
      console.log("userData: ", userData);

      // Add the new message to the message state
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    } catch (error) {
      console.error("Error fetching user data from cache: ", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.chatContainer,
        { backgroundColor: isTablet ? currentColors.backgroundSecondary : currentColors.background },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* {console.log("messages: ", messages)} */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()} // Fallback to random ID if no id
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              {
                backgroundColor:
                  item.sender === 'me'
                    ? currentColors.messageBackground
                    : currentColors.buttonBackground,
                alignSelf: item.sender === 'me' ? 'flex-end' : 'flex-start',
              },
            ]}
          >
            <Text style={[styles.messageText, { color: currentColors.messageText }]}>{item.content}</Text>
          </View>
        )}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
      />

      <ChatInputSectionModel
        setMessages={handleSendMessage}
        messages={messages}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  messageBubble: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '75%',
  },
  messageText: {
    fontSize: 16,
  },
});

export default ChatRoomModal;
