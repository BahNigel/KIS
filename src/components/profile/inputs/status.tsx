import React, { useState } from 'react';
import { Text, TouchableOpacity, ScrollView, TextInput, View } from 'react-native';
import ModalRightToLeft from '@/models/ModalRightToLeft';

export default function Status({ visible, onClose, status = '', setStatus, currentColors }: { visible: boolean, onClose: () => void, status: string, setStatus: (value: string) => void, currentColors: any }) {
  const [customStatus, setCustomStatus] = useState('');

  // List of predefined status options
  const statusOptions = [
    'Busy', 'Available', 'At School', 'At the Movies', 'At Work', 'In a Meeting', 
    'Sleeping', 'Out for a Walk', 'On a Call', 'Eating', 'In Traffic'
  ];

  const handleStatusSelect = (selectedStatus: string) => {
    setCustomStatus(''); // Reset custom status input
    setStatus(selectedStatus);
    onClose();
  };

  const handleCustomStatus = () => {
    if (customStatus.trim()) {
      setStatus(customStatus);
    }
    onClose();
  };

  return (
    <ModalRightToLeft
      visible={visible}
      onClose={onClose}
      name="Edit Status"
      headerContent={
        <Text style={{ color: currentColors.textPrimary, fontWeight: 'bold' }} onPress={onClose}>
          Edit Status
        </Text>
      }
    >
      <ScrollView style={{ flex: 1, backgroundColor: currentColors.background }} showsVerticalScrollIndicator={false}>
        
        {/* Display predefined status options */}
        <Text style={{ color: currentColors.textPrimary, fontWeight: 'bold', marginBottom: 10 }}>
          Select a Status
        </Text>

        {statusOptions.map((option, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => handleStatusSelect(option)} 
            style={{ 
              padding: 10, 
              borderBottomWidth: 1, 
              borderBottomColor: currentColors.textSecondary,
              backgroundColor: status === option ? currentColors.primary : currentColors.background,
            }}
          >
            <Text style={{ color: currentColors.textPrimary }}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Option to enter a custom status */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: currentColors.textPrimary, fontWeight: 'bold' }}>
            Or Enter Custom Status
          </Text>
          <TextInput
            value={customStatus}
            onChangeText={setCustomStatus}
            placeholder="Enter your custom status"
            placeholderTextColor={currentColors.textSecondary}
            style={{
              marginTop: 10,
              padding: 10,
              borderWidth: 1,
              borderColor: currentColors.textSecondary,
              borderRadius: 5,
              color: currentColors.textPrimary,
              backgroundColor: currentColors.inputBackground,
            }}
          />
          <TouchableOpacity 
            onPress={handleCustomStatus} 
            style={{
              marginTop: 15,
              backgroundColor: currentColors.primary,
              padding: 10,
              alignItems: 'center',
              borderRadius: 5
            }}
          >
            <Text style={{ color: currentColors.buttonText }}>Save Custom Status</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ModalRightToLeft>
  );
}
