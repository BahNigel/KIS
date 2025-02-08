import React, { useState, useRef, useContext, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { TabBarVisibilityContext } from '../app/index';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

interface SectionedFrameProps {
  leftSectionContent: React.ReactNode;
  middleHeaderContent: React.ReactNode;
  middleBodyContent: React.ReactNode;
  rightHeaderContent: React.ReactNode;
  rightBodyContent: React.ReactNode;
}

const CommunityFrame = ({
  leftSectionContent,
  middleHeaderContent,
  middleBodyContent,
  rightHeaderContent,
  rightBodyContent,
}: SectionedFrameProps) => {
  const { setIsTabBarVisible } = useContext(TabBarVisibilityContext) || {}; // Access the context
  const [isRightSectionOpen, setIsRightSectionOpen] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scheme = useColorScheme(); // Detect whether the device is using light or dark mode

  const animatePage = (toValue: number) => {
    Animated.timing(animatedValue, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  var checker: boolean = false;

  const toggleOpen = () => {
    setIsRightSectionOpen((prev) => {
      const newValue = !prev;
      checker = newValue;
      animatePage(newValue ? 1 : 0);
      return newValue;
    });
  };

  useEffect(() => {
    // Handle the visibility of the tab bar based on isRightSectionOpen
    if (setIsTabBarVisible) {
      setIsTabBarVisible(!isRightSectionOpen); // Hide tab bar when section is open, show when closed
    }
  }, [isRightSectionOpen, setIsTabBarVisible]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 10,
      onPanResponderMove: (_, gestureState) => {
        const translateXValue = gestureState.dx / width;

        if (checker) {
          animatedValue.setValue(Math.max(0, Math.min(1 - translateXValue, 1)));
        } else {
          animatedValue.setValue(Math.max(0, Math.min(-translateXValue, 1)));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (checker) {
          if (gestureState.dx > width / 4) {
            toggleOpen();
          } else {
            animatePage(1);
          }
        } else {
          if (gestureState.dx < -width / 4) {
            toggleOpen();
          } else {
            if (checker) {
              toggleOpen();
            }
            animatePage(0);
          }
        }
      },
    })
  ).current;

  const lightTheme = {
    container: {
      backgroundColor: Colors.light.background,
    },
    middleSection: {
      backgroundColor: Colors.light.buttonSecondary, // Light gray alternative
    },
    middleHeader: {
      backgroundColor: Colors.light.buttonBackground, // Slightly darker gray alternative
    },
    rightSection: {
      backgroundColor: Colors.light.inputBackground, // Input field background for light mode
    },
    rightHeader: {
      backgroundColor: Colors.light.tabIconDefault, // Matches textDescription color
    },
  };
  
  const darkTheme = {
    container: {
      backgroundColor: Colors.dark.background,
    },
    middleSection: {
      backgroundColor: Colors.dark.buttonSecondary, // Darker gray alternative
    },
    middleHeader: {
      backgroundColor: Colors.dark.buttonBackground, // Slightly lighter gray alternative
    },
    rightSection: {
      backgroundColor: Colors.dark.inputBackground, // Input field background for dark mode
    },
    rightHeader: {
      backgroundColor: Colors.dark.tabIconDefault, // Matches textDescription color
    },
  };
  
  const currentTheme = scheme === 'dark' ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, currentTheme.container]}>
      {/* Left Section */}
      <View style={styles.leftSection}>
        <ScrollView>{leftSectionContent}</ScrollView>
      </View>

      {/* Middle Section */}
      <View style={[styles.middleSection, currentTheme.middleSection]} {...panResponder.panHandlers}>
        <View style={[styles.middleHeader, currentTheme.middleHeader]}>
          {middleHeaderContent}
        </View>
        <ScrollView style={styles.middleBody}>{middleBodyContent}</ScrollView>
      </View>

      {/* Right Section */}
      <Animated.View
        style={[
          styles.rightSection,
          currentTheme.rightSection,
          {
            transform: [
              {
                translateX: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [width - 50, 0], // Constrain translation
                }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.rightHeader, currentTheme.rightHeader]}>
          <TouchableOpacity onPress={toggleOpen}>
            <Icon
              name={isRightSectionOpen ? 'chevron-right' : 'chevron-left'} // Left arrow when open, right arrow when closed
              size={15}
              color="white" // Make sure the arrow is visible on dark mode
              style={styles.arrow}
            />
          </TouchableOpacity>
          {rightHeaderContent}
        </View>
        <View style={styles.rightBody} {...panResponder.panHandlers}>
          {rightBodyContent}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  leftSection: {
    width: '20%',
    backgroundColor: 'transparent',
  },
  middleSection: {
    width: '65%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 5,
  },
  middleHeader: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 5,
  },
  middleBody: {
    flex: 1,
    padding: 10,
  },
  rightSection: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: width,
    borderTopLeftRadius: 5,
  },
  rightHeader: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderTopLeftRadius: 5,
  },
  arrow: {
    fontSize: 20,
    marginRight: 10,
  },
  rightBody: {
    flex: 1,
    padding: 10,
  },
});

export default CommunityFrame;
