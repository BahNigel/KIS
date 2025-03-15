import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, ScrollView, TextInput, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { ProjectFormProps } from '../../../Messages/Chats/chatInterfaces';
import SkillsSelection from '../skillsRenders';
import ContinueProjectForm from './form1';
import { handleAddProject, handleUpdateProject, renderSkillItem } from '../../profileActions';

export default function ProjectForm({
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
  const [lowerForm, setLowerForm] = useState<{ endDate: string; isCurrent: boolean; selectedCompanies: []; selectedContributors: []; startDate: string }[]>([]);
  const [mediaLink, setMediaLink] = useState<string>('');
  const [editingProject, setEditingProject] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [mediaType, setMediaType] = useState(projectForm?.mediaType || 'file');
  const [media, setMedia] = useState(projectForm?.media || '');
  const [selectedFiles, setSelectedFiles] = useState<{ uri: string; name: string; mimeType: string }[]>(projectForm?.files || []);

  

  // Load data if editing a project
  useEffect(() => {
    if (selectEdit.length > 0) {
      const projectToEdit = selectEdit.find(item => item.name && item.type=='project');
      setEditingProject(projectToEdit)
      setMediaType(projectToEdit.mediaType)
      setProjectForm(projectToEdit);
      setMedia(projectToEdit.media)
      setMediaLink(media)
      setLowerForm([{ endDate: projectToEdit.endDate, isCurrent: projectToEdit.isCurrent, selectedCompanies: projectToEdit.selectedCompanies, selectedContributors: projectToEdit.selectedContributors, startDate: projectToEdit.startDate }])
      
    }
    setRefreshKey(prevKey => prevKey + 1);
    console.log("=================================================================================: ", selectEdit)
  }, [selectEdit]);

  useEffect(() => {
    setProjectForm({
      ...projectForm,
      ...(Array.isArray(lowerForm) ? lowerForm[0] : lowerForm),
    });
    
  }, [lowerForm, projects]);

  useEffect(() =>{
    if(clearForm){
      setLowerForm([]);
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

  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        multiple: true
      });

      if (result.canceled) {
        Alert.alert('File Picker', 'No file selected or file picker was canceled.');
        return;
      }

      const newFiles = result.assets
        .filter((file) => !selectedFiles.some((existingFile) => existingFile.name === file.name))
        .map((file) => ({
          uri: file.uri,
          name: file.name,
          mimeType: file.mimeType || ''
        }));

      if (newFiles.length === 0) {
        Alert.alert('Duplicate File', 'Some files were not added because they have the same name as already selected files.');
        return;
      }

      const updatedFiles = [...selectedFiles, ...newFiles];
      setSelectedFiles(updatedFiles);
      setProjectForm({ ...projectForm, media: updatedFiles.map((file) => file.name).join(', ') });
    } catch (error) {
      console.error('Error picking files:', error);
      Alert.alert('Error', 'There was an issue selecting files. Please try again.');
    }
  };

  const handleRemoveFile = (uri: string) => {
    const updatedFiles = selectedFiles.filter((file) => file.uri !== uri);
    setSelectedFiles(updatedFiles);
    setProjectForm({ ...projectForm, media: updatedFiles.map((file) => file.name).join(', ') });
  };

  const handleMediaTypeChange = (type: 'link' | 'file') => {
    setMediaType(type);
    setProjectForm({ ...projectForm, media: '', mediaType: type });
    if (type === 'link') {
      setMediaLink('');
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('image')) {
      return <Ionicons name="image" size={30} color={currentColors.textPrimary} />;
    } else if (mimeType.includes('pdf')) {
      return <Ionicons name="document-text" size={30} color="red" />;
    } else if (mimeType.includes('msword') || mimeType.includes('wordprocessingml')) {
      return <Ionicons name="document" size={30} color="blue" />;
    }
    return <Ionicons name="document" size={30} color={currentColors.textPrimary} />;
  };

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

        <TextInput
          placeholder="Project Name"
          placeholderTextColor={currentColors.textSecondary}
          value={projectForm.name}
          onChangeText={(text) => setProjectForm({ ...projectForm, name: text })}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: currentColors.textSecondary,
            color: currentColors.textPrimary,
            marginBottom: 10
          }}
        />

        <TextInput
          placeholder="Description"
          placeholderTextColor={currentColors.textSecondary}
          value={projectForm.description}
          onChangeText={(text) => setProjectForm({ ...projectForm, description: text })}
          multiline
          style={{
            borderBottomWidth: 1,
            borderBottomColor: currentColors.textSecondary,
            color: currentColors.textPrimary,
            marginBottom: 10
          }}
        />

        <SkillsSelection
          skills={projectForm.skills}
          selectedSkills={projectForm.selectedSkills}
          setSelectedSkills={(skills) => setProjectForm({ ...projectForm, selectedSkills: skills })}
          currentColors={currentColors}
          startSelect={startSelect}
          setStartSelect={setStartSelect}
          setSkills={setSkills}
          setSelectEdit={setSelectEdit}
          selectEdit={selectEdit}
          setOpenAnyModal={setOpenAnyModal}
        />

        <Text style={{ marginVertical: 5, color: currentColors.textSecondary }}>Media Type</Text>
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <TouchableOpacity
            onPress={() => handleMediaTypeChange('link')}
            style={{
              backgroundColor: mediaType === 'link' ? currentColors.primary : currentColors.card,
              padding: 12,
              borderRadius: 5,
              marginRight: 10,
              flex: 1,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: mediaType === 'link' ? 'white' : currentColors.textPrimary }}>Link</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleMediaTypeChange('file')}
            style={{
              backgroundColor: mediaType === 'file' ? currentColors.primary : currentColors.card,
              padding: 12,
              borderRadius: 5,
              flex: 1,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: mediaType === 'file' ? 'white' : currentColors.textPrimary }}>File</Text>
          </TouchableOpacity>
        </View>

        {mediaType === 'link' && (
          <TextInput
            placeholder="Enter Media Link"
            placeholderTextColor={currentColors.textSecondary}
            value={mediaLink}
            onChangeText={(text) => {
              setMediaLink(text);
              setProjectForm({ ...projectForm, media: text });
            }}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: currentColors.textSecondary,
              color: currentColors.textPrimary,
              marginBottom: 10
            }}
          />
        )}

        {mediaType === 'file' && (
          <>
            <TouchableOpacity
              onPress={handleFilePicker}
              style={{
                backgroundColor: currentColors.primary,
                padding: 12,
                borderRadius: 5,
                marginBottom: 10,
                alignItems: 'center'
              }}
            >
              <Text style={{ color: 'white' }}>
                {selectedFiles.length > 0 ? `${selectedFiles.length} File(s) Selected` : 'Select Files'}
              </Text>
            </TouchableOpacity>

            <View style={{ backgroundColor: currentColors.card, padding: 10, borderRadius: 5 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {selectedFiles.map((file, index) => (
                  <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                    {getFileIcon(file.mimeType)}
                    <Text style={{ color: currentColors.textPrimary, marginLeft: 5, maxWidth: 100 }} numberOfLines={1}>
                      {file.name}
                    </Text>
                    <TouchableOpacity onPress={() => handleRemoveFile(file.uri)} style={{ marginLeft: 10 }}>
                      <Ionicons name="close-circle" size={25} color={currentColors.danger} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          </>
        )}

        <ContinueProjectForm lowerForm={lowerForm} setLowerForm={setLowerForm} setSelectEdit={setSelectEdit} selectEdit={selectEdit} clearForm={clearForm} />

        <TouchableOpacity
          onPress={() => {
            if (selectEdit.length > 0) {
              handleUpdateProject(projectForm, selectedFiles, lowerForm, projects, setProjects, setProjectForm, setSelectedFiles, setLowerForm, setSelectEdit, selectEdit, editingProject, setClearForm, toggleProjects);
            } else {
              handleAddProject(projectForm,  projects, setProjects, setProjectForm, setSelectedFiles, setLowerForm);
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
