import React, { useState } from 'react';
import {
  TextInput,
  Button,
  StyleSheet,
  Text,
  View,
  Alert,
  useColorScheme,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import ModalRightToLeft from '../../models/ModalRightToLeft';
import { Colors } from '@/constants/Colors'; // Import your color constants
import ROUTES from '@/src/routes';
import { CacheKeys, CacheTypes } from '@/src/routes/cacheKeys';
import { postRequest } from '@/src/routes/post';
import VerificationProps from './authInterface';
import { generateKeyPair } from '@/models/End-To-End/keygenerate';
import { savePrivateKey } from '@/src/routes/cache';

export default function VerifyPage({ visible, onClose, verificationCode, userDetails, navigation, setIsLoggedIn }: VerificationProps) {
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme(); // Get the user's current color scheme
  const { width } = useWindowDimensions(); // Get the screen width for responsive design

  const handleVerification = async () => {
    setLoading(true);
    let publicKey = ''; // Declare outside for scope accessibility
    let privateKey = '';

    try {
      if (inputCode === verificationCode) {
        Alert.alert('Success', 'Verification successful.');

        // Generate Key Pair
        try {
          const keyPair = await generateKeyPair(); // Await key generation
          publicKey = keyPair.publicKey; // Assign public key to scope variable
          privateKey = keyPair.privateKey;
          console.log('Public Key:', publicKey);
          console.log('Private Key:', keyPair.privateKey); // Only log private key in dev, never in prod
        } catch (keyError) {
          console.error('Error generating key pair:', keyError);
          Alert.alert('Error', 'Key generation failed. Please try again.');
          return; // Exit early if key generation fails
        }

        const key = 'privateKeyId';

        // Save private key securely
        await savePrivateKey(key, privateKey);

        // Prepare registration data based on type (phone or email)
        const { registrationType, phoneNumber, countryCode, callingCode, email, password } = userDetails;

        const registrationData = {
          username: registrationType === 'phone' ? phoneNumber : email,
          [registrationType === 'phone' ? 'phone_number' : 'email']: registrationType === 'phone' ? phoneNumber : email,
          password,
          code: registrationType === 'phone' ? { cca2: countryCode, callingCode } : {},
          publicKey: publicKey || '',
        };

        console.log('Registration Data:', registrationData);

        // Get cache type and key from the cacheKeys file
        const cacheType = CacheTypes.AUTH_CACHE; // Use AUTH_CACHE type for authentication
        const cacheKey = CacheKeys.LOGIN_DATA;   // Use LOGIN_DATA key for storing login-related data

        // Define options for the postRequest function
        const options = {
          headers: { 'Content-Type': 'application/json' },
          cacheKey,
          cacheType,
          successMessage: 'Login was successful!',
          errorMessage: 'Login failed! Please try again.',
        };

        // Attempt user registration
        const registerResponse = await postRequest(ROUTES.auth.register, registrationData, options);

        if (registerResponse?.success) {
          Alert.alert('Registration Successful', registerResponse?.message);
          setIsLoggedIn(true);
          onClose(); // Close the modal upon successful registration
        } else {
          console.error('Registration Error:', registerResponse?.message);
          Alert.alert('Registration Error', registerResponse?.message || 'An error occurred.');
        }
      } else {
        Alert.alert('Verification Error', 'The verification code is incorrect.');
      }
    } catch (error) {
      console.error('Unexpected Error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Dynamically set colors based on the theme
  const backgroundColor = Colors[colorScheme || 'light'].background;
  const textColor = Colors[colorScheme || 'light'].text;
  const inputBorderColor = Colors[colorScheme || 'light'].textPrimary || '#e0e0e0';
  const buttonColor = Colors[colorScheme || 'light'].buttonBackground;

  return (
    <ModalRightToLeft
      visible={visible}
      onClose={onClose}
      name="Verify Code"
      headerContent={
        <Text style={[styles.headerText, { color: textColor }]}>Verification</Text>
      }
    >
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.label, { color: textColor }]}>Enter Verification Code:</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: inputBorderColor, color: textColor, backgroundColor },
            { width: width > 600 ? '50%' : '100%' } // Adjust width based on screen size
          ]}
          value={inputCode}
          onChangeText={setInputCode}
          keyboardType="numeric"
          placeholder="Enter Code"
          placeholderTextColor={Colors[colorScheme || 'light'].textSecondary}
        />
        {loading ? (
          <ActivityIndicator size="large" color={buttonColor} />
        ) : (
          <Button title="Verify" onPress={handleVerification} color={buttonColor} />
        )}
      </View>
    </ModalRightToLeft>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    padding: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
