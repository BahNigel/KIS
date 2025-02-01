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
  TouchableWithoutFeedback,
  PanResponder,
  useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Colors } from '@/constants/Colors'; // import Colors

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  name: string;
  headerContent: React.ReactNode;
  children: React.ReactNode;
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ModalBottomToTop: React.FC<ModalProps> = ({
  visible,
  onClose,
  name,
  headerContent,
  children,
}) => {
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [showModal, setShowModal] = useState(visible);
  const colorScheme = useColorScheme();

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(screenHeight * 0.12 + gestureState.dy);
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 150) {
          handleClose();
        } else {
          Animated.timing(translateY, {
            toValue: screenHeight * 0.12,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.timing(translateY, {
        toValue: screenHeight * 0.12,
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
      Animated.timing(translateY, {
        toValue: screenHeight,
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
    Animated.timing(translateY, {
      toValue: screenHeight,
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

  const handleReadBoxPress = () => {
    handleClose();
  };

  if (!showModal) return null;

  const isDarkMode = colorScheme === 'dark';
  const currentColors = Colors[isDarkMode ? 'dark' : 'light']; // Get the colors for the current theme

  const styles = createStyles(isDarkMode, currentColors);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentWrapper} {...panResponder.panHandlers}>
            <TouchableWithoutFeedback onPress={handleReadBoxPress}>
              <View style={styles.readBox}></View>
            </TouchableWithoutFeedback>

            <Animated.View
              style={[styles.modalContent, { transform: [{ translateY }], opacity }]}
            >
              <View style={styles.topBoxContainer}>
                <View style={styles.topBox}></View>
              </View>
              <View style={styles.header}>
                <View style={styles.headerTextContainer}>
                  {headerContent || <Text style={styles.headerText}>{name}</Text>}
                </View>
              </View>
              <View style={styles.separator} />
              <View style={styles.body}>{children}</View>
            </Animated.View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const createStyles = (isDarkMode: boolean, colors: any) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.transparent,
      justifyContent: 'flex-start',
    },
    readBox: {
      width: screenWidth,
      height: 100,
      position: 'absolute',
      top: 0,
      left: 0,
    },
    topBoxContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    topBox: {
      backgroundColor: isDarkMode ? colors.buttonSecondary : colors.buttonBackground,
      width: 80,
      height: 4,
      borderRadius: 20,
    },
    modalContentWrapper: {
      flex: 1,
      justifyContent: 'flex-start',
      height: '90%',
      backgroundColor: colors.transparent,
    },
    modalContent: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: screenWidth,
      height: screenHeight,
      backgroundColor: colors.background,
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      justifyContent: 'center',
    },
    headerTextContainer: {
      flex: 1,
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    separator: {
      height: 1,
      backgroundColor: isDarkMode ? colors.buttonSecondary : colors.buttonBackground,
      marginBottom: 20,
    },
    body: {
      flex: 1,
      padding: 20,
    },
  });

export default ModalBottomToTop;
