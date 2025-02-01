import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Easing,
  useColorScheme,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Colors } from '@/constants/Colors'; // Import Colors

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  name: string;
  headerContent: React.ReactNode;
  children: React.ReactNode;
}

const ModalRightToLeft: React.FC<ModalProps> = ({ visible, onClose, name, headerContent, children }) => {
  const translateX = useRef(new Animated.Value(100)).current; // Percentage for dynamic width
  const opacity = useRef(new Animated.Value(0)).current;
  const [showModal, setShowModal] = useState(visible);
  const colorScheme = useColorScheme();
  const { width } = Dimensions.get('window');
  const translateXPixel = width * 1;

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
        toValue: 100,
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
      toValue: 100,
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

  const modalBackgroundColor = Colors[colorScheme || 'light'].background;
  const headerTextColor = Colors[colorScheme || 'light'].textPrimary;
  const separatorColor = Colors[colorScheme || 'light'].textPrimary;
  const overlayColor = Colors[colorScheme || 'light'].transparent;

  return (
    <Modal transparent={true} visible={visible} animationType="none" onRequestClose={handleClose}>
      <View style={[styles.modalOverlay]}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              // transform: [{ translateX: translateX.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }],
              transform: [
                {
                  translateX: translateX.interpolate({
                    inputRange: [0, 100],
                    outputRange: [0, translateXPixel], // Using pixel values for mobile
                  }),
                },
              ],
              opacity,
              backgroundColor: modalBackgroundColor,
            },
          ]}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.backButton}>
              <Icon name="arrow-left" size={20} color={headerTextColor} />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              {headerContent || <Text style={[styles.headerText, { color: headerTextColor }]}>{name}</Text>}
            </View>
          </View>

          <View style={[styles.separator, { backgroundColor: separatorColor }]} />

          <View style={styles.body}>{children}</View>
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
    right: 0,
    top: 0,
    height: '100%',
    width: '100%',
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
    paddingVertical: '5%',
    paddingHorizontal: '4%',
  },
  backButton: {
    marginRight: 10,
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
  },
  body: {
    flex: 1,
    paddingHorizontal: '5%',
    paddingTop: '2%',
  },
});

export default ModalRightToLeft;
