import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import ModalBottomToTop from "@/models/ModalBottomToTop";
import renderSendMessageMode, { renderPickOnlyMode } from "./renders"; // Import render functions
import renderAlbums from "./album";
import renderMedia from "./photos";

interface PickFromGalleryProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (selectedImages: string[], message?: string) => void;
  mode: "send" | "pick"; // New prop to handle modes
}

const PickFromGallery: React.FC<PickFromGalleryProps> = ({
  visible,
  onClose,
  onSelect,
  mode,
}) => {
  const [media, setMedia] = useState<{ uri: string; type: string }[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState<"photos" | "albums">("photos");
  const [albumId, setAlbumId] = useState("");
  const [photo, setPhoto] = useState(true);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  useEffect(() => {
    loadMedia();
  }, [selectedOption, albumId]);

  useEffect(() => {
    if (visible) {
      requestPermission();
    }
  }, [visible]);

  const requestPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      loadMedia();
    } else {
      setLoading(false);
    }
  };

  const loadMedia = async () => {
    setLoading(true);

    if (selectedOption === "photos") {
      let media;
      // Check if an albumId is provided
      if (albumId !== "") {
        // If albumId is set, fetch items from the specific album
        media = await MediaLibrary.getAssetsAsync({
          album: albumId, // Filter by albumId
          mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
          first: 50,
          sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        });
      } else {
        // If no albumId, fetch all photos and videos
        media = await MediaLibrary.getAssetsAsync({
          mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
          first: 50,
          sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        });
      }

      setMedia(media.assets.map((asset) => ({ uri: asset.uri, type: asset.mediaType })));
    } else {
      // For albums option, fetch albums and the first item
      const albums = await MediaLibrary.getAlbumsAsync();
      const albumsWithFirstItem = await Promise.all(
        albums.map(async (album) => {
          const assets = await MediaLibrary.getAssetsAsync({
            mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
            album: album.id,
            first: 1, // Get only the first item
          });

          return {
            ...album,
            firstItem: assets.assets.length > 0 ? assets.assets[0].uri : null, // Include the first image or video if available
          };
        })
      );
      setAlbums(albumsWithFirstItem);
    }

    setLoading(false);
  };

  const toggleSelection = (uri: string) => {
    setSelectedMedia((prev) =>
      prev.includes(uri) ? prev.filter((item) => item !== uri) : [...prev, uri]
    );
  };

  return (
    <ModalBottomToTop visible={visible} onClose={onClose} name="Pick From Gallery" headerContent={null}>
      <View style={{ flex: 1, backgroundColor: theme.background, marginBottom: 80 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", margin: 10 }}>
          <TouchableOpacity style={{borderRadius: 5, padding: 10, backgroundColor: photo? theme.primary : 'transparent'}} onPress={() => {
            setAlbumId('')
            setPhoto(true)
            setSelectedOption("photos")}}>
            <Text style={{ color: theme.textPrimary, fontWeight: "bold" }}>Photos</Text>
          </TouchableOpacity>
          <TouchableOpacity  style={{borderRadius: 5, padding:10, backgroundColor: !photo? theme.primary : 'transparent'}} onPress={() => {
            setPhoto(false)
            setSelectedOption("albums")}}>
            <Text style={{ color: theme.textPrimary, fontWeight: "bold" }}>Albums</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} />
        ) : selectedOption === "photos" ? (
          renderMedia(media, selectedMedia, toggleSelection, theme)
        ) : (
          renderAlbums(albums, theme, setAlbumId, setSelectedOption)
        )}
      </View>

      {mode === "send" ? renderSendMessageMode(selectedMedia, message, setMessage, onSelect, onClose, theme) : renderPickOnlyMode(selectedMedia, onSelect, onClose, theme)}
    </ModalBottomToTop>
  );
};

export default PickFromGallery;
