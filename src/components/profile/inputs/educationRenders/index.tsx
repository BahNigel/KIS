import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, ScrollView, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Education, EducationFormProps } from '../../../Messages/Chats/chatInterfaces';
import SkillsSelection from '../skillsRenders';
import { handleAddEntry, handleUpdateEntry, renderSkillItem } from '../../profileActions';
import { DynamicFormField } from './interface'
import DynamicForm from '@/models/DynamicForm';

export default function Index({
  skills,
  educationForm,
  setEducationForm,
  currentColors,
  startSelect,
  setStartSelect,
  setSkills,
  education,
  setEducation,
  setSelectEdit,
  selectEdit,
  setOpenAnyModal,
  clearForm,
  setClearForm,
  toggleEducation
}: EducationFormProps) {
  const [mediaLink, setMediaLink] = useState<any>('');
  const [editingEducation, setEditingEducation] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [mediaType, setMediaType] = useState(educationForm?.mediaType || 'file');
  const [selectedFiles, setSelectedFiles] = useState<{ uri: string; name: string; mimeType: string }[]>(educationForm?.files || []);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (selectEdit.length > 0) {
      const educationToEdit = selectEdit.find(item => item.name && item.type === 'education');
      if (educationToEdit) {
        setEditingEducation(educationToEdit);
        setMediaType(educationToEdit.mediaType);
        setEducationForm(educationToEdit);
        setSelectedFiles(educationToEdit.media || []);
        setMediaLink(educationToEdit.media || '');
      }
    }
    setRefreshKey(prevKey => prevKey + 1);
  }, [selectEdit]);

  useEffect(() => {
    if (clearForm) {
      setEducationForm({
        id: 1,
        name: '',
        degree: '',
        description: '',
        field: '',
        skills: [],
        selectedSkills: [],
        mediaType: 'file',
        media: '',
        isCurrent: false,
        endDate: '',
        startDate: '',
        grades: '',
        activites: '',
        files: [],
        type: 'education',
        lectures: '',
        mentors: '',
      });
    }
  }, [clearForm]);

  const setValue = <T extends keyof Education>(field: T, value: Education[T]) => {
    setEducationForm({
      ...educationForm,
      [field]: value,
    });
    console.log('Setting value:', field, value);
    if (field === 'isCurrent') {
      setIsVisible(!value);
    }
  };
  
 

  const dynamicFields: DynamicFormField[] = [
    { name: 'name', label: 'Institution Name', type: 'text', value: (value) => setValue('name', value), placeholder: 'Enter institution name', required: true, maxLength: 100 },
    { name: 'degree', label: 'Degree', type: 'text', value: (value) => setValue('degree', value), placeholder: 'Enter degree', required: true, maxLength: 100 },
    { name: 'field', label: 'Field of Study', type: 'text', value: (value) => setValue('field', value), placeholder: 'Enter field of study', required: true },
    { name: 'grades', label: 'Grades', type: 'text', value: (value) => setValue('grades', value), placeholder: 'Enter grades or GPA', required: true },
    { name: 'description', label: 'Description', type: 'textarea', value: (value) => setValue('description', value), placeholder: 'Enter description', required: true, numberOfLines: 4 },
    
    {name: 'mediaType', label: 'Media Type', type: 'tabchoice',
      options: [
        { name: 'Link', label: 'Link', type: 'url', value: (value: any) => setValue('media', value), placeholder: 'Enter media URL', required: false },
        { name: 'Files', label: 'Files', type: 'file', value: (value: any) => setValue('files', value), required: false }
      ],value: (value) => setValue('mediaType', value),required: true
    },

    { name: 'lectures', label: 'Lectures',type: 'typeSelector', placeholder: 'Type or select lectures', options: ['Math 101', 'History 202', 'Physics 303', 'Computer Science 404'], value: (value) => setValue('lectures', value), required: false}, 
    { name: 'mentors', label: 'Mentors',type: 'typeSelector', placeholder: 'Type or select mentors', options: ['Dr. John Doe', 'Prof. Jane Smith', 'Dr. Elon Musk', 'Prof. Mark Zuckerberg'], value: (value) => setValue('mentors', value), required: false},
    { name: 'startDate', label: 'Start Date', type: 'date', value: (value) => setValue('startDate', value), placeholder: 'Select start date', required: true },
    { name: 'isCurrent', label: 'Is Current', type: 'checkbox', value: (value) => setValue('isCurrent', value), isVisible: isVisible, required: false, canSetaction: true },];

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
          {education.map((edu, index) => (
            <View key={index} style={{ flexDirection: 'row', marginVertical: 5 }}>
              {renderSkillItem(edu, index, currentColors, education, setEducation, setStartSelect, selectEdit, setSelectEdit, setOpenAnyModal)}
            </View>
          ))}
        </ScrollView>

        <DynamicForm 
          fields={dynamicFields}  
          formData ={educationForm}
          setFormData={setEducationForm}
          setAction={setIsVisible}
        />
        <SkillsSelection
          skills={skills}
          selectedSkills={educationForm?.selectedSkills}
          setSelectedSkills={(skills) => setEducationForm({ ...educationForm, selectedSkills: skills })}
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
              handleUpdateEntry(educationForm, selectedFiles, education, setEducation, setEducationForm, setSelectedFiles, setSelectEdit, selectEdit, editingEducation, setClearForm, toggleEducation, 'education');
            } else {
              handleAddEntry(educationForm, education, setEducation, setEducationForm, setSelectedFiles, 'education');
            }
          }}
          style={{ backgroundColor: currentColors.primary, padding: 12, borderRadius: 5, alignItems: 'center', marginVertical: 10 }}
        >
          <Text style={{ color: 'white' }}>{selectEdit.length > 0 ? 'Update Education' : 'Add Education'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
