import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import SkillsSelection from '../skillsRenders';
import { handleAddEntry, handleUpdateEntry, renderSkillItem } from '../../profileActions';
import { DynamicFormField } from './interface';
import DynamicForm from '@/models/DynamicForm';
import { Experience, ExperienceFormProps } from '@/src/components/Messages/Chats/chatInterfaces';

export default function Index({
  skills,
  experienceForm,
  setExperienceForm,
  currentColors,
  startSelect,
  setStartSelect,
  setSkills,
  experience,
  setExperience,
  setSelectEdit,
  selectEdit,
  setOpenAnyModal,
  clearForm,
  setClearForm,
  toggleExperience
}: ExperienceFormProps) {
  const [mediaLink, setMediaLink] = useState<any>('');
  const [editingExperience, setEditingExperience] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [mediaType, setMediaType] = useState(experienceForm?.mediaType || 'file');
  const [selectedFiles, setSelectedFiles] = useState<{ uri: string; name: string; mimeType: string }[]>(experienceForm?.files || []);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (selectEdit.length > 0) {
      console.log('selectEdit', selectEdit);
      const experienceToEdit = selectEdit.find(item => item.name && item.type === 'experience'); // You can rename type if needed
      console.log('experienceToEdit', experienceToEdit);
      if (experienceToEdit) {
        setEditingExperience(experienceToEdit);
        setMediaType(experienceToEdit.mediaType);
        setExperienceForm(experienceToEdit);
        console.log('experienceForm experience form hggggggghhhhhhhhhhhh$$$$$$$$$$$$$$$$$$$$$$$', experienceForm);
        setSelectedFiles(experienceToEdit.media || []);
        setMediaLink(experienceToEdit.media || '');
      }
    }
    setRefreshKey(prevKey => prevKey + 1);
    console.log('checking experience form now', experienceForm);
  }, [selectEdit]);

  useEffect(() => {
    if (clearForm) {
      setExperienceForm({
        id: 1,
        name: '',
        description: '',
        mediaType: 'file',
        media: '',
        files: [],
        startDate: '',
        endDate: '',
        isCurrent: false,
        skills: [],
        selectedSkills: [],
        type: 'experience',
        employmentType: '',
        location: '',
        whereFound: '',
        company: '',
        position: ''
      });
    }
  }, [clearForm]);

  const setValue = <T extends keyof Experience>(field: T, value: Experience[T]) => {
    setExperienceForm({
      ...experienceForm,
      [field]: value,
    });
    if (field === 'isCurrent') {
      setIsVisible(!value);
    }
  };

  const dynamicFields: DynamicFormField[] = [
    { name: 'name', label: 'Job Title', type: 'text', value: (value) => setValue('name', value), placeholder: 'Enter job title', required: true, maxLength: 100 },
    { name: 'employmentType', label: 'Employment Type', type: 'select', options: ['Full-time', 'Part-time', 'Self-employed', 'Freelance', 'Contract', 'Internship', 'Apprenticeship', 'Seasonal'], value: (value) => setValue('employmentType', value), placeholder: 'Full-time, Part-time, etc.', required: true },
    { name: 'company', label: 'Company Name', type: 'text', value: (value) => setValue('company', value), placeholder: 'Enter company name', required: true },
    { name: 'location', label: 'Location type', type: 'radio',options:['On-site', 'Hybrid', 'Remote'], value: (value) => setValue('location', value), placeholder: 'Enter location', required: true },
    { name: 'whereFound', label: 'Where You Found This Job', type: 'select', options: ['KIS', 'LinkedIn', 'Company website', 'Indeed', 'Other job sites', 'Referral', 'contacted by recuiter', 'Staffing agency', 'Others'], value: (value) => setValue('whereFound', value), placeholder: 'e.g. LinkedIn, Referral', required: true },
    { name: 'description', label: 'Job Description', type: 'textarea', value: (value) => setValue('description', value), placeholder: 'Enter job description', required: true, numberOfLines: 4 },
  
    { name: 'mediaType', label: 'Media Type', type: 'tabchoice',
      options: [
        { name: 'Link', label: 'Link', type: 'url', value: (value: any) => setValue('media', value), placeholder: 'Enter media URL', required: false },
        { name: 'Files', label: 'Files', type: 'file', value: (value: any) => setValue('files', value), required: false }
      ], value: (value) => setValue('mediaType', value), required: true
    },
    { name: 'startDate', label: 'Start Date', type: 'date', value: (value) => setValue('startDate', value), placeholder: 'Select start date', required: true },
    { name: 'isCurrent', label: 'Is Current', type: 'checkbox', value: (value) => setValue('isCurrent', value), isVisible: isVisible, required: false, canSetaction: true }
  ];
  

  if (!isVisible) {
    dynamicFields.splice(dynamicFields.findIndex(field => field.name === 'isCurrent'), 0, {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      value: (value) => setValue('endDate', value),
      placeholder: 'Select end date',
      required: true
    });
  }

  return (
    <View key={refreshKey}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {experience.map((exp, index) => (
            <View key={index} style={{ flexDirection: 'row', marginVertical: 5 }}>
              {renderSkillItem(exp, index, currentColors, experience, setExperience, setStartSelect, selectEdit, setSelectEdit, setOpenAnyModal)}
            </View>
          ))}
        </ScrollView>

        <DynamicForm
          fields={dynamicFields}
          formData={experienceForm}
          setFormData={setExperienceForm}
          setAction={setIsVisible}
        />
        <SkillsSelection
          skills={skills}
          selectedSkills={experienceForm?.selectedSkills}
          setSelectedSkills={(skills) => setExperienceForm({ ...experienceForm, selectedSkills: skills })}
          currentColors={currentColors}
          startSelect={startSelect}
          setStartSelect={setStartSelect}
          setSkills={setSkills}
          setSelectEdit={setSelectEdit}
          selectEdit={selectEdit}
          setOpenAnyModal={setOpenAnyModal}
        />

        <TouchableOpacity
          onPress={() => {
            if (selectEdit.length > 0) {
              handleUpdateEntry(experienceForm, selectedFiles, experience, setExperience, setExperienceForm, setSelectedFiles, setSelectEdit, selectEdit, editingExperience, setClearForm, toggleExperience, 'experience');
            } else {
              handleAddEntry(experienceForm, experience, setExperience, setExperienceForm, setSelectedFiles, 'experience');
            }
          }}
          style={{ backgroundColor: currentColors.primary, padding: 12, borderRadius: 5, alignItems: 'center', marginVertical: 10 }}
        >
          <Text style={{ color: 'white' }}>{selectEdit.length > 0 ? 'Update Experience' : 'Add Experience'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
