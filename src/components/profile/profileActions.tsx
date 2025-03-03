import { API_BASE_URL } from '@/src/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

export const encodeImageToBase64 = async (image: string | Blob): Promise<string> => {
  try {
    if (!image) return ''; // Return an empty string if no image is selected

    let blob: Blob;

    if (image instanceof Blob) {
      blob = image; // If it's already a Blob, just use it
    } else {
      const response = await fetch(image); // Fetch image if it's a string URI
      blob = await response.blob(); // Wait for the Blob data
    }

    // Read the Blob as Base64
    const base64String = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string); // Type cast here for result
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    return base64String;
  } catch (error) {
    console.error('Error encoding image to base64:', error);
    throw error;
  }
};

const handleChooseImage = async (setProfilePicture: (value: string | null) => void) => {  
  try {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setProfilePicture(pickerResult.assets[0].uri); // pickerResult.assets[0].uri is a string
    }
  } catch (error) {
    console.error('Error choosing image:', error);
  }
};

export default handleChooseImage;

export const saveProfileData = async (
    username: string,
    about: string,
    phone: string,
    email: string,
    profile: string | Blob,
    skills: string, // New parameter
    projects: string, // New parameter
    education: string, // New parameter
    experience: string, // New parameter
    services: string, // New parameter
    certificates: string // New parameter
  ): Promise<void> => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      const jsonObject = JSON.parse(token);
      
      // Encode the selected image to base64
      const profileImageBase64: string = await encodeImageToBase64(profile); // Corrected type as string

      const formData = new FormData();
      formData.append('username', username);
      formData.append('about', about);
      formData.append('phone_number', phone);
      formData.append('email', email);
      formData.append('profile_picture', profileImageBase64);

      const response = await axios.put(API_BASE_URL + '/user/user-info/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${jsonObject.access}`,
        },
      });

      if (response.status === 200) {
        console.log('Profile data saved successfully');
      } else {
        console.error('Failed to save profile data');
      }
    }
  } catch (error) {
    console.error('Error saving profile data:', error);
  }
};
