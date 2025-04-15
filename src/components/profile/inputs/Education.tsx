import React, { useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ModalRightToLeft from '@/models/ModalRightToLeft';
import Icon from 'react-native-vector-icons/FontAwesome';
import Index from './educationRenders';
import { Education } from '../../Messages/Chats/chatInterfaces';

export default function Educations({
  visible,
  onClose,
  skills,
  setSkills,
  education,
  setEducation,
  currentColors,
  startSelect,
  setStartSelect,
  setSelectEdit,
  selectEdit,
  setOpenAnyModal,
  educationForm,
  setEducationForm,
  toggleEducation,
}: {
  visible: boolean;
  onClose: () => void;
  selectEdit: any[];
  skills: { name: string; percentage: string; skillType: string; type: string }[];
  setSkills: (value: { name: string; percentage: string; type: string }[]) => void;
  education: Education[];
  setEducation: (value: Education[]) => void;
  currentColors: any;
  startSelect: boolean;
  educationForm: Education;
  toggleEducation: (value: boolean) => void;
  setEducationForm: (form: any) => void;
  setStartSelect: (value: boolean) => void;
  setSelectEdit: (value: any[]) => void;
  setOpenAnyModal: (value: string) => void;
}) {
  
  const [clearForm, setClearForm] = useState(false);

  useEffect(() => {
    setEducationForm((prevData: any) => {
      return { ...prevData, skills: skills };
    });
  }, [skills]);

  useEffect(() => {
    if (visible) {
      setClearForm(false);
    }
  }, [visible]);

  const handleAddEducation = () => {
    if (!educationForm.name || !educationForm.degree) return;

    setEducation([...education, educationForm]);
    resetForm();
  };

  const resetForm = () => {
    setEducationForm({
      id: 1,
      name: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      type: 'education',
    });
  };

  const handleRemoveEducation = (index: number) => {
    const updatedEducation = education.filter((_, i) => i !== index);
    setEducation(updatedEducation);
  };

  const submit = () => {
    setClearForm(true);
    onClose();
  };

  return (
    <ModalRightToLeft
      visible={visible}
      onClose={onClose}
      name="Edit Education"
      headerContent={
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: currentColors.textPrimary, fontWeight: 'bold' }} onPress={onClose}>
            Edit Education
          </Text>
          <TouchableOpacity onPress={submit}>
            <Icon name="check" size={24} color={currentColors.primary} />
          </TouchableOpacity>
        </View>
      }
    >
      <View style={{ backgroundColor: currentColors.background, flex: 1, padding: 16 }}>
        {/* Horizontal Scroll for Added Education */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
          {education.map((edu, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: currentColors.card,
                padding: 10,
                borderRadius: 10,
                marginRight: 10,
              }}
            >
              <Text style={{ color: currentColors.textPrimary, marginRight: 10 }}>{edu.name}</Text>
              <TouchableOpacity onPress={() => handleRemoveEducation(index)}>
                <Ionicons name="close-circle" size={20} color={currentColors.danger} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Education Form Component */}
        <Index
         visible={visible}
          skills={skills}
          educationForm={educationForm}
          setEducationForm={setEducationForm}
          currentColors={currentColors}
          handleAddEducation={handleAddEducation}
          startSelect={startSelect}
          setStartSelect={setStartSelect}
          setSkills={setSkills}
          education={education}
          setEducation={setEducation}
          setSelectEdit={setSelectEdit}
          selectEdit={selectEdit}
          setOpenAnyModal={setOpenAnyModal}
          clearForm={clearForm}
          setClearForm={setClearForm}
          toggleEducation={toggleEducation}
        />
      </View>
    </ModalRightToLeft>
  );
}
