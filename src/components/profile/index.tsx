import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, ScrollView, TextInput, Image, View, useColorScheme, ImageSourcePropType } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/src/routes';
import ModalRightToLeft from '@/models/ModalRightToLeft';
import { Colors } from '@/constants/Colors';
import handleChooseImage, { encodeImageToBase64, saveProfileData } from './profileActions';

export default function EditProfile({ visible, onClose }:{visible:boolean, onClose:()=>void}) {
  const [userName, setUserName] = useState('');
  const [about, setAbout] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState<ImageSourcePropType | null>(null); // Change here
  const [userData, setUserData] = useState(null);
  const [skills, setSkills] = useState('');
  const [projects, setProjects] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [services, setServices] = useState('');
  const [certificates, setCertificates] = useState('');
  
  const scheme = useColorScheme(); // Get the current theme (light or dark)
  
  // Dynamically select colors based on the current theme
  const currentColors = scheme === 'dark' ? Colors.dark : Colors.light;

  const fetchUserData = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem('UserData');
      if (savedUserData) {
        const parsedUserData = JSON.parse(savedUserData);
        setUserData(parsedUserData);
        setProfilePicture({ uri: API_BASE_URL + parsedUserData.profile_picture }); // Update to an object with uri
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
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSave = () => {
    saveProfileData(
      userName, 
      about, 
      phoneNumber, 
      email, 
      profilePicture as string | Blob, 
      skills, 
      projects, 
      education, 
      experience, 
      services, 
      certificates
    );
    onClose();
  };

  return (
    <ModalRightToLeft
      visible={visible}
      onClose={onClose}
      name="Edit Profile"
      headerContent={
        <Text style={{ color: currentColors.textPrimary, fontWeight: 'bold' }} onPress={onClose}>
          Edit
        </Text>
      }
    >
      <ScrollView style={{ flex: 1, backgroundColor: currentColors.background }} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => handleChooseImage(() => setProfilePicture)}>
          {profilePicture ? (
            <Image source={profilePicture} style={{ width: 100, height: 100, borderRadius: 50 }} />
          ) : (
            <Icon name="user-circle" size={100} color={currentColors.icon} />
          )}
        </TouchableOpacity>

        <View style={{ marginVertical: 10 }}>
          <MaterialCommunityIcons name="account" size={34} color={currentColors.textSecondary} />
          <TextInput
            style={{
              height: 40,
              borderBottomWidth: 1,
              borderBottomColor: currentColors.textSecondary,
              marginBottom: 10,
              color: currentColors.textPrimary,
              backgroundColor: currentColors.inputBackground,
            }}
            placeholder="User Name"
            placeholderTextColor={currentColors.textSecondary}
            value={userName}
            onChangeText={setUserName}
          />
        </View>
        
        {/* About Section */}
        <Text style={{ marginBottom: 10, color: currentColors.textSecondary }}>
          This is not your username or pin. This name will be visible to your contacts.
        </Text>

        <View style={{ marginVertical: 10 }}>
          <MaterialCommunityIcons name="information" size={34} color={currentColors.textSecondary} />
          <TextInput
            style={{
              height: 40,
              borderBottomWidth: 1,
              borderBottomColor: currentColors.textSecondary,
              marginBottom: 10,
              color: currentColors.textPrimary,
              backgroundColor: currentColors.inputBackground,
            }}
            placeholder="About"
            placeholderTextColor={currentColors.textSecondary}
            value={about}
            onChangeText={setAbout}
          />
        </View>

        <Text style={{ marginBottom: 10, color: currentColors.textSecondary }}>About</Text>

        {/* Phone Section */}
        <View style={{ marginVertical: 10 }}>
          <MaterialCommunityIcons name="phone" size={34} color={currentColors.textSecondary} />
          <TextInput
            style={{
              height: 40,
              borderBottomWidth: 1,
              borderBottomColor: currentColors.textSecondary,
              marginBottom: 10,
              color: currentColors.textPrimary,
              backgroundColor: currentColors.inputBackground,
            }}
            placeholder="Phone Number"
            placeholderTextColor={currentColors.textSecondary}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        <Text style={{ marginBottom: 10, color: currentColors.textSecondary }}>Phone</Text>

        {/* Email Section */}
        <View style={{ marginVertical: 10 }}>
          <MaterialCommunityIcons name="email" size={34} color={currentColors.textSecondary} />
          <TextInput
            style={{
              height: 40,
              borderBottomWidth: 1,
              borderBottomColor: currentColors.textSecondary,
              marginBottom: 10,
              color: currentColors.textPrimary,
              backgroundColor: currentColors.inputBackground,
            }}
            placeholder="Email"
            placeholderTextColor={currentColors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <Text style={{ marginBottom: 10, color: currentColors.textSecondary }}>Email</Text>

        {/* Skills Section */}
        <View style={{ marginVertical: 10 }}>
          <MaterialCommunityIcons name="tools" size={34} color={currentColors.textSecondary} />
          <TextInput
            style={{
              height: 40,
              borderBottomWidth: 1,
              borderBottomColor: currentColors.textSecondary,
              marginBottom: 10,
              color: currentColors.textPrimary,
              backgroundColor: currentColors.inputBackground,
            }}
            placeholder="Skills"
            placeholderTextColor={currentColors.textSecondary}
            value={skills}
            onChangeText={setSkills}
          />
        </View>

        <Text style={{ marginBottom: 10, color: currentColors.textSecondary }}>Skills</Text>

        {/* Projects Section */}
        <View style={{ marginVertical: 10 }}>
          <MaterialCommunityIcons name="account-wrench" size={34} color={currentColors.textSecondary} />
          <TextInput
            style={{
              height: 40,
              borderBottomWidth: 1,
              borderBottomColor: currentColors.textSecondary,
              marginBottom: 10,
              color: currentColors.textPrimary,
              backgroundColor: currentColors.inputBackground,
            }}
            placeholder="Projects"
            placeholderTextColor={currentColors.textSecondary}
            value={projects}
            onChangeText={setProjects}
          />
        </View>

        <Text style={{ marginBottom: 10, color: currentColors.textSecondary }}>Projects</Text>

        {/* Education Section */}
        <View style={{ marginVertical: 10 }}>
          <MaterialCommunityIcons name="school" size={34} color={currentColors.textSecondary} />
          <TextInput
            style={{
              height: 40,
              borderBottomWidth: 1,
              borderBottomColor: currentColors.textSecondary,
              marginBottom: 10,
              color: currentColors.textPrimary,
              backgroundColor: currentColors.inputBackground,
            }}
            placeholder="Education"
            placeholderTextColor={currentColors.textSecondary}
            value={education}
            onChangeText={setEducation}
          />
        </View>

        <Text style={{ marginBottom: 10, color: currentColors.textSecondary }}>Education</Text>

        {/* Experience Section */}
        <View style={{ marginVertical: 10 }}>
          <MaterialCommunityIcons name="briefcase" size={34} color={currentColors.textSecondary} />
          <TextInput
            style={{
              height: 40,
              borderBottomWidth: 1,
              borderBottomColor: currentColors.textSecondary,
              marginBottom: 10,
              color: currentColors.textPrimary,
              backgroundColor: currentColors.inputBackground,
            }}
            placeholder="Experience"
            placeholderTextColor={currentColors.textSecondary}
            value={experience}
            onChangeText={setExperience}
          />
        </View>

        <Text style={{ marginBottom: 10, color: currentColors.textSecondary }}>Experience</Text>

        {/* Services Section */}
        <View style={{ marginVertical: 10 }}>
          <MaterialCommunityIcons name="account-cog" size={34} color={currentColors.textSecondary} />
          <TextInput
            style={{
              height: 40,
              borderBottomWidth: 1,
              borderBottomColor: currentColors.textSecondary,
              marginBottom: 10,
              color: currentColors.textPrimary,
              backgroundColor: currentColors.inputBackground,
            }}
            placeholder="Services"
            placeholderTextColor={currentColors.textSecondary}
            value={services}
            onChangeText={setServices}
          />
        </View>

        <Text style={{ marginBottom: 10, color: currentColors.textSecondary }}>Services</Text>

        {/* Certificates Section */}
        <View style={{ marginVertical: 10 }}>
          <MaterialCommunityIcons name="certificate" size={34} color={currentColors.textSecondary} />
          <TextInput
            style={{
              height: 40,
              borderBottomWidth: 1,
              borderBottomColor: currentColors.textSecondary,
              marginBottom: 10,
              color: currentColors.textPrimary,
              backgroundColor: currentColors.inputBackground,
            }}
            placeholder="Certificates"
            placeholderTextColor={currentColors.textSecondary}
            value={certificates}
            onChangeText={setCertificates}
          />
        </View>

        <Text style={{ marginBottom: 10, color: currentColors.textSecondary }}>Certificates</Text>

        <TouchableOpacity onPress={handleSave} style={{ alignSelf: 'flex-end', backgroundColor: currentColors.primary, padding: 10 }}>
          <Text style={{ color: currentColors.buttonText }}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </ModalRightToLeft>
  );
}
