import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import SkillsSelection from '../skillsRenders';
import { handleAddEntry, handleUpdateEntry, renderSkillItem } from '../../profileActions';
import DynamicForm, { DynamicFormField } from '@/models/DynamicForm';
import { Certificate, CertificatesFormProps } from '@/src/components/Messages/Chats/chatInterfaces';

export default function Index({
  skills,
  certificatesForm,
  setCertificatesForm,
  currentColors,
  startSelect,
  setStartSelect,
  setSkills,
  certificates,
  setCertificates,
  setSelectEdit,
  selectEdit,
  setOpenAnyModal,
  clearForm,
  setClearForm,
  toggleCertificate,
  type
}: CertificatesFormProps) {
  const [mediaLink, setMediaLink] = useState<any>('');
  const [editingCertificate, setEditingCertificate] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [mediaType, setMediaType] = useState(certificatesForm?.mediaType || 'file');
  const [selectedFiles, setSelectedFiles] = useState<{ uri: string; name: string; mimeType: string }[]>(certificatesForm?.files || []);
  const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      console.log("certificate Form $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$SS", certificates);
    }, [certificates]);

  useEffect(() => {
    if (selectEdit.length > 0) {
      const certToEdit = selectEdit.find(item => item.name && item.type === 'certificate');
      if (certToEdit) {
        setEditingCertificate(certToEdit);
        setMediaType(certToEdit.mediaType);
        setCertificatesForm(certToEdit);
        setSelectedFiles(certToEdit.media || []);
        setMediaLink(certToEdit.media || '');
      }
    }
    setRefreshKey(prevKey => prevKey + 1);
  }, [selectEdit]);

  useEffect(() => {
    if (clearForm) {
      setCertificatesForm({
        id: 1,
        name: '',
        issuedBy: '',
        reference: '',
        description: '',
        startDate: '',
        endDate: '',
        type: 'certificate',
        files: [],
        skills: [],
        selectedSkills: [],
        media: '',
        mediaType: 'file'
      });
    }
  }, [clearForm]);

  const setValue = <T extends keyof Certificate>(field: T, value: Certificate[T]) => {
    setCertificatesForm({
      ...certificatesForm,
      [field]: value,
    });
  };

  const dynamicFields: DynamicFormField[] = [
    { name: 'name', label: 'Certificate Name', type: 'text', value: (value) => setValue('name', value), placeholder: 'Enter certificate name', required: true },
    { name: 'issuedBy', label: 'Issued By', type: 'text', value: (value) => setValue('issuedBy', value), placeholder: 'Enter issuer', required: true },
    { name: 'reference', label: 'Reference', type: 'url', value: (value) => setValue('reference', value), placeholder: 'Reference', required: false },
    { name: 'description', label: 'Description', type: 'textarea', value: (value) => setValue('description', value), placeholder: 'Enter description', required: false, numberOfLines: 4 },

    {
      name: 'mediaType',
      label: 'Media Type',
      type: 'tabchoice',
      options: [
        { name: 'Link', label: 'Link', type: 'url', value: (value: any) => setValue('media', value), placeholder: 'Enter media URL', required: false },
        { name: 'Files', label: 'Files', type: 'file', value: (value: any) => setValue('files', value), required: false }
      ],
      value: (value) => setValue('mediaType', value),
      required: true
    },
    { name: 'startDate', label: 'Start Date', type: 'date', value: (value) => setValue('startDate', value), placeholder: 'Select start date', required: true },
    { name: 'endDate', label: 'End Date', type: 'date', value: (value) => setValue('endDate', value), placeholder: 'Select end date', required: true },
  ];

  return (
    <View key={refreshKey}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {certificates.map((certificate, index) => (
            <View key={index} style={{ flexDirection: 'row', marginVertical: 5 }}>
              {renderSkillItem(certificate, index, currentColors, certificates, setCertificates, setStartSelect, selectEdit, setSelectEdit, setOpenAnyModal)}
            </View>
          ))}
        </ScrollView>

        <DynamicForm
          fields={dynamicFields}
          formData={certificatesForm}
          setFormData={setCertificatesForm}
          setAction={setIsVisible}
        />
        <SkillsSelection
          skills={skills}
          selectedSkills={certificatesForm?.selectedSkills}
          setSelectedSkills={(skills) => setCertificatesForm({ ...certificatesForm, selectedSkills: skills })}
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
              handleUpdateEntry(certificatesForm, selectedFiles, certificates, setCertificates, setCertificatesForm, setSelectedFiles, setSelectEdit, selectEdit, editingCertificate, setClearForm, toggleCertificate, 'certificate');
            } else {
              handleAddEntry(certificatesForm, certificates, setCertificates, setCertificatesForm, setSelectedFiles, 'certificate');
            }
          }}
          style={{ backgroundColor: currentColors.primary, padding: 12, borderRadius: 5, alignItems: 'center', marginVertical: 10 }}
        >
          <Text style={{ color: 'white' }}>{selectEdit.length > 0 ? 'Update Certificate' : 'Add Certificate'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
