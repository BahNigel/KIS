import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  LayoutChangeEvent,
  Dimensions,
} from 'react-native';

type NavigationItem = {
  name: string;
  onPress: () => void;
  isActive: boolean; // Track if the button is active
};

type FrameProps = {
  headerTitle: string;
  navigations: NavigationItem[];
  children?: React.ReactNode;
};

export default function Frame({ headerTitle, navigations, children }: FrameProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || 'light'];

  const [headerHeight, setHeaderHeight] = useState(0);
  const [bodyHeadHeight, setBodyHeadHeight] = useState(0);

  const handleHeaderLayout = (event: LayoutChangeEvent) => {
    setHeaderHeight(event.nativeEvent.layout.height);
  };

  const handleBodyHeadLayout = (event: LayoutChangeEvent) => {
    setBodyHeadHeight(event.nativeEvent.layout.height);
  };

  const screenHeight = Dimensions.get('window').height;
  const bodyBodyHeight = screenHeight - headerHeight - bodyHeadHeight;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header Section */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.background, // Header has same color as body background
            borderBottomWidth: 1, // Adding a line separator between header and body
            borderBottomColor: theme.text, // Using tint color as the border color
          },
        ]}
        onLayout={handleHeaderLayout}
      >
        <Text style={[styles.headerText, { color: theme.textPrimary }]}>{headerTitle}</Text>
      </View>

      {/* Body Section */}
      <View style={styles.body}>
        {/* Body Head: Navigation Buttons */}
        <View style={[styles.bodyHead]} onLayout={handleBodyHeadLayout}>
          <ScrollView
            contentContainerStyle={styles.navScrollContainer}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {navigations.map((nav, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.navButton,
                  {
                    backgroundColor: nav.isActive ? theme.primary : theme.tint, // Change color if active
                    borderBottomWidth: nav.isActive ? 3 : 0, // Add underline for active tab
                    borderBottomColor: nav.isActive ? theme.primary : 'transparent', // Set active underline color
                  }
                ]}
                onPress={nav.onPress}
              >
                <Text
                  style={[
                    styles.navButtonText,
                    {
                      color: nav.isActive ? theme.textPrimary : theme.framButtonText, // Change text color if active
                    },
                  ]}
                >
                  {nav.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Body Body: Additional Content */}
        <ScrollView
          style={[
            styles.bodyBody,
            {
              height: bodyBodyHeight > 0 ? bodyBodyHeight : undefined, // Ensure height is valid before applying
            },
          ]}
        >
          {children}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
  },
  bodyHead: {
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginTop: 15,
  },
  navScrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  bodyBody: {
    padding: 15,
  },
});
