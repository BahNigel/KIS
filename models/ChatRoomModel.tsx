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
import { io } from 'socket.io-client';  // ✅ Import Socket.IO client
import { Colors } from '@/constants/Colors';
import ChatInputSectionModel from './ChatInputSectionModel'; // Adjust the path as needed
import { WEBSOCKET_URL } from '@/src/routes';

const ChatRoomModal: React.FC = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const { width } = Dimensions.get('window');
  const isTablet = width >= 768; // Adjust threshold for tablet size

  const [messages, setMessages] = useState<any[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    // ✅ Initialize Socket.IO connection
    socketRef.current = io(WEBSOCKET_URL, {
      transports: ['websocket'], // Force WebSocket transport
    });

    socketRef.current.on('connect', () => {
      console.log('✅ Socket.IO connected');
    });

    // ✅ Get chat history on connection
    socketRef.current.on('chatHistory', (history: React.SetStateAction<any[]>) => {
      setMessages(history);
    });

    // ✅ Listen for new messages
    socketRef.current.on('message', (receivedMessage: any) => {
      console.log('📩 Received:', receivedMessage);
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ Socket.IO disconnected');
    });

    return () => {
      socketRef.current.disconnect(); // Cleanup on unmount
    };
  }, []);

  const handleSendMessage = (newMessage: any) => {
    if (socketRef.current) {
      console.log('📤 Sending:', newMessage);
      socketRef.current.emit('message', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
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
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
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

      <ChatInputSectionModel onSendMessage={handleSendMessage} />
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
