import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, ScrollView, TextInput, Image, View, useColorScheme, ImageSourcePropType, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ROUTES, { API_BASE_URL } from '@/src/routes';
import ModalRightToLeft from '@/models/ModalRightToLeft';
import { Colors } from '@/constants/Colors';
import handleChooseImage, { encodeImageToBase64, saveProfileData } from './profileActions';
import JobInputs from './Inputs';
import DynamicForm, { DynamicFormField } from '@/models/DynamicForm';
import { postRequest } from '@/src/routes/post';
import { CacheKeys, CacheTypes } from '@/src/routes/cacheKeys';

export default function EditProfile({ visible, onClose }: { visible: boolean, onClose: () => void }) {
  const [userName, setUserName] = useState('');
  const [about, setAbout] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState<{ uri: string; name: string; type: string; } | null>(null);
  const [userData, setUserData] = useState(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [status, setStatus] = useState('');
  const [openStatus, setOpenStatus] = useState(true);

  const closeStatus = () => setOpenStatus(false);

  const scheme = useColorScheme();
  const currentColors = scheme === 'dark' ? Colors.dark : Colors.light;

  const fetchUserData = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem('UserData');
      if (savedUserData) {
        const parsedUserData = JSON.parse(savedUserData);
        setUserData(parsedUserData);
        setProfilePicture({
          uri: API_BASE_URL + parsedUserData.profile_picture,
          name: '',
          type: 'image/jpeg' // or an appropriate MIME type
        });
        setUserName(parsedUserData.username);
        setPhoneNumber(parsedUserData.phone_number);
        setAbout(parsedUserData.about);
        setEmail(parsedUserData.email);
        setSkills(parsedUserData.skills || '');
        setProjects(parsedUserData.projects || '');
        setEducation(parsedUserData.education || '');
        setExperience(parsedUserData.experience || '');
        setServices(parsedUserData.services || '');
        setCertificates(parsedUserData.certificates || '');
        setStatus(parsedUserData.status || '');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);


  const handleSave = async () => {

    const combinedData = {
      ...generalForm,
      skills,
      projects,
      education,
      experience,
      services,
      certificates,
      profilePicture,
    };

    console.log('Combined Form Data:', combinedData);
  
      const cacheType = CacheTypes.AUTH_CACHE;
      const cacheKey = CacheKeys.LOGIN_DATA;
  
      const options = {
        headers: { 'Content-Type': 'application/json' },
        cacheKey: cacheKey,
        cacheType: cacheType,
        successMessage: 'Profile Info uploaded successful!',
        errorMessage: 'Profile info upload failed! Please try again.',
      };
  
      const response = await postRequest(ROUTES.user.profile, combinedData, options);
  
  
      if (response.success) {
        const { token } = response.data;
        console.log('Login Successful:', response.data);
        onClose();
      } else {
        console.error('Login error:', response.message);
        Alert.alert('Login Failed', response.message || 'Invalid credentials. Please try again.');
      }
    };


  type GeneralForm = {
    userName: string;
    about: string;
    phoneNumber: string;
    email: string;
    status: string;
  };

  const [generalForm, setGeneralForm] = useState<GeneralForm>({
    userName: '',
    about: '',
    phoneNumber: '',
    email: '',
    status: '',
  });

  const setValue = <T extends keyof GeneralForm>(field: T, value: GeneralForm[T]) => {
    setGeneralForm({
      ...generalForm,
      [field]: value,
    });
  };

  const dynamicFields: DynamicFormField[] = [
    { name: 'userName', label: 'User Name', type: 'text', value: (value) => setValue("userName", value), placeholder: 'User Name', required: true },
    { name: 'about', label: 'About', type: 'text', value: (value) => setValue("about", value), placeholder: 'About', required: false },
    { name: 'phoneNumber', label: 'Phone Number', type: 'text', value: (value) => setValue("phoneNumber", value), placeholder: 'Phone Number', required: true, keyboardType: 'phone-pad' },
    { name: 'email', label: 'Email', type: 'text', value: (value) => setValue("email", value), placeholder: 'Email', required: true, keyboardType: 'email-address' },
    {
      name: 'status', label: 'Status', type: 'typeSelector', placeholder: 'Type or select status (e.g. Busy)', options: [
        'Busy', 'Available', 'At School', 'At the Movies', 'At Work', 'In a Meeting',
        'Sleeping', 'Out for a Walk', 'On a Call', 'Eating', 'In Traffic'
      ], value: (value) => setValue('status', value), required: false
    },
  ];

  return (
    <ModalRightToLeft
      visible={visible}
      onClose={onClose}
      name="Edit Profile"
      headerContent={
        <Text style={{ color: currentColors.textPrimary, fontWeight: '700', fontSize: 20 }} onPress={onClose}>
          Edit
        </Text>
      }
    >
      <ScrollView style={{ flex: 1, backgroundColor: currentColors.background }} showsVerticalScrollIndicator={false}>

      <TouchableOpacity
        style={{ alignSelf: 'center', marginTop: 20 }}
        onPress={() =>
          handleChooseImage((image) => {
            setProfilePicture(image); // set full object with uri, name, type
          })
        }
      >
        {profilePicture?.uri ? (
          <Image
            source={{ uri: profilePicture.uri }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
        ) : (
          <Icon name="user-circle" size={100} color={currentColors.icon} />
        )}
        <Text
          style={{
            marginTop: 8,
            textAlign: 'center',
            color: currentColors.textSecondary,
            fontSize: 12,
          }}
        >
          Tap to {profilePicture ? 'change' : 'add'} profile picture
        </Text>
      </TouchableOpacity>



        <DynamicForm
          fields={dynamicFields}
          formData={generalForm}
          setFormData={setGeneralForm}
          setAction={function (action: boolean): void {
            console.log('Function not implemented.');
          }}
        />

        <JobInputs
          currentColors={currentColors}
          skills={skills}
          setSkills={setSkills}
          projects={projects}
          setProjects={setProjects}
          education={education}
          setEducation={setEducation}
          experience={experience}
          setExperience={setExperience}
          services={services}
          setServices={setServices}
          certificates={certificates}
          setCertificates={setCertificates}
        />

        <TouchableOpacity onPress={handleSave} style={{ alignSelf: 'flex-end', backgroundColor: currentColors.primary, padding: 10, marginVertical: 20, marginRight: 20, borderRadius: 10 }}>
          <Text style={{ color: currentColors.buttonText, fontWeight: '600' }}>Save</Text>
        </TouchableOpacity>

      </ScrollView>
    </ModalRightToLeft>
  );
}
