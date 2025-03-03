import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Alert,
  TouchableOpacity,
  View,
  Text,
  useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import NetInfo from '@react-native-community/netinfo';

import Invite from '@/src/components/profile/invite';
import Help from '@/src/components/profile/help';
import Language from '@/src/components/profile/language';
import Chat from '@/src/components/profile/chats';
import Privacy from '@/src/components/profile/privacy';
import Account from '@/src/components/profile/account';
import Storage from '@/src/components/profile/storage';
import { Colors } from '@/constants/Colors'; // Import Colors
import EditProfile from '@/src/components/profile';
import { API_BASE_URL } from '@/src/routes';
import ProfileBody from './body';
import { defaultUserData, logedInUserData } from '@/src/components/Messages/Chats/chatInterfaces';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme(); // Detects device theme (light/dark)
  const theme = Colors[colorScheme ?? 'light']; // Get colors based on theme

  const [profil, setProfile] = useState(false);
  const [modals, setModals] = useState({
    account: false,
    privacy: false,
    chats: false,
    storage: false,
    language: false,
    help: false,
    invite: false,
  });

  const [userData, setUserData] = useState<logedInUserData>();
  const [isConnected, setIsConnected] = useState(true);

  const openEditProfile = () => setProfile(true);
  const closeEditProfile = () => setProfile(false);

  const openModal = (item: string) => setModals((prev) => ({ ...prev, [item]: true }));
  const closeModal = (item: string) => setModals((prev) => ({ ...prev, [item]: false }));

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const jsonObject = JSON.parse(token);
        await axios.get(`${API_BASE_URL}/user/logout/`, {
          headers: { Authorization: `Bearer ${jsonObject.access}` },
        });

        await AsyncStorage.multiRemove(['userToken', 'UserData']);
        Alert.alert('Logout', 'You have been logged out successfully');
      } else {
        Alert.alert('Logout', 'Token not found. Please login again.');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'An error occurred while logging out. Please try again.');
    }
  };

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const { access } = JSON.parse(token);
      const response = await fetch(`${API_BASE_URL}/user/user-info/`, {
        headers: { Authorization: `Bearer ${access}` },
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem('UserData', JSON.stringify(data));
        setUserData(data);
      } else {
        console.log('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isConnected) {
      fetchUserData();
      const interval = setInterval(fetchUserData, 60000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const renderModal = (modalKey: string) => {
    switch (modalKey) {
      case 'account':
        return <Account visible={modals.account} onClose={() => closeModal('account')} />;
      case 'privacy':
        return <Privacy visible={modals.privacy} onClose={() => closeModal('privacy')} />;
      case 'chats':
        return <Chat visible={modals.chats} onClose={() => closeModal('chats')} />;
      case 'storage':
        return <Storage visible={modals.storage} onClose={() => closeModal('storage')} />;
      case 'language':
        return <Language visible={modals.language} onClose={() => closeModal('language')} choice={undefined} />;
      case 'help':
        return <Help visible={modals.help} onClose={() => closeModal('help')} />;
      case 'invite':
        return <Invite visible={modals.invite} onClose={() => closeModal('invite')} />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.buttonBackground }]}>
      <View style={[styles.userImageContainer, { backgroundColor: theme.background }]}>
        <View style={styles.topbar} />
        <View style={styles.picTextContainer}>
          <View style={[styles.profilePicContain, { borderColor: theme.tint }]} ></View>
          <View style={styles.profileTextContain}>
            <View style={styles.profileNameContainer}>
              <Text style={[styles.title, { color: theme.text }]}>
                {userData?.name || 'User Name'}
              </Text>
              <Text style={[styles.smallText, { color: theme.textSecondary }]}>
                {userData?.status || 'I am on CC!'}
              </Text>
            </View>
            <View>
              <TouchableOpacity onPress={openEditProfile}>
                <FontAwesome name="edit" size={20} style={{ color: theme.text, marginBottom: 10}} />
              </TouchableOpacity>
              <TouchableOpacity onPress={openEditProfile}>
                <FontAwesome name="eye" size={20} style={{ color: theme.text}} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Pass User Data to ProfileBody */}
      <ProfileBody openModal={openModal} handleLogout={handleLogout} userData={userData || defaultUserData} />

      {Object.keys(modals).map((modalKey) => (
        <React.Fragment key={modalKey}>
          {renderModal(modalKey)}
        </React.Fragment>
      ))}


      <EditProfile visible={profil} onClose={closeEditProfile} />
    </View>
  );
}

// 🔹 Updated Styles to Use Dynamic Colors
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userImageContainer: {
    padding: 15,
    borderBottomLeftRadius: 60,
  },
  topbar: {
    height: 50,
  },
  picTextContainer: {
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profilePicContain: {
    width: "20%",
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
  },
  profileTextContain: {
    width: "80%",
    marginLeft: 10,
    justifyContent: "space-between",
    flexDirection: 'row',
  },
  profileNameContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  smallText: {
    fontSize: 14,
  },
});
