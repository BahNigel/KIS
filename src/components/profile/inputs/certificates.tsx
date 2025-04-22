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
import CertificatesForm from './certificateRenders'; // Updated import for certificate form
import { Certificate } from '../../Messages/Chats/chatInterfaces'; // Updated import type

export default function Certificates({
  visible,
  onClose,
  skills,
  setSkills,
  certificates,
  setCertificates,
  currentColors,
  startSelect,
  setStartSelect,
  setSelectEdit,
  selectEdit,
  setOpenAnyModal,
  certificateForm,
  setCertificateForm,
  toggleCertificate,
}: {
  visible: boolean;
  onClose: () => void;
  selectEdit: any[];
  skills: { name: string; percentage: string; skillType: string; type: string }[];
  setSkills: (value: { name: string; percentage: string; type: string }[]) => void;
  certificates: Certificate[];
  setCertificates: (value: Certificate[]) => void;
  currentColors: any;
  startSelect: boolean;
  certificateForm: Certificate;
  toggleCertificate: (value: boolean) => void;
  setCertificateForm: (form: any) => void;
  setStartSelect: (value: boolean) => void;
  setSelectEdit: (value: any[]) => void;
  setOpenAnyModal: (value: string) => void;
}) {
  const [clearForm, setClearForm] = useState(false);

  useEffect(() => {
    setCertificateForm((prevData: any) => {
      return { ...prevData };
    });
  }, [skills]);

  useEffect(() => {
    if (visible) {
      setClearForm(false);
    }
  }, [visible]);

  const handleAddCertificate = () => {
    if (!certificateForm.name || !certificateForm.issuedBy) return;

    setCertificates([...certificates, certificateForm]);
    resetForm();
  };

  const resetForm = () => {
    setCertificateForm({
      id: 1,
      name: '',
      location: '',
      whereFound: '',
      description: '',
      startDate: '',
      endDate: '',
      price: '',
      type: 'certificate',
      files: [],
      selectedSkills: [],
    });
  };

  const handleRemoveCertificate = (index: number) => {
    const updated = certificates.filter((_, i) => i !== index);
    setCertificates(updated);
  };

  const submit = () => {
    setClearForm(true);
    onClose();
  };

  return (
    <ModalRightToLeft
      visible={visible}
      onClose={onClose}
      name="Edit Certificates"
      headerContent={
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: currentColors.textPrimary, fontWeight: 'bold' }} onPress={onClose}>
            Edit Certificates
          </Text>
          <TouchableOpacity onPress={submit}>
            <Icon name="check" size={24} color={currentColors.primary} />
          </TouchableOpacity>
        </View>
      }
    >
      <View style={{ backgroundColor: currentColors.background, flex: 1, padding: 16 }}>
        {/* Horizontal Scroll for Added Certificates */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
          {certificates.map((cert, index) => (
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
              <Text style={{ color: currentColors.textPrimary, marginRight: 10 }}>{cert.name}</Text>
              <TouchableOpacity onPress={() => handleRemoveCertificate(index)}>
                <Ionicons name="close-circle" size={20} color={currentColors.danger} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Certificates Form Component */}
        <CertificatesForm
          visible={visible}
          skills={skills}
          certificatesForm={certificateForm}
          setCertificatesForm={setCertificateForm}
          currentColors={currentColors}
          handleAddCertificate={handleAddCertificate}
          startSelect={startSelect}
          setStartSelect={setStartSelect}
          setSkills={setSkills}
          certificates={certificates}
          setCertificates={setCertificates}
          setSelectEdit={setSelectEdit}
          selectEdit={selectEdit}
          setOpenAnyModal={setOpenAnyModal}
          clearForm={clearForm}
          setClearForm={setClearForm}
          toggleCertificate={toggleCertificate}
          type={'certificate'}
        />
      </View>
    </ModalRightToLeft>
  );
}
