import React from "react";
import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { Video } from 'expo-av'; // Make sure to install expo-av to use Video component

interface Theme {
  background: string;
  text: string;
  textSecondary: string;
  primary: string;
  tint: string;
  framButtonText: string;
}

const renderMedia = (
  media: { uri: string; type: string }[], // Each item contains uri and type ('photo' or 'video')
  selectedMedia: string[],
  toggleSelection: (uri: string) => void,
  theme: Theme
) => (
  <FlatList
    key={`media-${media.length}`} // Force re-render when switching between options
    data={media}
    keyExtractor={(item) => item.uri}
    numColumns={2} // Adjusted to two columns as per request
    renderItem={({ item }) => (
      <TouchableOpacity onPress={() => toggleSelection(item.uri)} style={{ margin: 5 }}>
        <View style={{ position: "relative" }}>
          {item.type === "photo" ? (
            <Image
              source={{ uri: item.uri }}
              style={{
                width: 150, // Increased size for better visibility
                height: 150,
                borderRadius: 10,
                borderWidth: selectedMedia.includes(item.uri) ? 3 : 0,
                borderColor: theme.tint,
              }}
            />
          ) : (
            <Video
              source={{ uri: item.uri }}
              style={{
                width: 150, // Same size for consistency
                height: 150,
                borderRadius: 10,
                borderWidth: selectedMedia.includes(item.uri) ? 3 : 0,
                borderColor: theme.tint,
              }}
              isMuted
              shouldPlay={false}
              isLooping
            />
          )}
          {selectedMedia.includes(item.uri) && (
            <Text
              style={{
                position: "absolute",
                top: 5,
                right: 5,
                color: theme.primary,
                fontWeight: "bold",
                borderRadius: 50,
                backgroundColor: theme.background,
                padding: 5,
              }}
            >
              {selectedMedia.indexOf(item.uri) + 1}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    )}
  />
);

export default renderMedia;
