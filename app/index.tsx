import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useFonts } from 'expo-font';
import { NavigationContainer, useNavigation } from '@react-navigation/native'; 
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import config from './config';
import Loader from './loader';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import CommunityScreen from './nav/community/index';
import MessageScreen from './nav/message/index';
import ProfileScreen from './nav/profile/index';
import BroadcastScreen from './nav/broadcast/index';
import Index from './auth'; // Import the Index component (login screen)
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { getCachedDataByKey } from '@/src/routes/cache';
import { CacheKeys, CacheTypes } from '@/src/routes/cacheKeys';

type TabBarVisibilityContextType = {
  isTabBarVisible: boolean;
  setIsTabBarVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TabBarVisibilityContext = createContext<TabBarVisibilityContextType | undefined>(undefined);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export function HomeTabs() {
  const context = useContext(TabBarVisibilityContext);
  if (!context) {
    throw new Error('useContext must be used within a TabBarVisibilityContext.Provider');
  }

  const { isTabBarVisible } = context;
  const colorScheme = useColorScheme();

  const activeTintColor = colorScheme === 'dark' ? Colors.dark.textPrimary : Colors.light.tint;
  const inactiveTintColor = colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.icon;
  const tabBarBackgroundColor = colorScheme === 'dark' ? Colors.dark.background : Colors.light.background;

  return (
    <Tab.Navigator
      initialRouteName="Messages" 
      screenOptions={{
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        tabBarStyle: {
          backgroundColor: tabBarBackgroundColor,
          display: isTabBarVisible ? 'flex' : 'none',
        },
      }}
    >
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessageScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles" size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Broadcast"
        component={BroadcastScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="megaphone" size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout() {
  const [loaded] = useFonts(config.fonts);
  const [isTabBarVisible, setIsTabBarVisible] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); 
  const colorScheme = useColorScheme();

  const cacheType = CacheTypes.AUTH_CACHE;
  const cacheKey = CacheKeys.LOGIN_DATA;

  const navigation = useNavigation(); 

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const tokenData = await getCachedDataByKey(cacheType, cacheKey);
        
        // Check if the token is present and valid
        if (tokenData && tokenData[0].token) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error fetching login status:", error);
        setIsLoggedIn(false); // Set logged-in status to false if an error occurs
      } finally {
        setIsLoading(false);
      }
    };
    
    checkLoginStatus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!loaded || isLoading) {
    return <Loader />;
  }

  const backgroundColor = colorScheme === 'dark' ? Colors.dark.background : Colors.light.background;

  // Show login page if not logged in, otherwise show HomeTabs
  if (!isLoggedIn) {
    return <Index setIsLoggedIn={setIsLoggedIn} navigation={navigation} />;
  }

  return (
    <>
      <TabBarVisibilityContext.Provider value={{ isTabBarVisible, setIsTabBarVisible }}>
        <HomeTabs />
        <StatusBar style="auto" backgroundColor={backgroundColor} />
      </TabBarVisibilityContext.Provider>
    </>
  );
}
