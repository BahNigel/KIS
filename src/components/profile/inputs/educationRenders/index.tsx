import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, ScrollView, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { EducationFormProps } from '../../../Messages/Chats/chatInterfaces';
import SkillsSelection from '../skillsRenders';
import { handleAddEntry, handleUpdateEntry, renderSkillItem } from '../../profileActions';
import handleFilePicker, { getFileIcon, handleMediaTypeChange, handleRemoveFile } from './action';
import EducationForm from './form';

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
  const [lowerForm, setLowerForm] = useState<{ endDate: string; isCurrent: boolean; startDate: string }[]>([]);
  const [mediaLink, setMediaLink] = useState<any>('');
  const [editingEducation, setEditingEducation] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [mediaType, setMediaType] = useState(educationForm?.mediaType || 'file');
  const [media, setMedia] = useState(educationForm?.media || '');
  const [selectedFiles, setSelectedFiles] = useState<{ uri: string; name: string; mimeType: string }[]>(educationForm?.files || []);

  // Load data if editing an education entry
  useEffect(() => {
    if (selectEdit.length > 0) {
      const educationToEdit = selectEdit.find(item => item.name && item.type === 'education');
      if (educationToEdit) {
        setEditingEducation(educationToEdit);
        setMediaType(educationToEdit.mediaType);
        setEducationForm(educationToEdit);
        setMedia(educationToEdit.media);
        setSelectedFiles(educationToEdit.media || []);
        setMediaLink(media);
        setLowerForm([{ 
          endDate: educationToEdit.endDate, 
          isCurrent: educationToEdit.isCurrent, 
          startDate: educationToEdit.startDate 
        }]);
      }
    }
    setRefreshKey(prevKey => prevKey + 1);
    console.log("&&&&&&&&&&&&************((((((((((((((()))))))))))))))))",)
  }, [selectEdit]);

  useEffect(() => {
    setEducationForm({
      ...educationForm,
      ...(Array.isArray(lowerForm) ? lowerForm[0] : lowerForm),
    });
  }, [lowerForm, education]);

  useEffect(() => {
    if (clearForm) {
      setLowerForm([]);
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
        grades: '', // 👈 Added grades field here
        activites: '',
        files: [],
        type: 'education',
      });
    }
  }, [clearForm]);

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

        <TextInput
          placeholder="Institution Name"
          placeholderTextColor={currentColors.textSecondary}
          value={educationForm?.name}
          onChangeText={(text) => setEducationForm({ ...educationForm, name: text })}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: currentColors.textSecondary,
            color: currentColors.textPrimary,
            marginBottom: 10,
          }}
        />

        <TextInput
          placeholder="Degree"
          placeholderTextColor={currentColors.textSecondary}
          value={educationForm?.degree}
          onChangeText={(text) => setEducationForm({ ...educationForm, degree: text })}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: currentColors.textSecondary,
            color: currentColors.textPrimary,
            marginBottom: 10,
          }}
        />

        <TextInput
          placeholder="Field of Study"
          placeholderTextColor={currentColors.textSecondary}
          value={educationForm?.field}
          onChangeText={(text) => setEducationForm({ ...educationForm, field: text })}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: currentColors.textSecondary,
            color: currentColors.textPrimary,
            marginBottom: 10,
          }}
        />

        <TextInput
          placeholder="Grades" // 👈 Added Grades Input
          placeholderTextColor={currentColors.textSecondary}
          value={educationForm?.grades}
          onChangeText={(text) => setEducationForm({ ...educationForm, grades: text })}
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
          value={educationForm?.description}
          onChangeText={(text) => setEducationForm({ ...educationForm, description: text })}
          multiline
          style={{
            borderBottomWidth: 1,
            borderBottomColor: currentColors.textSecondary,
            color: currentColors.textPrimary,
            marginBottom: 10,
          }}
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

        <Text style={{ marginVertical: 5, color: currentColors.textSecondary }}>Media Type</Text>
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <TouchableOpacity
            onPress={() => handleMediaTypeChange({ type: 'link', setMediaType, setEducationForm, educationForm, setMediaLink })}
            style={{
              backgroundColor: mediaType === 'link' ? currentColors.primary : currentColors.card,
              padding: 12,
              borderRadius: 5,
              marginRight: 10,
              flex: 1,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: mediaType === 'link' ? 'white' : currentColors.textPrimary }}>Link</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleMediaTypeChange({ type: 'file', setMediaType, setEducationForm, educationForm, setMediaLink })}
            style={{
              backgroundColor: mediaType === 'file' ? currentColors.primary : currentColors.card,
              padding: 12,
              borderRadius: 5,
              flex: 1,
              alignItems: 'center',
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
              setEducationForm({ ...educationForm, media: text });
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
              onPress={() => handleFilePicker({selectedFiles, educationForm, setSelectedFiles, setEducationForm})}
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
                    <TouchableOpacity onPress={() => handleRemoveFile({uri:file.uri, selectedFiles, educationForm, setSelectedFiles, setEducationForm})} style={{ marginLeft: 10 }}>
                      <Ionicons name="close-circle" size={25} color={currentColors.danger} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          </>
        )}

        <EducationForm lowerForm={lowerForm} setLowerForm={setLowerForm} setSelectEdit={setSelectEdit} selectEdit={selectEdit} clearForm={clearForm} />

        <TouchableOpacity
          onPress={() => {
            if (selectEdit.length > 0) {
              handleUpdateEntry(educationForm, selectedFiles, lowerForm, education, setEducation, setEducationForm, setSelectedFiles, setLowerForm, setSelectEdit, selectEdit, editingEducation, setClearForm, toggleEducation, 'education');
            } else {
              handleAddEntry(educationForm, education, setEducation, setEducationForm, setSelectedFiles, setLowerForm, 'education');
            }
          }}
          style={{ backgroundColor: currentColors.primary, padding: 12, borderRadius: 5, alignItems: 'center', marginTop: 10 }}
        >
          <Text style={{ color: 'white' }}>{selectEdit.length > 0 ? 'Update Education' : 'Add Education'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
