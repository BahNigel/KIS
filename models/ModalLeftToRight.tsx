import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Easing,
  useColorScheme, // Import useColorScheme
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Colors } from '@/constants/Colors'; // Make sure to import the Colors constant

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  name: string;
  headerContent: React.ReactNode;
  children: React.ReactNode;
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ModalLeftToRight: React.FC<ModalProps> = ({ visible, onClose, name, headerContent, children }) => {
  const translateX = useRef(new Animated.Value(-screenWidth)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [showModal, setShowModal] = useState(visible);
  const colorScheme = useColorScheme(); // Detect current color scheme (light/dark)

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();

      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: -screenWidth,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();

      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();

      setTimeout(() => setShowModal(false), 300);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(translateX, {
      toValue: -screenWidth,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start();

    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start();

    setTimeout(onClose, 300);
  };

  if (!showModal) return null;

  const currentColors = colorScheme === 'dark' ? Colors.dark : Colors.light; // Select colors based on mode

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: currentColors.transparent }]}>
        <Animated.View
          style={[styles.modalContent, { transform: [{ translateX }], opacity, backgroundColor: currentColors.background }]}
        >
          <View style={styles.header}>
            <View style={styles.headerTextContainer}>
              {headerContent || <Text style={[styles.headerText, { color: currentColors.textPrimary }]}>{name}</Text>}
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.backButton}>
              <Icon name="arrow-right" size={15} color={currentColors.icon} />
            </TouchableOpacity>
          </View>

          <View style={[styles.separator, { backgroundColor: currentColors.buttonSecondary }]} />

          <View style={styles.body}>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  modalContent: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: screenHeight,
    width: screenWidth,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    marginLeft: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    marginBottom: 20,
  },
  body: {
    flex: 1,
    padding: 20,
  },
});

export default ModalLeftToRight;
