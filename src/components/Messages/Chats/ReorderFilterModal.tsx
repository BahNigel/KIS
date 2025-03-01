import React from 'react';
import { View, Text, useColorScheme, StyleSheet } from 'react-native'; // ✅ Fixed missing StyleSheet import
import ModalBottomToTop from '@/models/ModalBottomToTop';
import { Colors } from '@/constants/Colors';

interface ReorderFilterModalProps {
  visible: boolean;
  onClose: () => void;
  editFilterValue: string | null; // ✅ Made editFilterValue optional
}

const ReorderFilterModal: React.FC<ReorderFilterModalProps> = ({ visible, onClose, editFilterValue }) => {
  const scheme = useColorScheme();
  const currentColors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <ModalBottomToTop
      visible={visible}
      onClose={onClose}
      name="Filter Modal"
      headerContent={<Text style={[styles.modalTitle, { color: currentColors.textPrimary }]}>{editFilterValue}</Text>}
    >
      <Text>Modal Content Here</Text>
    </ModalBottomToTop>
  );
};

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ReorderFilterModal;
