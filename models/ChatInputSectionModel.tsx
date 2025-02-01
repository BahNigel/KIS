import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Colors } from '@/constants/Colors';

interface Message {
  id: string;
  type: 'text' | 'video' | 'screen_record' | 'voice_note' | 'emoji' | 'sticker' | 'file';
  content: string; // URL for media or plain text for text messages
  sender: string; // Specify sender as 'me' for current user
}

interface ChatInputProps {
  setMessages: (messages: Message[]) => void;
  messages: Message[];
}

const ChatInputSectionModel: React.FC<ChatInputProps> = ({ setMessages, messages }) => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const [inputMessage, setInputMessage] = React.useState('');
  const { width } = Dimensions.get('window');
  const isTablet = width >= 768; // Adjust threshold for tablet size

  const handleSend = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'text', // Default to text
        content: inputMessage.trim(),
        sender: 'me',
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
    }
  };

  return (
    <View style={[styles.inputContainer, { backgroundColor: isTablet? currentColors.backgroundSecondary : 'transparent'}]}>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: currentColors.inputBackground, color: currentColors.inputText },
        ]}
        placeholder="Type a message"
        placeholderTextColor={currentColors.textSecondary}
        value={inputMessage}
        onChangeText={setInputMessage}
      />
      <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
        <Icon name="paper-plane" size={24} color={currentColors.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    borderRadius: 20,
    fontSize: 16,
    height: 40,
  },
  sendButton: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});

export default ChatInputSectionModel;
