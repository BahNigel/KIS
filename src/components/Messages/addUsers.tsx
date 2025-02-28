import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useColorScheme, // For detecting the theme mode
} from 'react-native';
import ModalRightToLeft from '@/models/ModalRightToLeft';
import { UserData } from './Chats/chatInterfaces';
import { mockChats } from './mockChatsData';
import { API_BASE_URL } from '@/src/routes';
import { Colors } from '@/constants/Colors';
import SearchBarModel from '@/models/searchBarModel';
import styles from './addUsersStyle';
import { addFilter } from './Chats/filterService';
import { useNavigation } from '@react-navigation/native';

interface AddUsersProps {
  visible: boolean;
  onClose: () => void;
  filterName: string; 
  selectedIcon: string;
  onFilterUpdate: () => void;
  setRefresh: (value: boolean) => void;
}

const AddUsers: React.FC<AddUsersProps> = ({ visible, onClose, filterName, selectedIcon, onFilterUpdate, setRefresh}) => {
  const [chats, setChats] = useState<UserData[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserData[]>([]);
  const [searchText, setSearchText] = useState(''); // State for the search input
  const [popupMessage, setPopupMessage] = useState(''); // State for the popup message
  const colorScheme = useColorScheme(); // Detect the current theme mode (light or dark)

  useEffect(() => {
    if (visible) {
      const fetchChats = async () => {
        try {
          const data = await mockChats();
          setChats(data);
        } catch (error) {
          console.error('Error fetching chats:', error);
        }
      };
      fetchChats();
    } else {
      setSelectedUsers([]);
    }
  }, [visible]);

  const handleSelectUser = (user: UserData) => {
    setSelectedUsers((prev) => {
      const isAlreadySelected = prev.some((u) => u.id === user.id);
      if (isAlreadySelected) {
        return prev.filter((u) => u.id !== user.id);
      }
      return [...prev, user];
    });
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleSubmit = async () => {
    if (selectedUsers.length === 0) {
      // Show popup message if no user is selected
      setPopupMessage('Please select at least one user!');
      
      // Hide the popup message after 5 seconds
      setTimeout(() => {
        setPopupMessage('');
      }, 2000);
    } else {
        console.log('Selected Users:', selectedUsers);
        await addFilter(filterName, selectedIcon, selectedUsers);
        onFilterUpdate();
        setRefresh(true);
        onClose();
      // Proceed with submission logic here
    }
  };

  // Filter users based on the search text
  const filteredChats = chats.filter((user) =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Get the appropriate colors based on the current theme
  const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <ModalRightToLeft visible={visible} onClose={onClose} name="Add Users" headerContent={<Text style={[styles.modalTitle, {color: themeColors.textPrimary}]}>Add Users</Text>}>
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        {/* Use SearchBarModel here */}
        <SearchBarModel
          value={searchText}
          onSearch={setSearchText} // Update searchText as the user types
          placeholder="Search Users"
        />

        {/* Popup message */}
        {popupMessage && (
          <View style={styles.popupContainer}>
            <Text style={styles.popupMessage}>{popupMessage}</Text>
          </View>
        )}

        {/* Selected Users List */}
        {selectedUsers.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectedUsersContainer}>
            {selectedUsers.map((user) => (
              <View key={user.id} style={styles.selectedUser}>
                <Image source={{ uri: user.image ? API_BASE_URL + user.image : 'default-image-url' }} style={styles.selectedUserImage} />
                <Text style={[styles.selectedUserName, { color: themeColors.textPrimary }]}>{user.name.slice(0, 10)}</Text>
                <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveUser(user.id)}>
                  <Text style={styles.removeButtonText}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Filtered User Selection List */}
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSelected = selectedUsers.some((u) => u.id === item.id);
            return (
              <TouchableOpacity
                style={[styles.userContainer]}
                onPress={() => handleSelectUser(item)}
              >
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item.image ? API_BASE_URL + item.image : 'default-image-url' }} style={styles.userImage} />
                  {isSelected && <View style={styles.tickOverlay}><Text style={styles.tickText}>✔</Text></View>}
                </View>
                <Text style={[styles.userName, { color: themeColors.textPrimary }]}>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
        />
        
        {/* Submit Button */}
        <TouchableOpacity style={[styles.submitButton, { backgroundColor: themeColors.openButtonBackground }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>✔</Text>
        </TouchableOpacity>
      </View>
    </ModalRightToLeft>
  );
};

export default AddUsers;
