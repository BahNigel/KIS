// AddContacts.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, useColorScheme, Platform, TextInput, Button, ActivityIndicator, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Colors } from '@/constants/Colors'; // Import Colors
import moment from 'moment';
import ModalRightToLeft from '@/models/ModalRightToLeft';
import { isValidUrl } from './chatUtils';
import ChatRoom from './ChatRoom';
import { CacheKeys, CacheTypes } from '@/src/routes/cacheKeys';
import ROUTES, { API_BASE_URL } from '@/src/routes';
import { getCachedDataByKey } from '@/src/routes/cache';
import { styles } from './AddContactStyle';
import { fetchContacts, fetchWebContacts } from './AddContactsUtils';

interface ArchivedProps {
  visible: boolean;
  onClose: () => void;
}

interface ContactData {
  id: string;
  name: string;
  contact: string[]; // Assuming contact is an array of phone numbers
  image: string | null;
  about?: string; // Optional field for about description
}

interface ExtendedContactData extends ContactData {
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  type: string;  // e.g., 'single' or 'group'
  favorite: boolean;
}

const AddContacts: React.FC<ArchivedProps> = ({ visible, onClose }) => {
  const scheme = useColorScheme(); // Hook to detect the current color scheme (light or dark)
  const currentColors = Colors[scheme === 'dark' ? 'dark' : 'light']; // Dynamically select light or dark mode colors
  const [storedContacts, setStoredContacts] = useState<ExtendedContactData[]>([]); // New state for stored contacts
  const [nonStoredContacts, setNonStoredContacts] = useState<ExtendedContactData[]>([]); // New state for non-stored contacts
  const [ChatRoomVisible, setChatRoomVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [singleUserData, setSingleUserData] = useState<ExtendedContactData>({
    id: '',
    name: '',
    contact: [],
    image: null,
    lastMessage: '',
    lastMessageTime: '',
    unreadCount: 0,
    type: 'single',
    favorite: false,
  });
  const [phoneOrEmail, setPhoneOrEmail] = useState<string>(''); // State for web input
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search input
  const platform = Platform.OS;

  // Fetch contacts when modal is opened
  useEffect(() => {
    if (visible) {
      fetchContacts({
        setLoading,
        setStoredContacts: (contacts) => setStoredContacts(contacts),
        setNonStoredContacts: (contacts) => setNonStoredContacts(contacts),
      });
    }
  }, [visible]);

  useEffect(() => {
    fetchWebContacts({
      phoneOrEmail: "",
      setStoredContacts: (contacts) => setStoredContacts(contacts),
    });
  }, []);
  

  const handleSelectContact = (contact: ContactData) => {
    setSingleUserData({
      ...contact,
      lastMessage: 'Sample Message',
      lastMessageTime: moment().format('YYYY/MM/DD hh:mm A'),
      unreadCount: 0,
      type: 'single',
      favorite: false,
    });
    setChatRoomVisible(true);
  };

  const handleWebContactSubmit = () => {
    if (phoneOrEmail) {
      console.log('Submitted:', phoneOrEmail);
      fetchWebContacts({
        phoneOrEmail,
        setStoredContacts: (contacts) => setStoredContacts(contacts),
      });
    }
  };

  // Filter contacts based on the search query
  const filteredStoredContacts = storedContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (Array.isArray(contact.contact) && contact.contact.some(number => number.includes(searchQuery.replace(/[\s+-]/g, "")))),
  );

  const filteredNonStoredContacts = nonStoredContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (Array.isArray(contact.contact) && contact.contact.some(number => number.includes(searchQuery.replace(/[\s+-]/g, "")))),
  );

  return (
    <ModalRightToLeft visible={visible} onClose={onClose} name="Add Contacts" 
      headerContent={
        <View style={styles.header}>
          <Text style={[styles.modalTitle, { color: currentColors.textPrimary }]}>Add Contacts</Text>
          <TouchableOpacity onPress={() => fetchContacts({
            setLoading,
            setStoredContacts: (contacts) => setStoredContacts(contacts),
            setNonStoredContacts: (contacts) => setNonStoredContacts(contacts),
          })} style={styles.refreshButton}>
            <Icon name="refresh" size={15} color={currentColors.textPrimary} />
          </TouchableOpacity>
        </View>
      }
    >
      {platform === 'web' ? (
        <View style={styles.webInputContainer}>
          <TextInput
            style={[styles.inputField, { color: currentColors.textPrimary, backgroundColor: currentColors.inputBackground }]}
            placeholder="Enter phone number or email"
            value={phoneOrEmail}
            onChangeText={setPhoneOrEmail}
            placeholderTextColor={currentColors.textSecondary}
          />
          <Button title="Submit" onPress={handleWebContactSubmit} />
        </View>
      ) : (
        <View style={styles.searchContainer}>
          <View style={[styles.searchInputWrapper, { backgroundColor: currentColors.inputBackground }]}>
            <Icon name="search" size={15} color={currentColors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: currentColors.textPrimary }]}
              placeholder="Search contacts"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={currentColors.textSecondary}
            />
          </View>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color={currentColors.primary} />
      ) : (
        <>
          <ScrollView>
            {/* Stored Contacts */}
            {filteredStoredContacts.length > 0 && (
              <View>
                {filteredStoredContacts.map(contact => (
                  <TouchableOpacity key={contact.id} style={styles.chatItem1} onPress={() => handleSelectContact(contact)}>
                    {/* Display Profile Image */}
                    <Image
                      source={{ uri: contact.image ? API_BASE_URL + contact.image : 'default-image-url' }} // Use a default image URL if no profile image is found
                      style={styles.profileImage}
                    />
                    {/* Display Contact Name */}
                    <View style={{flexDirection: 'column'}}>
                      <Text style={[styles.chatName, { color: currentColors.textPrimary }]}>{contact.name}</Text>
                      <Text style={[styles.chatName, { color: currentColors.textSecondary }]}>{contact.about}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Separator */}
            {filteredStoredContacts.length > 0 && filteredNonStoredContacts.length > 0 && (
              <Text style={[ { color: currentColors.textSecondary }]}></Text>
            )}

            {/* Non-Registered Contacts */}
            {filteredNonStoredContacts.length > 0 && (
              <>
                <Text style={[ { color: currentColors.textPrimary }]}>Non-Registered Contacts</Text>
                <View>
                  {filteredNonStoredContacts.map(contact => (
                    <View key={contact.id} style={styles.chatItem}>
                      <Text style={[styles.chatName, { color: currentColors.textPrimary }]}>{contact.name}</Text>
                      <TouchableOpacity >
                        <Text style={[{ color: currentColors.primary }]}>Invite</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </>
            )}
          </ScrollView>
        </>
      )}

      <ChatRoom visible={ChatRoomVisible} onClose={() => setChatRoomVisible(false)} userData={singleUserData} />
    </ModalRightToLeft>
  );
};

export default AddContacts;
