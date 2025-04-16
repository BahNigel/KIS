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
import ExperienceForm from './experienceRenders';
import { Experience } from '../../Messages/Chats/chatInterfaces';

export default function Experiences({
  visible,
  onClose,
  skills,
  setSkills,
  experience,
  setExperience,
  currentColors,
  startSelect,
  setStartSelect,
  setSelectEdit,
  selectEdit,
  setOpenAnyModal,
  experienceForm,
  setExperienceForm,
  toggleExperience,
}: {
  visible: boolean;
  onClose: () => void;
  selectEdit: any[];
  skills: { name: string; percentage: string; skillType: string; type: string }[];
  setSkills: (value: { name: string; percentage: string; type: string }[]) => void;
  experience: Experience[];
  setExperience: (value: Experience[]) => void;
  currentColors: any;
  startSelect: boolean;
  experienceForm: Experience;
  toggleExperience: (value: boolean) => void;
  setExperienceForm: (form: any) => void;
  setStartSelect: (value: boolean) => void;
  setSelectEdit: (value: any[]) => void;
  setOpenAnyModal: (value: string) => void;
}) {
  const [clearForm, setClearForm] = useState(false);

  useEffect(() => {
    setExperienceForm((prevData: any) => {
      return { ...prevData, skills: skills };
    });
  }, [skills]);

  useEffect(() => {
    if (visible) {
      setClearForm(false);
    }
  }, [visible]);

  const handleAddExperience = () => {
    if (!experienceForm.company || !experienceForm.position) return;

    setExperience([...experience, experienceForm]);
    resetForm();
  };

  const resetForm = () => {
    setExperienceForm({
      id: 1,
      company: '',
      position: '',
      description: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      type: 'experience',
    });
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExperience = experience.filter((_, i) => i !== index);
    setExperience(updatedExperience);
  };

  const submit = () => {
    setClearForm(true);
    onClose();
  };

  return (
    <ModalRightToLeft
      visible={visible}
      onClose={onClose}
      name="Edit Experience"
      headerContent={
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: currentColors.textPrimary, fontWeight: 'bold' }} onPress={onClose}>
            Edit Experience
          </Text>
          <TouchableOpacity onPress={submit}>
            <Icon name="check" size={24} color={currentColors.primary} />
          </TouchableOpacity>
        </View>
      }
    >
      <View style={{ backgroundColor: currentColors.background, flex: 1, padding: 16 }}>
        {/* Horizontal Scroll for Added Experience */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
          {experience.map((exp, index) => (
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
              <Text style={{ color: currentColors.textPrimary, marginRight: 10 }}>{exp.company}</Text>
              <TouchableOpacity onPress={() => handleRemoveExperience(index)}>
                <Ionicons name="close-circle" size={20} color={currentColors.danger} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Experience Form Component */}
        <ExperienceForm
          visible={visible}
          skills={skills}
          experienceForm={experienceForm}
          setExperienceForm={setExperienceForm}
          currentColors={currentColors}
          handleAddExperience={handleAddExperience}
          startSelect={startSelect}
          setStartSelect={setStartSelect}
          setSkills={setSkills}
          experience={experience}
          setExperience={setExperience}
          setSelectEdit={setSelectEdit}
          selectEdit={selectEdit}
          setOpenAnyModal={setOpenAnyModal}
          clearForm={clearForm}
          setClearForm={setClearForm}
          toggleExperience={toggleExperience} type={'experience'}        />
      </View>
    </ModalRightToLeft>
  );
}
