import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, StyleSheet, useColorScheme, TextInput, TouchableOpacity, Animated, useWindowDimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import Calls from '@/src/components/Messages/Calls/Calls';
import Channels from '@/src/components/Messages/Channels/Channels';
import Chats from '@/src/components/Messages/Chats';
import Status from '@/src/components/Messages/Status/Status';
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import TabLabelProps from './indexInterface';
import styles from './indexStyles';
import { useNavigationState } from '@react-navigation/native';
import { calculateUnreadCount } from '@/src/components/Messages/Chats/chatUtils';
import { mockChats } from '@/src/components/Messages/mockChatsData';
import useDynamicStyles from './indexStyles';
import FilePickers from '@/models/FilePickers';

const Tab = createMaterialTopTabNavigator();

export default function MessagePage() {
  const colorScheme = useColorScheme(); // Get the current color scheme (light or dark)
  const currentColors = Colors[colorScheme || 'light']; // Default to 'light' if colorScheme is null
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const styles = useDynamicStyles();

  //for file picking only
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  //end file picking only

  const [notifications, setNotifications] = useState({
    chats: 0,
    status: 0,
    channels: 0,
    calls: 0,
  });

  const navigationState = useNavigationState((state) => state); // Access the navigation state

  useEffect(() => {
    setSelect(false)
  }, [navigationState]);

  const [select, setSelect] = useState(false); // State to toggle header
  const [selectedValue, setSelectedValue] = useState(0); // Numeric state for selected items
  const [newCount, setNewCount] = useState(0);

  const headerOpacity = useRef(new Animated.Value(1)).current; // Animation for header fade
  const tabScale = useRef(new Animated.Value(1)).current; // Animation for tab scale

  // Effect to fetch unread count from mockChats asynchronously
  useEffect(() => {
    const fetchUnreadCount = async () => {
      const chats = await mockChats(); // Fetch mock chat data
      const unreadCount = calculateUnreadCount(chats); // Calculate unread count
      setNewCount(unreadCount); // Update the unread count
    };

    fetchUnreadCount(); // Call the async function to fetch and update unread count
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  useEffect(() => {
    // Simulating API or WebSocket updates
    setNotifications({
      chats: newCount,
      status: 3,
      channels: 2,
      calls: 4,
    });
  }, [newCount]); // Dependency array now includes newCount to update notifications whenever it changes

  const toggleHeader = () => {
    Animated.timing(headerOpacity, {
      toValue: select ? 1 : 0, // Fade out if `select` is true
      duration: 100,
      useNativeDriver: true,
    }).start(() => setSelect((prev) => !prev));
  };

  const renderTabLabel = ({ label, notificationCount, focused }: TabLabelProps) => {
    Animated.timing(tabScale, {
      toValue: focused ? 1.1 : 1, // Scale up on focus
      duration: 100,
      useNativeDriver: true,
    }).start();

    return (
      <Animated.View
        style={[styles.tabLabelContainer, {
          backgroundColor: focused ? currentColors.tint : currentColors.inactiveButtonColor,
          transform: [{ scale: tabScale }],
        }]}
      >
        <Text style={[styles.tabLabelText, { color: focused ? 'white' : currentColors.tabIconDefault }]}>
          {label}
        </Text>
        {notificationCount > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>{notificationCount}</Text>
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <>
      {/* Header Section */}
      <Animated.View style={[styles.header, { backgroundColor: currentColors.background, opacity: headerOpacity }]}>
        {select ? (
          <View style={styles.selectedHeader}>
            <TouchableOpacity onPress={toggleHeader} style={styles.arrowContainer}>
              <FontAwesome name="arrow-left" size={15} color={currentColors.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.selectedText, { color: currentColors.textPrimary }]}>{selectedValue} selected</Text>
            <View style={styles.iconGroup}>
              <TouchableOpacity style={styles.iconButton}>
                <FontAwesome name="thumb-tack" size={15} color={currentColors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <FontAwesome name="bell-slash" size={15} color={currentColors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <FontAwesome name="archive" size={15} color={currentColors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <FontAwesome name="bars" size={15} color={currentColors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.upperHeader}>
              <Text style={[styles.headerText, { color: currentColors.textPrimary }]}>Kingdom Impact Social</Text>
              {!isTablet && (
                <View style={styles.iconsContainer}>
                  <TouchableOpacity style={styles.iconButton}>
                    <FontAwesome name="camera" size={15} color={currentColors.textPrimary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                        onLayout={(event) =>
                          setButtonPosition(event.nativeEvent.layout)
                        }
                        onPress={() => setModalVisible(!modalVisible)}
                        style={{
                          backgroundColor: "blue",
                          padding: 15,
                          borderRadius: 10,
                        }}
                      >
                    <FontAwesome name="bars" size={15} color={currentColors.textPrimary} />
                    
                  </TouchableOpacity>
                  {/* for file picking only */}
                  <FilePickers
                      visible={modalVisible}
                      onClose={() => setModalVisible(false)}
                      buttonPosition={buttonPosition}
                    />
                    {/* end for file picking only */}
                </View>
              )}
              
            </View>
            {!isTablet && (
              <View style={styles.lowerHeader}>
                <TextInput
                  style={[styles.searchInput, { backgroundColor: currentColors.inputBackground, color: currentColors.textPrimary }]}
                  placeholder="Search"
                  placeholderTextColor={currentColors.textSecondary}
                />
              </View>
            )}
            
          </View>
        )}
      </Animated.View>

      {/* Tab Navigation Section */}
      <View style={[styles.naveContainer, { backgroundColor: currentColors.background }]}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarLabelStyle: styles.tabBarLabelStyle,
            tabBarIndicatorStyle: styles.tabBarIndicatorStyle,
            tabBarActiveTintColor: currentColors.textPrimary,
            tabBarInactiveTintColor: currentColors.tabIconDefault,
            tabBarStyle: styles.tabBarStyle,
            tabBarItemStyle: styles.tabBarItemStyle,
          })}
        >
          <Tab.Screen
            name="Chats"
            options={{
              tabBarLabel: ({ focused }) =>
                renderTabLabel({ label: 'Chats', notificationCount: notifications.chats, focused }),
            }}
          >
            {(props) => (
              <Chats
                {...props}
                select={select}
                setSelectedValue={setSelectedValue}
                setSelect={setSelect}
              />
            )}
          </Tab.Screen>

          <Tab.Screen
            name="Status"
            component={Status}
            options={{
              tabBarLabel: ({ focused }) =>
                renderTabLabel({ label: 'Status', notificationCount: notifications.status, focused }),
            }}
          />
          <Tab.Screen
            name="Channels"
            component={Channels}
            options={{
              tabBarLabel: ({ focused }) =>
                renderTabLabel({ label: 'Channels', notificationCount: notifications.channels, focused }),
            }}
          />
          <Tab.Screen
            name="Calls"
            component={Calls}
            options={{
              tabBarLabel: ({ focused }) =>
                renderTabLabel({ label: 'Calls', notificationCount: notifications.calls, focused }),
            }}
          />
        </Tab.Navigator>
        
      </View>
    </>
  );
}
