import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useColorScheme,
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
import { getCachedDataByKey } from '@/src/routes/cache';
import { CacheKeys, CacheTypes } from '@/src/routes/cacheKeys';

const filterType = CacheTypes.FILTER_TYPE;
const filterKey = CacheKeys.FILTER_KEY;
const cacheType = CacheTypes.REGISTERED_CONTACTS;
const cacheKey = CacheKeys.REGISTERED_CONTACTS_KEY;

interface AddUsersProps {
  visible: boolean;
  onClose: () => void;
  OldFilterName: string | null;
  filterName: string;
  selectedIcon: string;
  onFilterUpdate: () => void;
  setRefresh: (value: boolean) => void;
}

const AddUsers: React.FC<AddUsersProps> = ({ visible, onClose, OldFilterName, filterName, selectedIcon, onFilterUpdate, setRefresh }) => {
  const [chats, setChats] = useState<UserData[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserData[]>([]);
  const [searchText, setSearchText] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [filterId, setFilterId] = useState<Number | null>(null);
  const colorScheme = useColorScheme();

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

  useEffect(() => {
    const loadFilterData = async () => {
      const existingUsers = (await getCachedDataByKey(cacheType, cacheKey)) || [];
      const existingFilter = (await getCachedDataByKey(filterType, filterKey)) || [];
  
      // Ensure filterName is present in the user.type array
      const filteredUsers = existingUsers.filter((user: { type: string[] }) =>
        OldFilterName !== null && user.type.includes(OldFilterName) // Ensure OldFilterName is a non-null string
      );
  
      // Find the filter that matches OldFilterName
      const filteredFilters = existingFilter.filter((filter: { name: string }) => filter.name === OldFilterName);
  
      // Safely set the filter ID if the filter exists
      if (filteredFilters.length > 0) {
        setFilterId(filteredFilters[0].id);
      }
  
      // Set selected users based on the filtered users
      if (filteredUsers.length > 0) {
        setSelectedUsers(filteredUsers);
      } else {
        setSelectedUsers([]); // Reset if no users are found
      }
    };
  
    if (visible) {
      loadFilterData();
    }
  }, [visible, OldFilterName]); // Add OldFilterName as a dependency so the effect re-runs when it changes
  

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
      setPopupMessage('Please select at least one user!');
      setTimeout(() => {
        setPopupMessage('');
      }, 2000);
    } else {
      console.log('Selected Users:', selectedUsers);
      if (filterId == null){
        await addFilter(filterId, filterName, selectedIcon, selectedUsers);
      }else{
        await addFilter(Number(filterId), filterName, selectedIcon, selectedUsers);
      }
      onFilterUpdate();
      setRefresh(true);
      onClose();
    }
  };

  // Filter users based on the search text
  const filteredChats = chats.filter((user) =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <ModalRightToLeft visible={visible} onClose={onClose} name="Add Users" headerContent={<Text style={[styles.modalTitle, { color: themeColors.textPrimary }]}>Add Users</Text>}>
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <SearchBarModel
          value={searchText}
          onSearch={setSearchText}
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
