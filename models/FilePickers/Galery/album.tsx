import React from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from "react-native";

interface Theme {
  background: string;
  text: string;
  textSecondary: string;
  primary: string;
  tint: string;
  framButtonText: string;
}

interface Album {
  id: string;
  title: string;
  firstItem: string | null;  // `firstItem` can be a string (image/video URI) or null
}

const renderAlbums = (albums: Album[], theme: Theme, setAlbumId: (value: string) => void, setSelectedOption: React.Dispatch<React.SetStateAction<"albums" | "photos">>) => {
  // Filter albums to exclude those without images or items
  const filteredAlbums: Album[] = albums.filter((album) => album.firstItem !== null);

  return (
    <FlatList
      key={`albums-${filteredAlbums.length}`} // Force re-render when switching between options
      data={filteredAlbums}
      keyExtractor={(item) => item.id}
      numColumns={2} // Set to 2 columns for a two-column grid
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => {
            setAlbumId(item.id)
            setSelectedOption('photos')
            }} style={styles.albumContainer}>
          <View style={[styles.albumItem]}>
            {item.firstItem ? (
              <Image
                source={{ uri: item.firstItem }}
                style={styles.albumImage}
              />
            ) : (
              <View style={[styles.albumImage, { backgroundColor: theme.background }]}>
                <Text style={{ color: theme.textSecondary }}>No Image</Text>
              </View>
            )}
            <Text style={[styles.albumTitle, { color: theme.text }]}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  albumContainer: {
    flex: 1,
  },
  albumItem: {
    marginBottom: 10,
    alignItems: "center",
    flex: 1,
  },
  albumImage: {
    width: 150, // Increased width
    height: 140, // Increased height
    borderRadius: 10,
    marginBottom: 5, // Reduced space between image and title
  },
  albumTitle: {
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default renderAlbums;
