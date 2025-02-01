import React, { useRef, useState, useEffect } from 'react';
import { Animated, Dimensions, StyleSheet, PanResponder, ViewStyle, TextStyle } from 'react-native';

const { width } = Dimensions.get('window');

// Define the types for the props
interface PageAnimationProps {
  children: React.ReactNode;
  isOpen: boolean;
  toggleOpen: () => void;
  animatedValue: Animated.Value;
}

const PageAnimation = ({ children, animatedValue, isOpen, toggleOpen }: PageAnimationProps) => {
  const [isLocked, setIsLocked] = useState(false);

  // Animate the page open/close
  const animatePage = (toValue: number) => {
    Animated.timing(animatedValue, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (toValue === 1) {
        setIsLocked(true); // Lock the page when fully opened
      } else {
        setIsLocked(false); // Unlock the page when closed
      }
    });
  };

  // Sync animation when 'isOpen' prop changes
  useEffect(() => {
    animatePage(isOpen ? 1 : 0);
  }, [isOpen]);

  // Interpolate animated value for translation
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [width * 0.9, 0], // Slide the page from right to left
  });

  // PanResponder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 10,
      onPanResponderMove: (_, gestureState) => {
        if (isLocked) {
          // Prevent further right-to-left swiping when locked
          if (gestureState.dx < 0) return;
        }

        // Allow left-to-right swiping to close
        const translateXValue = Math.max(-gestureState.dx, 0);
        animatedValue.setValue(translateXValue / width);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isLocked) {
          if (gestureState.dx > width / 4) {
            // Unlock and close on significant left-to-right swipe
            setIsLocked(false);
            toggleOpen();
          } else {
            // Snap back to open position
            animatePage(1);
          }
        } else {
          if (gestureState.dx < -width / 4) {
            // Close on significant right-to-left swipe
            toggleOpen();
          } else {
            // Snap back to closed position
            animatePage(0);
          }
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateX }] }]}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    backgroundColor: '#f8f8f8',
    elevation: 5,
  },
});

export default PageAnimation;
