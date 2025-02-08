import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Colors } from "@/constants/Colors";
import ModalRightToLeft from "@/models/ModalRightToLeft";
import { addFilter } from "./filterService";

const availableIcons = [
    { label: "Filter", value: "filter" },
    { label: "Search", value: "search" },
    { label: "Sort", value: "sort" },
    { label: "Funnel", value: "filter" },
    { label: "Tachometer", value: "tachometer" },
    { label: "Tag", value: "tag" },
    { label: "Check Circle", value: "check-circle" },
    { label: "Circle", value: "circle" },
    { label: "Th Large", value: "th-large" },
    { label: "List", value: "list" },
    { label: "Search Plus", value: "search-plus" },
    { label: "Search Minus", value: "search-minus" },
    { label: "Arrow Down", value: "arrow-down" },
    { label: "Arrow Up", value: "arrow-up" },
    { label: "Sort Ascending", value: "sort" },
    { label: "Rss", value: "rss" },
    { label: "Filter Circle", value: "circle" },
    { label: "Sort By Alpha", value: "sort-alpha-down" },
    { label: "Adjust", value: "adjust" },
    { label: "Trello", value: "trello" },
    { label: "Chevron Down", value: "chevron-down" },
    { label: "Chevron Up", value: "chevron-up" },
  ];  
  
const AddFilterScreen = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const [filterName, setFilterName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("list");
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const handleAddFilter = async () => {
    if (!filterName.trim()) {
      Alert.alert("Error", "Filter name cannot be empty");
      return;
    }

    await addFilter(filterName, selectedIcon);
    Alert.alert("Success", "Filter added successfully!");
    setFilterName("");
    onClose();
  };

  return (
    <ModalRightToLeft
      visible={visible}
      onClose={onClose}
      name="Add Filter"
      headerContent={<Text style={[styles.headerText, { color: theme.text }]}>Create New Filter</Text>}
    >
      <View style={[styles.modalBody, { backgroundColor: theme.background }]}>
        <TextInput
          placeholder="Enter filter name"
          value={filterName}
          onChangeText={setFilterName}
          style={[
            styles.input,
            { backgroundColor: theme.inputBackground, color: theme.inputText, borderColor: theme.textSecondary },
          ]}
          placeholderTextColor={theme.textSecondary}
        />

        <Text style={[styles.label, { color: theme.text }]}>Select Icon:</Text>
        <View style={[styles.pickerContainer, { borderColor: theme.textSecondary }]}>
          <Picker
            selectedValue={selectedIcon}
            onValueChange={(itemValue) => setSelectedIcon(itemValue)}
            style={[styles.picker, { color: isTablet? theme.background : theme.text }]}
            dropdownIconColor={theme.text}
          >
            {availableIcons.map((icon) => (
              <Picker.Item key={icon.value} label={icon.label} value={icon.value} />
            ))}
          </Picker>
        </View>

        <View style={styles.iconPreview}>
          <Text style={{ color: theme.text }}>Selected Icon: </Text>
          <Icon name={selectedIcon} size={20} color={theme.icon} />
        </View>

        <TouchableOpacity onPress={handleAddFilter} style={[styles.addButton, { backgroundColor: theme.primary }]}>
          <Text style={[styles.addButtonText, { color: theme.framButtonText }]}>Add Filter</Text>
        </TouchableOpacity>
      </View>
    </ModalRightToLeft>
  );
};

const styles = StyleSheet.create({
  modalBody: {
    padding: 20,
    borderRadius: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    width: "100%",
    height: 50,
  },
  iconPreview: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  addButton: {
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  addButtonText: {
    fontWeight: "bold",
  },
});

export default AddFilterScreen;
