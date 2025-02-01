import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

export default function Loader() {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity set to 0

  useEffect(() => {
    const loadApp = async () => {
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1, // Fully visible
        duration: 1000, // 1 second for fade-in
        useNativeDriver: true,
      }).start();

      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds

      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0, // Fully hidden
        duration: 1000, // 1 second for fade-out
        useNativeDriver: true,
      }).start(() => SplashScreen.hideAsync());
    };

    loadApp();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
  },
});
