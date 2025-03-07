import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, ScrollView, TextInput, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { ProjectFormProps } from '../../../Messages/Chats/chatInterfaces';
import SkillsSelection from '../skillsRenders';
import ContinueProjectForm from './continueProjectForm';
import { handleAddProject, renderSkillItem } from '../../profileActions';

export default function ProjectForm({ projectForm, setProjectForm, currentColors, startSelect, setStartSelect, setSkills, projects, setProjects }: ProjectFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<{ uri: string; name: string; mimeType: string }[]>([]);
  const [lowerForm, setLowerForm] = useState<{ endDate: string; isCurrent: Boolean; selectedCompanies: []; selectedContributors: []; startDate: string }[]>([]);


  // Log `lowerForm` data whenever it changes
  useEffect(() => {
    console.log('Lower Form Data:', lowerForm);
    console.log('project Form Data: ', projectForm);
    console.log('projects wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww: ', projects);
    setProjectForm({ ...projectForm, ...lowerForm });
  }, [lowerForm, projects]);

  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        multiple: true,
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
          mimeType: file.mimeType || '',
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
    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Display added projects */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {projects.map((project, index) => (
          <View key={index} style={{ flexDirection: 'row', marginVertical: 5 }}>
             {renderSkillItem(project,index,currentColors,projects,setProjects, setStartSelect, )}
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
            marginBottom: 10,
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
            marginBottom: 10,
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
        />

        {/* Media Type Selection */}
        <Text style={{ marginVertical: 5, color: currentColors.textSecondary }}>Media</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <TouchableOpacity
            onPress={() => {
              setSelectedFiles([]);
              setProjectForm({ ...projectForm, mediaType: 'link', media: '' });
            }}
            style={{
              flexDirection: 'row',
              backgroundColor: projectForm.mediaType === 'link' ? currentColors.primary : currentColors.card,
              padding: 8,
              borderRadius: 8,
              marginRight: 10,
              alignItems: 'center',
            }}
          >
            <Ionicons name="link" size={20} color={projectForm.mediaType === 'link' ? 'white' : currentColors.textPrimary} />
            <Text style={{ color: projectForm.mediaType === 'link' ? 'white' : currentColors.textPrimary, marginLeft: 5 }}>Link</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setProjectForm({ ...projectForm, mediaType: 'file', media: '' })}
            style={{
              flexDirection: 'row',
              backgroundColor: projectForm.mediaType === 'file' ? currentColors.primary : currentColors.card,
              padding: 8,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Ionicons name="document" size={20} color={projectForm.mediaType === 'file' ? 'white' : currentColors.textPrimary} />
            <Text style={{ color: projectForm.mediaType === 'file' ? 'white' : currentColors.textPrimary, marginLeft: 5 }}>File</Text>
          </TouchableOpacity>
        </View>

        {/* Link Input */}
        {projectForm.mediaType === 'link' && (
          <TextInput
            placeholder="Enter Link"
            placeholderTextColor={currentColors.textSecondary}
            value={projectForm.media}
            onChangeText={(text) => setProjectForm({ ...projectForm, media: text })}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: currentColors.textSecondary,
              color: currentColors.textPrimary,
              marginBottom: 10,
              padding: 8,
            }}
          />
        )}

        {/* File Input */}
        {projectForm.mediaType === 'file' && (
          <>
            <TouchableOpacity
              onPress={handleFilePicker}
              style={{
                backgroundColor: currentColors.primary,
                padding: 12,
                borderRadius: 5,
                marginBottom: 10,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white' }}>{selectedFiles.length > 0 ? `${selectedFiles.length} File(s) Selected` : 'Select Files'}</Text>
            </TouchableOpacity>

            {/* Display selected files */}
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

        <ContinueProjectForm lowerForm={lowerForm} setLowerForm={setLowerForm} />

        <TouchableOpacity onPress={()=>handleAddProject(
          projectForm,
            selectedFiles,
            lowerForm,
            projects,
            setProjects,
            setProjectForm,
            setSelectedFiles,
            setLowerForm
        )} style={{ backgroundColor: currentColors.primary, padding: 12, borderRadius: 5, alignItems: 'center', marginTop: 10 }}>
          <Text style={{ color: 'white' }}>Add Project</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
