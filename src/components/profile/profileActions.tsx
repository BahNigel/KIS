import { API_BASE_URL } from '@/src/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity, View, Text, Alert } from 'react-native';
import { Project } from '../Messages/Chats/chatInterfaces';

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
    certificates: string, // New parameter
    status: string
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

const handleDeleteSkill = (index: number, skills: any[], setSkills: (value: any[]) => void, setStartSelect: (value: boolean) => void) => {
  // Remove the name at the given index
  const updatedSkills = skills.filter((_: any, i: number) => i !== index);

  // Update the skills list in the parent component
  setSkills(updatedSkills);

  // If the length of skills is less than or equal to 1, set startSelect to false
  if (updatedSkills.length <= 0) {
    setStartSelect(false);
  }
};

export const renderSkillItem = (item: any, index: number, currentColors: any, skills:any[], setSkills:(value: any[]) => void, setStartSelect: (value: boolean) => void) => (
  <View style={{ height: 60 }}>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: currentColors.primary,
        marginBottom: 30,
        height: 30,
        position: 'relative', // Important for the positioning of the 'X' button
      }}
    >
      <Text style={{ color: currentColors.buttonText, marginRight: 5 }}>{item.name}</Text>
    </View>

    {/* 'X' Button for Deletion */}
    <TouchableOpacity
      onPress={() => handleDeleteSkill(index, skills, setSkills, setStartSelect)}
      style={{
        position: 'absolute',
        top: 0,
        right: -7,
        backgroundColor: 'red', // Red color for the delete button
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>X</Text>
    </TouchableOpacity>
  </View>
);


export const handleAddProject = (
  projectForm: Project,
  selectedFiles: any,
  lowerForm: any,
  projects: any[],
  setProjects: (projects: Project[]) => void,
  setProjectForm: (arg0: Project) => void,
  setSelectedFiles: (arg0: never[]) => void,
  setLowerForm: (arg0: never[]) => void
) => {
  if (!projectForm.name || !projectForm.description || !projectForm.skills.length) {
    Alert.alert('Error', 'Please fill all the required fields.');
    return;
  }

  const newProject = {
    ...projectForm,
    files: selectedFiles,
    ...lowerForm,
  };

  // Add the new project to the projects list
  setProjects([...projects, newProject]);

  // Log the projects list to console
  console.log('Projects List:', [...projects, newProject]);

  // Clear the form for the next project
  setProjectForm({
    name: '',
    description: '',
    skills: projectForm.skills,
    mediaType: 'file',
    media: projectForm.media,
    selectedSkills: projectForm.selectedSkills,
    isCurrent: projectForm.isCurrent,
    endDate: projectForm.endDate,
    selectedCompanies: projectForm.selectedCompanies,
    selectedContributors: projectForm.selectedContributors,
    startDate: projectForm.startDate,
    files:[],
  });

  setSelectedFiles([]);
  setLowerForm([]);
};

export const handleRemoveProject = (
  index: number,
  projects: Project[],
  setProjects: (prevProjects: any) => void
) => {
  const updatedProjects: Project[] = projects.filter((_: any, i: number) => i !== index);
  setProjects(updatedProjects);

  console.log('Updated Projects List:', projects.filter((_: any, i: number) => i !== index));
};


// const handleRemoveProject = (index: number) => {
//   const updatedProjects = projects.filter((_, i) => i !== index);
//   setProjects(updatedProjects);
//   console.log('Updated Projects List:', updatedProjects);
// };