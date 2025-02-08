import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { mockChats } from '../mockChatsData';
import { calculateUnreadCount } from './chatUtils';
import { StackNavigationProp } from '@react-navigation/stack';

// Colors object
const tintColorLight = '#2B4FA7';
const tintColorDark = '#001A3D';

export type RootStackParamList = {
    Messages: { screen: string }; // Define the parameter for 'Messages' screen
    // Add other screens and their parameters here if needed
  };

export const Colors = {
  light: {
    background: '#F7FAFC',
    buttonBackground: '#E2E8F0',
    activeButton: tintColorLight,
    iconColor: '#1A202C',
    activeIconColor: '#FFFFFF',
    badgeColor: '#FF3B30',
    badgeTextColor: '#FFFFFF',
  },
  dark: {
    background: '#1A202C',
    buttonBackground: '#2D3748',
    activeButton: tintColorDark,
    iconColor: '#FFFFFF',
    activeIconColor: '#FFFFFF',
    badgeColor: '#FF453A',
    badgeTextColor: '#FFFFFF',
  },
};

// Mapping tabs to icons
const tabIcons: Record<string, string> = {
  Chats: 'chatbubble-ellipses-outline',
  Status: 'ellipse-outline',
  Channels: 'people-outline',
  Calls: 'call-outline',
};

const tabOptions = Object.keys(tabIcons);

interface NavigationButtonsProps {
  activeTab: string; // Receives the current tab name as a prop
}

export default function NavigationButtons({ activeTab }: NavigationButtonsProps) {
  // Type the navigation hook with the correct types
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Messages'>>();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const [newCount, setNewCount] = useState(0);
  const [notifications, setNotifications] = useState({
    chats: newCount,
    status: 3,
    channels: 2,
    calls: 4,
  });

  // Effect to fetch unread count from mockChats asynchronously
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const chats = await mockChats(); // Fetch mock chat data
        const unreadCount = calculateUnreadCount(chats); // Calculate unread count
        setNewCount(unreadCount); // Update the unread count
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount(); // Call the async function
  }, []); // Runs once when the component mounts

  // Update notifications when newCount changes
  useEffect(() => {
    setNotifications((prev) => ({
      ...prev,
      chats: newCount,
    }));
  }, [newCount]); // Dependency array includes newCount

  const navigateToTab = (tabName: string) => {
    navigation.navigate('Messages', { screen: tabName });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {tabOptions.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.button,
            { backgroundColor: activeTab === tab ? theme.activeButton : theme.buttonBackground },
          ]}
          onPress={() => navigateToTab(tab)}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name={tabIcons[tab]}
              size={15}
              color={activeTab === tab ? theme.activeIconColor : theme.iconColor}
            />
            {notifications[tab as keyof typeof notifications] > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.badgeColor }]}>
                <Text style={[styles.badgeText, { color: theme.badgeTextColor }]}>
                  {notifications[tab as keyof typeof notifications] > 99
                    ? '99+'
                    : notifications[tab as keyof typeof notifications]}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 20,
  },
  button: {
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  iconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});
