import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import SkillsSelection from '../skillsRenders';
import { handleAddEntry, handleUpdateEntry, renderSkillItem } from '../../profileActions';
import DynamicForm, { DynamicFormField } from '@/models/DynamicForm';
import { Service, ServicesFormProps } from '@/src/components/Messages/Chats/chatInterfaces';

export default function Index({
  skills,
  servicesForm,
  setServicesForm,
  currentColors,
  startSelect,
  setStartSelect,
  setSkills,
  services,
  setServices,
  setSelectEdit,
  selectEdit,
  setOpenAnyModal,
  clearForm,
  setClearForm,
  toggleService
}: ServicesFormProps) {
  const [mediaLink, setMediaLink] = useState<any>('');
  const [editingService, setEditingService] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [mediaType, setMediaType] = useState(servicesForm?.mediaType || 'file');
  const [selectedFiles, setSelectedFiles] = useState<{ uri: string; name: string; mimeType: string }[]>(servicesForm?.files || []);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (selectEdit.length > 0) {
      const serviceToEdit = selectEdit.find(item => item.name && item.type === 'service');
      if (serviceToEdit) {
        setEditingService(serviceToEdit);
        setMediaType(serviceToEdit.mediaType);
        setServicesForm(serviceToEdit);
        setSelectedFiles(serviceToEdit.media || []);
        setMediaLink(serviceToEdit.media || '');
      }
    }
    setRefreshKey(prevKey => prevKey + 1);
  }, [selectEdit]);

  useEffect(() => {
    if (clearForm) {
      setServicesForm({
        id: 1,
        name: '',
        location: '',
        whereFound: '',
        description: '',
        startDate: '',
        endDate: '',
        price: '',
        type: 'service',
        files: [],
        skills: [],
        selectedSkills: [],
        media: '',
        mediaType: 'file'
      });
    }
  }, [clearForm]);

  const setValue = <T extends keyof Service>(field: T, value: Service[T]) => {
    setServicesForm({
      ...servicesForm,
      [field]: value,
    });
  };

  const dynamicFields: DynamicFormField[] = [
    { name: 'name', label: 'Service Name', type: 'text', value: (value) => setValue('name', value), placeholder: 'Enter service name', required: true, maxLength: 100 },
    { name: 'location', label: 'Location', type: 'text', value: (value) => setValue('location', value), placeholder: 'Enter location', required: true },
    { name: 'description', label: 'Service Description', type: 'textarea', value: (value) => setValue('description', value), placeholder: 'Enter description', required: true, numberOfLines: 4 },
    { name: 'price', label: 'Price', type: 'text', value: (value) => setValue('price', value), placeholder: 'Enter price', required: true },

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
          {services.map((service, index) => (
            <View key={index} style={{ flexDirection: 'row', marginVertical: 5 }}>
              {renderSkillItem(service, index, currentColors, services, setServices, setStartSelect, selectEdit, setSelectEdit, setOpenAnyModal)}
            </View>
          ))}
        </ScrollView>

        <DynamicForm
          fields={dynamicFields}
          formData={servicesForm}
          setFormData={setServicesForm}
          setAction={setIsVisible}
        />
        <SkillsSelection
          skills={skills}
          selectedSkills={servicesForm?.selectedSkills}
          setSelectedSkills={(skills) => setServicesForm({ ...servicesForm, selectedSkills: skills })}
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
              handleUpdateEntry(servicesForm, selectedFiles, services, setServices, setServicesForm, setSelectedFiles, setSelectEdit, selectEdit, editingService, setClearForm, toggleService, 'service');
            } else {
              handleAddEntry(servicesForm, services, setServices, setServicesForm, setSelectedFiles, 'service');
            }
          }}
          style={{ backgroundColor: currentColors.primary, padding: 12, borderRadius: 5, alignItems: 'center', marginVertical: 10 }}
        >
          <Text style={{ color: 'white' }}>{selectEdit.length > 0 ? 'Update Service' : 'Add Service'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
