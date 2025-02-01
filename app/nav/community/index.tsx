import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import CommunityFrame from '../../../models/CommunityFrame';
import ModalRightToLeft from '@/models/ModalRightToLeft';
import ModalLeftToRight from '@/models/ModalLeftToRight';
import ModalBottomToTop from '@/models/ModalBottomToTop';

const CommunityPage = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <CommunityFrame
        leftSectionContent={<Text>Left Section Content</Text>}
        middleHeaderContent={<Text>Middle Header</Text>}
        middleBodyContent={
          <View style={styles.middleBody}>
            <Text>Middle Body Content</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttonText}>Open Modal</Text>
            </TouchableOpacity>
          </View>
        }
        rightHeaderContent={<Text>Right Header</Text>}
        rightBodyContent={<Text>Right Body Content</Text>}
      />

      <ModalBottomToTop
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        name="Modal Title"
        // Pass dynamic content to the header and body
        headerContent={<Text style={styles.customHeaderText}>Custom Header Content</Text>}
      >
        {/* Pass dynamic content to the modal's body */}
        <View style={styles.modalBodyContent}>
          <Text>This is the dynamic content inside the modal!</Text>
        </View>
      </ModalBottomToTop>
    </>
  );
};

const styles = StyleSheet.create({
  middleBody: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  customHeaderText: {
    fontSize: 22,
    color: 'blue', // Custom color for the header
    fontWeight: 'bold',
  },
  modalBodyContent: {
    marginTop: 20,
    padding: 10,
  },
});

export default CommunityPage;
