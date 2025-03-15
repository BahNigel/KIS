import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  Text,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import PickFromGallery from "./Galery";

const { height, width } = Dimensions.get("window");

interface FilePickersProps {
  visible: boolean;
  onClose: () => void;
  buttonPosition: { x: number; y: number; width: number; height: number };
}

const options = [
  { name: "Gallery", icon: "image-outline" },
  { name: "Camera", icon: "camera-outline" },
  { name: "Location", icon: "location-outline" },
  { name: "Contact", icon: "person-outline" },
  { name: "Documents", icon: "document-text-outline" },
  { name: "Audio", icon: "musical-notes-outline" },
  { name: "Poll", icon: "bar-chart-outline" },
  { name: "Event", icon: "calendar-outline" },
];

const FilePickers: React.FC<FilePickersProps> = ({ visible, onClose, buttonPosition }) => {
  const translateY = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleSelectImages = (images: string[]) => {
    setSelectedImages(images);
    console.log("Selected Images:", images);
  };

  const modalHeight = height / 3;
  const modalWidth = width * 0.8;

  const modalY =
    buttonPosition.y + buttonPosition.height + modalHeight > height
      ? buttonPosition.y - modalHeight - 10
      : buttonPosition.y + buttonPosition.height + 10;

  const modalX = Math.min(buttonPosition.x, width - modalWidth - 10);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: modalY,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="none">
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.transparent,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              style={{
                position: "absolute",
                width: modalWidth,
                height: modalHeight,
                backgroundColor: theme.background,
                borderRadius: 15,
                padding: 15,
                shadowColor: theme.text,
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 5,
                transform: [{ translateY }],
                opacity: fadeAnim,
                left: modalX,
              }}
            >
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: -20,
                  left: "50%",
                  transform: [{ translateX: -12 }],
                  backgroundColor: theme.buttonBackground,
                  padding: 5,
                  borderRadius: 15,
                }}
                onPress={() => scrollViewRef.current?.scrollTo({ y: 0, animated: true })}
              >
                <Ionicons name="chevron-up-outline" size={24} color={theme.text} />
              </TouchableOpacity>

              <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
                  {options.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{
                        width: "30%",
                        alignItems: "center",
                        padding: 10,
                        marginBottom: 10,
                      }}
                      onPress={() => {
                        if (item.name === "Gallery") {
                          setModalVisible(true); // Open PickFromGallery when "Gallery" is clicked
                        } else {
                          console.log(`${item.name} clicked`);
                        }
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: theme.buttonBackground,
                          borderRadius: 10,
                          padding: 12,
                          marginBottom: 5,
                        }}
                      >
                        <Ionicons name={item.icon as any} size={24} color={theme.icon} />
                      </View>
                      <Text style={{ fontSize: 14, color: theme.text }}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <TouchableOpacity
                style={{
                  position: "absolute",
                  bottom: -20,
                  left: "50%",
                  transform: [{ translateX: -12 }],
                  backgroundColor: theme.buttonBackground,
                  padding: 5,
                  borderRadius: 15,
                }}
                onPress={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
              >
                <Ionicons name="chevron-down-outline" size={24} color={theme.text} />
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
      
      {/* PickFromGallery Modal */}
      <PickFromGallery
              visible={isModalVisible}
              onClose={() => setModalVisible(false)}
              onSelect={handleSelectImages} mode={"send"}      />
    </Modal>
  );
};

export default FilePickers;
