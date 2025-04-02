import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, ScrollView, TextInput, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { ProjectFormProps } from '../../../Messages/Chats/chatInterfaces';
import SkillsSelection from '../skillsRenders';
import Form from './form';
import { handleAddProject, handleUpdateProject, renderSkillItem } from '../../profileActions';
import handleFilePicker, { getFileIcon, handleMediaTypeChange, handleRemoveFile } from './action';

export default function index({
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
  const [lowerForm, setLowerForm] = useState<{ endDate: string; isCurrent: boolean; selectedCompanies: []; selectedContributors: []; startDate: string }[]>([]);
  const [mediaLink, setMediaLink] = useState<any>('');
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
      setSelectedFiles(projectToEdit.media)
      setMediaLink(media)
      setLowerForm([{ endDate: projectToEdit.endDate, isCurrent: projectToEdit.isCurrent, selectedCompanies: projectToEdit.selectedCompanies, selectedContributors: projectToEdit.selectedContributors, startDate: projectToEdit.startDate }])
    }
    setRefreshKey(prevKey => prevKey + 1);
    
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
          skills={skills}
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
            onPress={() => handleMediaTypeChange({type:'link', setMediaType, setProjectForm, projectForm, setMediaLink})}
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
            onPress={() => handleMediaTypeChange({type:'file', setMediaType, setProjectForm, projectForm, setMediaLink})}
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
              onPress={() => handleFilePicker({selectedFiles, projectForm, setSelectedFiles, setProjectForm})}
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
                    {getFileIcon({mimeType:file.mimeType, currentColors})}
                    <Text style={{ color: currentColors.textPrimary, marginLeft: 5, maxWidth: 100 }} numberOfLines={1}>
                      {file.name}
                    </Text>
                    <TouchableOpacity onPress={() => handleRemoveFile({uri:file.uri, selectedFiles, projectForm, setSelectedFiles, setProjectForm})} style={{ marginLeft: 10 }}>
                      <Ionicons name="close-circle" size={25} color={currentColors.danger} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          </>
        )}

        <Form lowerForm={lowerForm} setLowerForm={setLowerForm} setSelectEdit={setSelectEdit} selectEdit={selectEdit} clearForm={clearForm} />

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
