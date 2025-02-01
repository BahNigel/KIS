import React, { useState, useRef, useEffect } from 'react';
import {
  TextInput,
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  useColorScheme,
  LogBox,
  Platform,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import ModalRightToLeft from '../../models/ModalRightToLeft';
import { Colors } from '@/constants/Colors';
import VerifyPage from './VerifyPage';

LogBox.ignoreLogs([
  'Require cycles are allowed, but can result in uninitialized values.',
  'Support for defaultProps will be removed from function components',
]);

const { width } = Dimensions.get('window');

interface RegisterPageProps {
  visible: boolean;
  onClose: () => void;
  navigation: any;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegistrationPage: React.FC<RegisterPageProps> = ({
  visible,
  onClose,
  navigation,
  setIsLoggedIn,
}) => {
  const [registrationType, setRegistrationType] = useState('email');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [userDetails, setUserDetails] = useState({});
  const phoneInput = useRef<PhoneInput>(null);

  const colorScheme = useColorScheme();

  const generateVerificationCode = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  const handleRegistration = () => {
    if (registrationType === 'email') {
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
        return;
      }
    } else {
      if (!isValidPhoneNumber) {
        Alert.alert('Invalid Phone Number', 'Please enter a valid phone number.');
        return;
      }
    }

    const code = generateVerificationCode();
    console.log('Verification Code:', code);

    setVerificationCode(code);
    setUserDetails({
      registrationType,
      email,
      phoneNumber,
      callingCode: phoneInput.current?.getCallingCode(),
      country: phoneInput.current?.getCountryCode(),
      password,
    });

    setShowVerifyModal(true);
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
    <>
      <ModalRightToLeft
        visible={visible}
        onClose={onClose}
        name="Registration"
        headerContent={<Text style={[styles.headerText, { color: textColor }]}>Registration</Text>}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Company Logo */}
          <View style={styles.logoContainer}>
            <Animated.Image
              source={require('../../assets/images/logo.png')}
              style={[
                styles.logo,
                {
                  transform: [{ rotate: rotateInterpolation }],
                },
              ]}
              resizeMode="contain"
            />
          </View>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                registrationType === 'email' && { backgroundColor: Colors[colorScheme || 'light'].buttonBackground },
              ]}
              onPress={() => setRegistrationType('email')}
            >
              <Text style={[styles.toggleButtonText, { color: textColor }]}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                registrationType === 'phone' && { backgroundColor: Colors[colorScheme || 'light'].buttonBackground },
              ]}
              onPress={() => setRegistrationType('phone')}
            >
              <Text style={[styles.toggleButtonText, { color: textColor }]}>Phone</Text>
            </TouchableOpacity>
          </View>

          {registrationType === 'email' ? (
            <TextInput
              style={[styles.input, { borderColor: inputBorderColor, color: textColor }]}
              placeholder="Email"
              placeholderTextColor={Colors[colorScheme || 'light'].textSecondary}
              value={email}
              onChangeText={setEmail}
            />
          ) : (
            <PhoneInput
              ref={phoneInput}
              defaultValue=""
              defaultCode="DM"
              layout="first"
              onChangeText={(text) => setPhoneNumber(text)}
              onChangeFormattedText={(text) => {
                const isValid = phoneInput.current?.isValidNumber(text);
                setIsValidPhoneNumber(isValid || false);
              }}
              containerStyle={[styles.phoneContainer, { borderColor: inputBorderColor }]}
              textContainerStyle={{ backgroundColor }}
              textInputStyle={{
                height: 50,
                color: textColor,
                fontSize: 16,
                width: 120,
              }}
              withDarkTheme={colorScheme === 'dark'}
              withShadow
              autoFocus
            />
          )}

          <TextInput
            style={[styles.input, { borderColor: inputBorderColor, color: textColor }]}
            placeholder="Password"
            placeholderTextColor={Colors[colorScheme || 'light'].textSecondary}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button
            title="Register"
            onPress={handleRegistration}
            color={Colors[colorScheme || 'light'].buttonBackground}
          />
        </ScrollView>
      </ModalRightToLeft>

      <VerifyPage
        visible={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        verificationCode={verificationCode}
        userDetails={userDetails}
        navigation={navigation}
        setIsLoggedIn={setIsLoggedIn}
      />
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: '5%',
    paddingBottom: Platform.OS === 'web' ? 20 : 40,
    maxWidth: 600, // Set maximum width
    width: '100%', // Scale to screen width
    alignSelf: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
    borderWidth: 1,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  phoneContainer: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    height: 50,
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120, // Set a fixed size
    height: 120, // Set a fixed size
  },
});

export default RegistrationPage;
