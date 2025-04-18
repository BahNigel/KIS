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
import JobInputs from './Inputs';
import Status from './inputs/status';

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
  const [status, setStatus] = useState('');
  const [openStatus, setOpenStatus] = useState(true);
  const closeStatus = () =>{setOpenStatus(false)}
  
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
        setStatus(parsedUserData.status || '');
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
      certificates,
      status
    );
    onClose();
  };

  return (
    <ModalRightToLeft
      visible={visible}
      onClose={onClose}
      name="Edit Profile"
      headerContent={
        <Text style={{ color: currentColors.textPrimary, fontWeight: 700, fontSize: 20 }} onPress={onClose}>
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

        <View style={{ marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
        <MaterialCommunityIcons name="account" size={34} color={currentColors.textSecondary} style={{ width: '10%' }} />
        <TextInput
          style={{
            height: 40,
            borderBottomWidth: 1,
            borderBottomColor: currentColors.textSecondary,
            marginBottom: 10,
            color: currentColors.textPrimary,

            marginLeft: 10,
            
            width: '90%',
          }}
          placeholder="User Name"
          placeholderTextColor={currentColors.textSecondary}
          value={userName}
          onChangeText={setUserName}
        />
      </View>

      <View style={{ marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
        <MaterialCommunityIcons name="information" size={34} color={currentColors.textSecondary} style={{ width: '10%' }} />
        <TextInput
          style={{
            height: 40,
            borderBottomWidth: 1,
            borderBottomColor: currentColors.textSecondary,
            marginBottom: 10,
            color: currentColors.textPrimary,
            
            marginLeft: 10,
            width: '90%',
          }}
          placeholder="About"
          placeholderTextColor={currentColors.textSecondary}
          value={about}
          onChangeText={setAbout}
        />
      </View>

      <View style={{ marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
        <MaterialCommunityIcons name="phone" size={34} color={currentColors.textSecondary} style={{ width: '10%' }} />
        <TextInput
          style={{
            height: 40,
            borderBottomWidth: 1,
            borderBottomColor: currentColors.textSecondary,
            marginBottom: 10,
            color: currentColors.textPrimary,
            
            marginLeft: 10,
            
            width: '90%',
          }}
          placeholder="Phone Number"
          placeholderTextColor={currentColors.textSecondary}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
      </View>

      <View style={{ marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
        <MaterialCommunityIcons name="email" size={34} color={currentColors.textSecondary} style={{ width: '10%' }} />
        <TextInput
          style={{
            height: 40,
            borderBottomWidth: 1,
            borderBottomColor: currentColors.textSecondary,
            marginBottom: 10,
            color: currentColors.textPrimary,
            
            marginLeft: 10,
            
            width: '90%',
          }}
          placeholder="Email"
          placeholderTextColor={currentColors.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={{ marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
        <MaterialCommunityIcons name="circle" size={34} color={currentColors.textSecondary} style={{ width: '10%' }} />
        <View style={{height: 40,borderBottomWidth: 1,borderBottomColor: currentColors.textSecondary,marginBottom: 10, marginHorizontal: 10,width: '70%', }}>
          <Text style={{color: currentColors.textPrimary,}} >Satus</Text>
          <Text style={{color: currentColors.textSecondary}}>{status}</Text>
        </View>
        
        <TouchableOpacity onPress={()=>setOpenStatus(true)}>
          <MaterialCommunityIcons name="plus" size={34} color={currentColors.textSecondary} />
        </TouchableOpacity>
      </View>
      <Status visible={openStatus} onClose={closeStatus} status={status} setStatus={setStatus} currentColors={currentColors}/>

        <JobInputs currentColors={currentColors} />

        <TouchableOpacity onPress={handleSave} style={{ alignSelf: 'flex-end', backgroundColor: currentColors.primary, padding: 10 }}>
          <Text style={{ color: currentColors.buttonText }}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </ModalRightToLeft>
  );
}
