import React, { useEffect, useRef, useState } from 'react';
import {
  TextInput,
  Button,
  StyleSheet,
  Text,
  Alert,
  useColorScheme,
  ActivityIndicator,
  View,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  useWindowDimensions,
  Animated,
} from 'react-native';
import ModalRightToLeft from '../../models/ModalRightToLeft';
import { Colors } from '@/constants/Colors';
import { postRequest } from '@/src/routes/post';
import ROUTES from '@/src/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CacheConfig, CacheKeys, CacheTypes } from '@/src/routes/cacheKeys';

interface LoginPageProps {
  visible: boolean;
  onClose: () => void;
  navigation: any;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginPage: React.FC<LoginPageProps> = ({ visible, onClose, navigation, setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const { width, height } = useWindowDimensions();

  const handleLogin = async () => {
    if (loading) return;

    setLoading(true);

    const registrationType = username.includes('@') ? 'email' : 'phone';
    const loginData = { username, password };

    const cacheType = CacheTypes.AUTH_CACHE;
    const cacheKey = CacheKeys.LOGIN_DATA;

    const options = {
      headers: { 'Content-Type': 'application/json' },
      cacheKey: cacheKey,
      cacheType: cacheType,
      successMessage: 'Login was successful!',
      errorMessage: 'Login failed! Please try again.',
    };

    const response = await postRequest(ROUTES.auth.login, loginData, options);

    setLoading(false);

    if (response.success) {
      const { token } = response.data;
      console.log('Login Successful:', response.data);

      setIsLoggedIn(true);
      onClose();
    } else {
      console.error('Login error:', response.message);
      Alert.alert('Login Failed', response.message || 'Invalid credentials. Please try again.');
    }
  };

  const backgroundColor = Colors[colorScheme || 'light'].background;
  const textColor = Colors[colorScheme || 'light'].text;
  const inputBorderColor = Colors[colorScheme || 'light'].textPrimary || '#e0e0e0';

  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation]);

  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ModalRightToLeft
      visible={visible}
      onClose={onClose}
      name="Login"
      headerContent={<Text style={[styles.headerText, { color: textColor }]}>Login</Text>}
    >
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.container,
            {
              backgroundColor,
              paddingHorizontal: width > 600 ? width * 0.2 : 20, // Add padding for larger screens
            },
          ]}
          keyboardShouldPersistTaps="handled"
        >

          {/* Company Logo */}
          <View style={styles.logoContainer}>
            <Animated.Image
              source={require('../../assets/images/logo.png')}
              style={[
                styles.logo,
                {
                  transform: [{ rotate: rotateInterpolation }],
                  width: width * 0.3,
                  height: width * 0.3, // Adjust dynamically based on screen width
                },
              ]}
              resizeMode="contain"
            />
          </View>
          <TextInput
            style={[styles.input, { borderColor: inputBorderColor, color: textColor }]}
            placeholder="Email or Phone Number"
            placeholderTextColor={Colors[colorScheme || 'light'].textSecondary}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={[styles.input, { borderColor: inputBorderColor, color: textColor }]}
            placeholder="Password"
            placeholderTextColor={Colors[colorScheme || 'light'].textSecondary}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {loading ? (
            <ActivityIndicator size="large" color={Colors[colorScheme || 'light'].buttonBackground} />
          ) : (
            <Button
              title="Login"
              onPress={handleLogin}
              color={Colors[colorScheme || 'light'].buttonBackground}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ModalRightToLeft>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'stretch',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    alignSelf: 'center',
  },
});

export default LoginPage;
