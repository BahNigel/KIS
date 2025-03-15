import { API_BASE_URL } from '@/src/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity, View, Text, Alert } from 'react-native';
import { Project } from '../Messages/Chats/chatInterfaces';
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


export const handleAddProject = (
  projectForm: Project,
  projects: Project[],
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
    id: Math.floor(Math.random() * 1000000),
    name: projectForm.name,
    description: projectForm.description,
    skills: projectForm.skills,
    mediaType: projectForm.mediaType,
    media: projectForm.media,
    selectedSkills: projectForm.selectedSkills, // ✅ Corrected reference
    isCurrent: projectForm.isCurrent,
    endDate: projectForm.endDate,
    selectedCompanies: projectForm.selectedCompanies,
    selectedContributors: projectForm.selectedContributors,
    startDate: projectForm.startDate,
    files: projectForm.files, 
    type: projectForm.type,
  };

  // Add the new project to the projects list
  setProjects([...projects, newProject]);

  // Log the projects list to console
  console.log('Projects List:', [...projects, newProject]);

  // Clear the form for the next project
  setProjectForm({
    id: Math.floor(Math.random() * 1000000),
    name: '',
    description: '',
    skills: projectForm.skills,
    mediaType: 'file',
    media: projectForm.media,
    selectedSkills: projectForm.selectedSkills, // ✅ Corrected reference
    isCurrent: projectForm.isCurrent,
    endDate: projectForm.endDate,
    selectedCompanies: projectForm.selectedCompanies,
    selectedContributors: projectForm.selectedContributors,
    startDate: projectForm.startDate,
    files: [], // ✅ Clears files correctly
    type: 'project',
  });

  setSelectedFiles([]); // ✅ Clears selected files
  setLowerForm([]); // ✅ Ensures lowerForm is reset
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


export const handleUpdateProject = (
  projectForm: Project,
  selectedFiles: { uri: string; name: string; mimeType: string }[],
  lowerForm: string | any[],
  projects: Project[],
  setProjects: (projects: Project[]) => void,
  setProjectForm: (form: Project) => void,
  setSelectedFiles: (files: { uri: string; name: string; mimeType: string }[]) => void,
  setLowerForm: (form: { endDate: string; isCurrent: boolean; selectedCompanies: []; selectedContributors: []; startDate: string }[]) => void,
  setSelectEdit: (value: any[])=>void, selectEdit: any[], editingProject: any[], setClearForm: (value:boolean)=>void, toggleProjects: (value: boolean) => void,
): void => {
  try {
    // Validate the data before update
    if (!projectForm.name || !projectForm.description) {
      Alert.alert('Missing Data', 'Please fill in all fields before updating the project.');
      return;
    }

    if (lowerForm.length === 0) {
      Alert.alert('Missing Date', 'Please provide the start and end date for the project.');
      return;
    }

    console.log("7777777777777777777777777777777777777777777777777777777777777777777777777777: ", lowerForm)

    const updatedProject: Project = {
      ...projectForm,
      files: selectedFiles as any[], // Assuming the files are of type File[]
      endDate: lowerForm[0].endDate,
      isCurrent: lowerForm[0].isCurrent,
      selectedCompanies: lowerForm[0].selectedCompanies,
      selectedContributors: lowerForm[0].selectedContributors,
      startDate: lowerForm[0].startDate
    };

    // Find the project being updated
    const projectIndex = projects.findIndex(project => project.id === projectForm.id);
    if (projectIndex === -1) {
      Alert.alert('Project Not Found', 'The project you are trying to update does not exist.');
      return;
    }

    
    console.log("000000000000000000000000000000000000000000000000000000000000000000000000: ", projectIndex)

    // Update the project in the projects array
    const updatedProjects: Project[] = [...projects];
    updatedProjects[projectIndex] = updatedProject;

    // Update the state with the new list of projects
    setProjects(updatedProjects);

    // Reset the form and files
    setProjectForm({ ...projectForm, name: '', description: '', media: '', skills: [], selectedSkills: [] });
    setSelectedFiles([]);
    setLowerForm([{ endDate: '', isCurrent: false, selectedCompanies: [], selectedContributors: [], startDate: '' }]);
    setSelectEdit(selectEdit.filter(item => item !== editingProject)); // Remove from edit list

    setClearForm(true)
    toggleProjects(false)
    Alert.alert('Success', 'Project updated successfully!');
  } catch (error) {
    console.error('Error updating project:', error);
    Alert.alert('Error', 'There was an issue updating the project. Please try again.');
  }
};