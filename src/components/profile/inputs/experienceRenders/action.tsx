import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import handleFilePickerProps, { getFileIconProps, handleMediaTypeChangeProps, handleRemoveFileProps } from './interface';

const handleFilePicker = async ({ selectedFiles, experienceForm, setSelectedFiles, setExperienceForm }: handleFilePickerProps) => {
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
    setExperienceForm({ ...experienceForm, media: updatedFiles });
  } catch (error) {
    console.error('Error picking files:', error);
    Alert.alert('Error', 'There was an issue selecting files. Please try again.');
  }
};

export const handleRemoveFile = ({ uri, selectedFiles, experienceForm, setSelectedFiles, setExperienceForm }: handleRemoveFileProps) => {
  const updatedFiles = selectedFiles.filter((file) => file.uri !== uri);
  setSelectedFiles(updatedFiles);
  setExperienceForm({ ...experienceForm, media: updatedFiles });
};

export const handleMediaTypeChange = ({ type, setMediaType, setExperienceForm, experienceForm, setMediaLink }: handleMediaTypeChangeProps) => {
  setMediaType(type);
  setExperienceForm({ ...experienceForm, media: '', mediaType: type });
  if (type === 'link') {
    setMediaLink('');
  }
};

export const getFileIcon = ({ mimeType, currentColors }: getFileIconProps) => {
  if (mimeType.includes('image')) {
    return <Ionicons name="image" size={30} color={currentColors.textPrimary} />;
  } else if (mimeType.includes('pdf')) {
    return <Ionicons name="document-text" size={30} color="red" />;
  } else if (mimeType.includes('msword') || mimeType.includes('wordprocessingml')) {
    return <Ionicons name="document" size={30} color="blue" />;
  }
  return <Ionicons name="document" size={30} color={currentColors.textPrimary} />;
};

export default handleFilePicker;
