import React, { useState, useRef } from 'react';
import { ScrollView, TouchableOpacity, View, Text, useColorScheme, Animated, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';  // Assuming Colors file is in the correct location
import Styles from '@/constants/Styles/profile';
import { logedInUserData } from '@/src/components/Messages/Chats/chatInterfaces';

interface profilBodyProps {
  openModal: (value: string) => void;
  handleLogout: () => void;
  userData: logedInUserData;
}

const ProfileBody: React.FC<profilBodyProps> = ({ openModal, handleLogout, userData }) => {
  const styles = Styles();
  const scheme = useColorScheme();  // Get the device's color scheme (light or dark)
  
  // Dynamically choose the colors based on the scheme (light or dark)
  const colors = scheme === 'dark' ? Colors.dark : Colors.light;

  const [scrollDirection, setScrollDirection] = useState('right');  // Default arrow direction is to the right
  const scrollViewRef = useRef<ScrollView>(null);  // Ref for the horizontal ScrollView

  // Handle the scroll event to update scroll position
  const handleScroll = (event: any) => {
    const contentWidth = event.nativeEvent.contentSize.width;
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    
    // Check if the user is at the left or right end
    if (contentOffsetX === 0) {
      setScrollDirection('right');
    } else if (contentOffsetX + event.nativeEvent.layoutMeasurement.width === contentWidth) {
      setScrollDirection('left');
    }
  };

  // Scroll to the end (right) or start (left) when clicking the arrow
  const scrollToEnd = () => {
    if (scrollDirection === 'right') {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } else {
      scrollViewRef.current?.scrollTo({ x: 0, animated: true });
    }
  };

  return (
    <ScrollView
      style={[styles.modalContent, { backgroundColor: colors.buttonBackground }]}  // Background color depending on theme
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      {/* New Section for Points and Space */}
      <View style={[styles.analysisSection, { backgroundColor: colors.buttonBackground }]}>
        {/* Scroll arrow */}
        <View style={[styles.arrowContainer, { left: scrollDirection === 'left' ? 10 : 'auto', right: scrollDirection === 'right' ? 10 : 'auto' }]}>
          <TouchableOpacity onPress={scrollToEnd}>
            <Ionicons
              name={scrollDirection === 'right' ? 'chevron-forward' : 'chevron-back'}
              size={30}
              color={colors.icon}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          ref={scrollViewRef}  // Assign ref to ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          onScroll={handleScroll}
          scrollEventThrottle={16} // Throttle scroll events for better performance
        >
          <TouchableOpacity style={styles.analysisBox}>
            <Text style={[styles.analysisText]}>Points</Text>
            <Text style={[styles.analysisValue]}>
              {Number(userData?.points) || 0}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.analysisBox}>
            <Text style={[styles.analysisText]}>Space</Text>
            <Text style={[styles.analysisValue]}>
              {Number(userData?.space) || 0}
            </Text>
          </TouchableOpacity>
          {/* Third item: Files */}
          <TouchableOpacity style={styles.analysisBox}>
            <Text style={[styles.analysisText]}>Files</Text>
            <Text style={[styles.analysisValue]}>
              {Number(userData?.files) || 0}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Other settings sections */}
      <TouchableOpacity onPress={() => openModal('account')} style={styles.settingItem}>
        <View style={styles.iconContainer}>
          <Ionicons name="key" size={20} color={colors.icon} style={[styles.title, { margin: 10, color: colors.textPrimary }]} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.mainSettingItemText, { color: colors.textPrimary }]}>Account</Text>
          <Text style={[styles.subSettingItemText, { color: colors.textSecondary }]}>Security notification, change number</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => openModal('privacy')} style={styles.settingItem}>
        <View style={styles.iconContainer}>
          <FontAwesome name="lock" size={20} style={[styles.title, { margin: 10, color: colors.textPrimary }]} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.mainSettingItemText, { color: colors.textPrimary }]}>Privacy</Text>
          <Text style={[styles.subSettingItemText, { color: colors.textSecondary }]}>Block contacts, disappearing messages</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => openModal('chats')} style={styles.settingItem}>
        <View style={styles.iconContainer}>
          <FontAwesome name="comments" size={20} style={[styles.title, { margin: 10, color: colors.textPrimary }]} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.mainSettingItemText, { color: colors.textPrimary }]}>Chats</Text>
          <Text style={[styles.subSettingItemText, { color: colors.textSecondary }]}>Theme, wallpapers, chat history</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => openModal('storage')} style={styles.settingItem}>
        <View style={styles.iconContainer}>
          <FontAwesome name="database" size={20} style={[styles.title, { margin: 10, color: colors.textPrimary }]} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.mainSettingItemText, { color: colors.textPrimary }]}>Storage and data</Text>
          <Text style={[styles.subSettingItemText, { color: colors.textSecondary }]}>Network usage, group & call tones</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => openModal('language')} style={styles.settingItem}>
        <View style={styles.iconContainer}>
          <FontAwesome name="language" size={20} style={[styles.title, { margin: 10, color: colors.textPrimary }]} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.mainSettingItemText, { color: colors.textPrimary }]}>App language</Text>
          <Text style={[styles.subSettingItemText, { color: colors.textSecondary }]}>English (device's language)</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => openModal('help')} style={styles.settingItem}>
        <View style={styles.iconContainer}>
          <FontAwesome name="question-circle" size={20} style={[styles.title, { margin: 10, color: colors.textPrimary }]} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.mainSettingItemText, { color: colors.textPrimary }]}>Help</Text>
          <Text style={[styles.subSettingItemText, { color: colors.textSecondary }]}>Help center, contact us, privacy policy</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => openModal('invite')} style={styles.settingItem}>
        <View style={styles.iconContainer}>
          <FontAwesome name="user-plus" size={20} style={[styles.title, { margin: 10, color: colors.textPrimary }]} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.mainSettingItemText, { color: colors.textPrimary }]}>Invite a friend</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={styles.settingItem}>
        <View style={styles.iconContainer}>
          <FontAwesome name="sign-out" size={20} style={[styles.title, { margin: 10, color: colors.textPrimary }]} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.mainSettingItemText, { color: colors.textPrimary }]}>Log out</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileBody;
