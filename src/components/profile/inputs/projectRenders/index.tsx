import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, ScrollView, TextInput, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Education, ProjectFormProps } from '../../../Messages/Chats/chatInterfaces';
import SkillsSelection from '../skillsRenders';
import { handleAddEntry, handleUpdateEntry, renderSkillItem } from '../../profileActions';
import handleFilePicker, { getFileIcon, handleMediaTypeChange, handleRemoveFile } from './action';
import { DynamicFormField } from '../educationRenders/interface';
import DynamicForm from '@/models/DynamicForm';

export default function Index({
  skills,
  projectForm,
  setProjectForm,
  currentColors,
  startSelect,
  setStartSelect,
  setSkills,
  projects,
  setProjects,
  setSelectEdit,
  selectEdit,
  setOpenAnyModal,
  clearForm,
  setClearForm, toggleProjects
}: ProjectFormProps) {
  const [mediaLink, setMediaLink] = useState<any>('');
  const [editingProject, setEditingProject] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [mediaType, setMediaType] = useState(projectForm?.mediaType || 'file');
  const [media, setMedia] = useState(projectForm?.media || '');
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<{ uri: string; name: string; mimeType: string }[]>(projectForm?.files || []);

  

  // Load data if editing a project
  useEffect(() => {
    if (selectEdit.length > 0) {
      const projectToEdit = selectEdit.find(item => item.name && item.type=='project');
      setEditingProject(projectToEdit)
      setMediaType(projectToEdit.mediaType)
      setProjectForm(projectToEdit);
      setMedia(projectToEdit.media)
      setSelectedFiles(projectToEdit.media || [])
      setMediaLink(media)
    }
    setRefreshKey(prevKey => prevKey + 1);
    
  }, [selectEdit]);


  useEffect(() =>{
    if(clearForm){
      setProjectForm(
        { id: 1, 
        name: '',
        description: '',
        skills: [], // Reset skills to the passed skills
        selectedSkills: [],
        mediaType: 'file',
        media: '',
        isCurrent: false,
        endDate: '',
        selectedCompanies: [],
        selectedContributors: [],
        startDate: '',
        files: [],
        type: 'project',}
      )
    }
  },[clearForm])

  const setValue = <T extends keyof Education>(field: T, value: Education[T]) => {
      setProjectForm({
        ...projectForm,
        [field]: value,
      });
      console.log('Setting value:', field, value);
      if (field === 'isCurrent') {
        setIsVisible(!value);
      }
    };
    
   
  
    const dynamicFields: DynamicFormField[] = [
      { name: 'name', label: 'Project Name', type: 'text', value: (value) => setValue('name', value), placeholder: 'Enter Project name', required: true, maxLength: 100 },
      { name: 'description', label: 'Description', type: 'textarea', value: (value) => setValue('description', value), placeholder: 'Enter description', required: true, numberOfLines: 4 },
      
      {name: 'mediaType', label: 'Media Type', type: 'tabchoice',
        options: [
          { name: 'Link', label: 'Link', type: 'url', value: (value: any) => setValue('media', value), placeholder: 'Enter media URL', required: false },
          { name: 'Files', label: 'Files', type: 'file', value: (value: any) => setValue('files', value), required: false }
        ],value: (value) => setValue('mediaType', value),required: true
      },
  
      { name: 'company', label: 'Company',type: 'typeSelector', placeholder: 'Type or select company', options: ['Google', 'Microsoft', 'Amazon', 'Tesla', 'OpenAI'], value: (value) => setValue('lectures', value), required: false}, 
      { name: 'contributors', label: 'Contributors',type: 'typeSelector', placeholder: 'Type or select contributor', options: ['John Doe', 'Jane Smith', 'Elon Musk', 'Mark Zuckerberg', 'Sundar Pichai'], value: (value) => setValue('mentors', value), required: false},
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
          {projects.map((project, index) => (
            <View key={index} style={{ flexDirection: 'row', marginVertical: 5 }}>
              {renderSkillItem(project, index, currentColors, projects, setProjects, setStartSelect, selectEdit, setSelectEdit, setOpenAnyModal)}
            </View>
          ))}
        </ScrollView>

        <DynamicForm 
          fields={dynamicFields}  
          formData ={projectForm}
          setFormData={setProjectForm}
          setAction={setIsVisible}
        />

        <SkillsSelection
          skills={skills}
          selectedSkills={projectForm?.selectedSkills}
          setSelectedSkills={(skills) => setProjectForm({ ...projectForm, selectedSkills: skills })}
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
              handleUpdateEntry(projectForm, selectedFiles, projects, setProjects, setProjectForm, setSelectedFiles, setSelectEdit, selectEdit, editingProject, setClearForm, toggleProjects, 'project');
            } else {
              handleAddEntry(projectForm,  projects, setProjects, setProjectForm, setSelectedFiles, 'project');
            }
          }}
          style={{ backgroundColor: currentColors.primary, padding: 12, borderRadius: 5, alignItems: 'center', marginTop: 10 }}
        >
          <Text style={{ color: 'white' }}>{selectEdit.length > 0 ? 'Update Project' : 'Add Project'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
