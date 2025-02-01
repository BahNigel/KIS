import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  useColorScheme,
  Dimensions,
  ScrollView,
} from 'react-native';
import RegistrationPage from './registration';
import LoginPage from './login';
import { Colors } from '@/constants/Colors';

type IndexProps = {
  navigation: any; // Or use the correct navigation type
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const Index = ({ navigation, setIsLoggedIn }: IndexProps) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Animation reference
  const rotation = useRef(new Animated.Value(0)).current;

  // Modal visibility states
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [registrationModalVisible, setRegistrationModalVisible] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation]);

  const colors = {
    background: isDarkMode ? Colors.dark.background : Colors.light.background,
    textPrimary: isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary,
    textSecondary: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary,
    textDescription: isDarkMode ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault,
    buttonText: isDarkMode ? Colors.dark.buttonText : Colors.light.buttonText,
    buttonBackground: isDarkMode ? Colors.dark.buttonBackground : Colors.light.buttonBackground,
    buttonSecondary: isDarkMode ? Colors.dark.buttonSecondary : Colors.light.buttonSecondary,
  };

  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Company Logo */}
        <View style={styles.logoContainer}>
          <Animated.Image
            source={require('../../assets/images/logo.png')}
            style={[styles.logo, { transform: [{ rotate: rotateInterpolation }] }]}
            resizeMode="contain"
          />
        </View>

        {/* App Information */}
        <View style={styles.infoContainer}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Welcome to KIS International
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Your secure communication partner.
          </Text>
          <Text style={[styles.meaning, { color: colors.textPrimary }]}>
            KIS: Kingdom Impact Social
          </Text>
          <Text style={[styles.description, { color: colors.textDescription }]}>
            Enjoy private, end-to-end encrypted messaging. Your conversations stay
            between you and your contacts—always.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.buttonBackground }]}
            onPress={() => setRegistrationModalVisible(true)}
          >
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.buttonSecondary }]}
            onPress={() => setLoginModalVisible(true)}
          >
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal Components */}
      {loginModalVisible && (
        <LoginPage
          visible={loginModalVisible}
          onClose={() => setLoginModalVisible(false)}
          navigation={navigation}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
      {registrationModalVisible && (
        <RegistrationPage
          visible={registrationModalVisible}
          onClose={() => setRegistrationModalVisible(false)}
          navigation={navigation}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: '5%',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: Math.min(width * 0.4, 200), // Max width of 200px
    height: Math.min(width * 0.4, 200), // Max height of 200px
  },
  infoContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  meaning: {
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 10,
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: '5%',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Index;
