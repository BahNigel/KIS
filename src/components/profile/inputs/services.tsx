import React, { useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ModalRightToLeft from '@/models/ModalRightToLeft';
import Icon from 'react-native-vector-icons/FontAwesome';
import ServicesForm from './serviceRenders'; // Update this to your actual service form render
import { Service } from '../../Messages/Chats/chatInterfaces';

export default function Services({
  visible,
  onClose,
  skills,
  setSkills,
  services,
  setServices,
  currentColors,
  startSelect,
  setStartSelect,
  setSelectEdit,
  selectEdit,
  setOpenAnyModal,
  servicesForm,
  setServicesForm,
  toggleService,
}: {
  visible: boolean;
  onClose: () => void;
  selectEdit: any[];
  skills: { name: string; percentage: string; skillType: string; type: string }[];
  setSkills: (value: { name: string; percentage: string; type: string }[]) => void;
  services: Service[];
  setServices: (value: Service[]) => void;
  currentColors: any;
  startSelect: boolean;
  servicesForm: Service;
  toggleService: (value: boolean) => void;
  setServicesForm: (form: any) => void;
  setStartSelect: (value: boolean) => void;
  setSelectEdit: (value: any[]) => void;
  setOpenAnyModal: (value: string) => void;
}) {
  const [clearForm, setClearForm] = useState(false);

  useEffect(() => {
    setServicesForm((prevData: any) => {
      return { ...prevData };
    });
  }, [skills]);

  useEffect(() => {
    if (visible) {
      setClearForm(false);
    }
  }, [visible]);

  const handleAddService = () => {
    if (!servicesForm.name || !servicesForm.location) return;

    setServices([...services, servicesForm]);
    resetForm();
  };

  const resetForm = () => {
    setServicesForm({
      id: 1,
      name: '',
      location: '',
      whereFound: '',
      description: '',
      startDate: '',
      endDate: '',
      price: '',
      type: 'servieces',
      files: [],
      selectedSkills: [],
    });
  };

  const handleRemoveService = (index: number) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
  };

  const submit = () => {
    setClearForm(true);
    onClose();
  };

  return (
    <ModalRightToLeft
      visible={visible}
      onClose={onClose}
      name="Edit Services"
      headerContent={
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: currentColors.textPrimary, fontWeight: 'bold' }} onPress={onClose}>
            Edit Services
          </Text>
          <TouchableOpacity onPress={submit}>
            <Icon name="check" size={24} color={currentColors.primary} />
          </TouchableOpacity>
        </View>
      }
    >
      <View style={{ backgroundColor: currentColors.background, flex: 1, padding: 16 }}>
        {/* Horizontal Scroll for Added Services */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
          {services.map((svc, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: currentColors.card,
                padding: 10,
                borderRadius: 10,
                marginRight: 10,
              }}
            >
              <Text style={{ color: currentColors.textPrimary, marginRight: 10 }}>{svc.name}</Text>
              <TouchableOpacity onPress={() => handleRemoveService(index)}>
                <Ionicons name="close-circle" size={20} color={currentColors.danger} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Services Form Component */}
        <ServicesForm
          visible={visible}
          skills={skills}
          servicesForm={servicesForm}
          setServicesForm={setServicesForm}
          currentColors={currentColors}
          handleAddService={handleAddService}
          startSelect={startSelect}
          setStartSelect={setStartSelect}
          setSkills={setSkills}
          services={services}
          setServices={setServices}
          setSelectEdit={setSelectEdit}
          selectEdit={selectEdit}
          setOpenAnyModal={setOpenAnyModal}
          clearForm={clearForm}
          setClearForm={setClearForm}
          toggleService={toggleService}
          type={'service'}
        />
      </View>
    </ModalRightToLeft>
  );
}
