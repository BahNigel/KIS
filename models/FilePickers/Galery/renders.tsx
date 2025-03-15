import React from "react";
import { View, Text, Image, FlatList, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Theme {
  background: string;
  text: string;
  textSecondary: string;
  primary: string;
  tint: string;
  framButtonText: string;
}


interface HandleConfirmProps {
  onSelect: (selectedImages: string[], message?: string) => void;
  onClose: () => void;
  selectedImages: string[];
  setSelectedImages: React.Dispatch<React.SetStateAction<string[]>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const handleConfirm = ({ onSelect, onClose, selectedImages, setSelectedImages, message, setMessage }: HandleConfirmProps) => {
  onSelect(selectedImages, message);
  setSelectedImages([]);
  setMessage("");
  onClose();
};

const renderPreview = (selectedImages: string[], theme: Theme) => {
  return (
    <View style={{ flexDirection: "row", marginTop: 10, paddingBottom: 10 }}>
      {selectedImages.slice(0, 4).map((uri, index) => (
        <Image
          key={index}
          source={{ uri }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            marginRight: 5,
            borderWidth: 2,
            borderColor: theme.primary,
            opacity: 0.7,
          }}
        />
      ))}
    </View>
  );
};

const renderSendMessageMode = (
  selectedImages: string[],
  message: string,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  onSelect: (selectedImages: string[], message?: string) => void,
  onClose: () => void,
  theme: Theme
) => (
  <View style={{ position: "absolute", bottom: 80, width: "100%", padding: 15, justifyContent: 'center', alignItems: "center" }}>
    {renderPreview(selectedImages, theme)}
    <View style={{ alignItems: "center", flexDirection: "row", marginLeft: 45, justifyContent: "center", width: '100%' }}>
      <TextInput
        style={{
          height: 40,
          backgroundColor: theme.background,
          borderRadius: 10,
          paddingLeft: 10,
          color: theme.text,
          marginBottom: 10,
          width: '80%',
        }}
        placeholder="Write your message"
        placeholderTextColor={theme.textSecondary}
        value={message}
        onChangeText={setMessage}
      />
      <TouchableOpacity
        onPress={() => handleConfirm({ onSelect, onClose, selectedImages, setSelectedImages: setMessage as any, message, setMessage })}
        style={{
          backgroundColor: theme.tint,
          padding: 10,
          marginBottom: 10,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 10,
          flexDirection: 'row',
        }}
      >
        <Ionicons name="send" size={24} color={theme.framButtonText} />
        <Text style={{ color: theme.framButtonText, fontWeight: "bold" }}>
          ({selectedImages.length})
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default renderSendMessageMode;

export const renderPickOnlyMode = (
  selectedImages: string[],
  onSelect: (selectedImages: string[], message?: string) => void,
  onClose: () => void,
  theme: Theme
) => (
  <>
    {selectedImages.length > 0 && (
      <View
        style={{
          position: "absolute",
          bottom: 120,
          right: 25,
          backgroundColor: theme.tint,
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity onPress={() => handleConfirm({ onSelect, onClose, selectedImages, setSelectedImages: () => {}, message: "", setMessage: () => {} })}>
          <Text style={{ color: theme.framButtonText, fontWeight: "bold" }}>
            Send ({selectedImages.length})
          </Text>
        </TouchableOpacity>
      </View>
    )}
  </>
);



