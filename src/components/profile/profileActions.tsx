import { API_BASE_URL } from '@/src/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity, View, Text, Alert } from 'react-native';
import { Certificate, Education, Project, Service } from '../Messages/Chats/chatInterfaces';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

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

const handleChooseImage = async (callback: (image: { uri: string; name: string; type: string }) => void) => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    const asset = result.assets[0];
    const fileName = asset.fileName || asset.uri.split('/').pop() || 'profile.jpg';

    const image = {
      uri: asset.uri,
      name: fileName,
      type: asset.type ?? 'image/jpeg',
    };

    callback(image);
  }
};

export default handleChooseImage;

export const saveProfileData = async (
  username: string,
  about: string,
  phone: string,
  email: string,
  profile: { uri: string } | Blob,
  skills: Record<string, any>[],
  projects: Project[],
  education: Education[],
  experience: Record<string, any>[],
  service: Service[],
  certificate: Certificate[],
  status: string
): Promise<void> => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;
    const { access } = JSON.parse(token);

    // Convert image object to base64 string
    let profilePicBase64: string;
    if (profile && typeof profile !== 'string') {
      profilePicBase64 = await encodeImageToBase64(
        typeof profile === 'object' && 'uri' in profile ? profile.uri : profile
      );
    } else {
      profilePicBase64 = profile as string;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('about', about);
    formData.append('phone_number', phone);
    formData.append('email', email);
    formData.append('profile_picture', profilePicBase64);

    // Append each array as a JSON string
    formData.append('skills', JSON.stringify(skills));
    formData.append('projects', JSON.stringify(projects));
    formData.append('education', JSON.stringify(education));
    formData.append('experience', JSON.stringify(experience));
    formData.append('service', JSON.stringify(service));
    formData.append('certificate', JSON.stringify(certificate));

    formData.append('status', status);

    // const response = await axios.put(
    //   `${API_BASE_URL}/user/user-info/`,
    //   formData,
    //   {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //       Authorization: `Bearer ${access}`,
    //     },
    //   }
    // );

    // if (response.status === 200) {
    //   console.log('Profile data saved successfully');
    // } else {
    //   console.error('Failed to save profile data');
    // }
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


export const renderSkillItem = (
  item: any,
  index: number,
  currentColors: any,
  skills: any[],
  setSkills: (value: any[]) => void,
  setStartSelect: (value: boolean) => void,
  selectEdit: any[],
  setSelectEdit: (value: any) => void,
  setOpenAnyModal: (value: string) => void
) => (
  <View style={{ height: 60 }}>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
        marginHorizontal: 10,
        borderRadius: 20,
        backgroundColor: currentColors.primary,
        marginBottom: 30,
        height: 30,
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: currentColors.buttonText }}>{item.name}</Text>
    </View>

    {/* Edit Button */}
    <TouchableOpacity
      onPress={() =>{ 
        setOpenAnyModal(item.type)
        setSelectEdit((prev: any[]) => {
          const exists = prev.some((el) => el.type === item.type);
          if (exists) return [...prev]; // Prevent duplicate types
          return [...prev, item]; // Add only if type is unique
        });
      }}
      style={{
        position: 'absolute',
        top: 5,
        left: 0,
        backgroundColor: 'gray',
        borderRadius: 10,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Feather name="edit-2" size={14} color="white" />
    </TouchableOpacity>

    {/* Close Button */}
    <TouchableOpacity
      onPress={() => handleDeleteSkill(index, skills, setSkills, setStartSelect)}
      style={{
        position: 'absolute',
        top: 5,
        right: 0,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Ionicons name="close-circle" size={25} color={currentColors.danger} />
    </TouchableOpacity>
  </View>
);


export const handleAddEntry = (
  entryForm: any, 
  entries: any[], 
  setEntries: (entries: any[]) => void, 
  setEntryForm: (arg0: any) => void, 
  setSelectedFiles: (arg0: never[]) => void, 
  type: string
) => {
  // Define required fields for different entry types
  const requiredFields: { [key: string]: string[] } = {
    project: ['name', 'description', 'skills'],
    education: ['name', 'description', 'degree', 'grades', 'field', 'skills'],
    experience: ['name', 'employmentType', 'location', 'whereFound', 'company', 'description'],
    certificate: ['name', 'issuedBy', 'description', 'selectedSkills'],
    service: ['name', 'description', 'selectedSkills', 'price'],
    // Add more entry types as needed
  };

  // Check if the entry type exists in requiredFields
  if (entryForm.type in requiredFields) {
    const missingFields = requiredFields[entryForm.type].filter(
      (field) => !entryForm[field] || (Array.isArray(entryForm[field]) && entryForm[field].length === 0)
    );

    if (missingFields.length > 0) {
      Alert.alert('Error', `Please fill all the required fields: ${missingFields.join(', ')}`);
      return;
    }
  }

  // Generate new entry with a unique ID
  const newEntry = { id: Math.floor(Math.random() * 1000000), ...entryForm , type};

  // Ensure the function properly updates state
  setEntries([...entries, newEntry]); // ✅ Ensures correct type assignment

  // Log the updated entries list
  console.log('Updated Entries List:', [...entries, newEntry]);

  // Clear the form dynamically
  setEntryForm({});
  setSelectedFiles([]); 
};


export const handleRemoveEntry = (
  index: number,
  entries: any[],
  setEntries: (entries: any[]) => void
) => {
  const updatedEntries: any[] = entries.filter((_, i: number) => i !== index);
  setEntries(updatedEntries);

  console.log('Updated Entries List:', updatedEntries);
};



export const handleUpdateEntry = (
  entryForm: any,
  selectedFiles: { uri: string; name: string; mimeType: string }[],
  entries: any[],
  setEntries: (entries: any[]) => void,
  setEntryForm: (form: any) => void,
  setSelectedFiles: (files: { uri: string; name: string; mimeType: string }[]) => void,
  setSelectEdit: (value: any[]) => void, 
  selectEdit: any[], 
  editingEntry: any[], 
  setClearForm: (value: boolean) => void, 
  toggleEntries: (value: boolean) => void,
  type: string,
): void => {
  try {
    // Validate the required fields dynamically
    if (!entryForm.name || !entryForm.description) {
      Alert.alert('Missing Data', 'Please fill in all required fields before updating.');
      return;
    }

    const updatedEntry: any = {
      ...entryForm,
      files: selectedFiles, 
      type
    };

    // Find the entry being updated
    const entryIndex = entries.findIndex(entry => entry.id === entryForm.id);
    if (entryIndex === -1) {
      Alert.alert('Entry Not Found', 'The item you are trying to update does not exist.');
      return;
    }

    console.log("Entry Index Found:", entryIndex);

    // Update the entry in the array
    const updatedEntries = [...entries];
    updatedEntries[entryIndex] = updatedEntry;

    // Update state with the new entries list
    setEntries(updatedEntries);

    // Reset the form and files
    setEntryForm({ name: '', description: '', media: '', skills: [], selectedSkills: [] });
    setSelectedFiles([]);
    setSelectEdit(selectEdit.filter(item => item !== editingEntry));

    setClearForm(true);
    toggleEntries(false);
    Alert.alert('Success', 'Entry updated successfully!');
  } catch (error) {
    console.error('Error updating entry:', error);
    Alert.alert('Error', 'There was an issue updating the entry. Please try again.');
  }
};
