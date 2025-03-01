import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome5";
import ModalBottomToTop from "@/models/ModalBottomToTop";
import { Colors } from "@/constants/Colors";
import { CacheKeys, CacheTypes } from "@/src/routes/cacheKeys";
import { getCachedDataByKey, setCachedDataByKey } from "@/src/routes/cache";
import ModalLeftToRight from "@/models/ModalLeftToRight";
import AddUsers from "../addUsers";

const filterType = CacheTypes.FILTER_TYPE;
const filterKey = CacheKeys.FILTER_KEY;

const availableIcons = [
  { label: "Filter", value: "filter" },
  { label: "Search", value: "search" },
  { label: "Sort", value: "sort" },
  { label: "Tachometer", value: "tachometer" },
  { label: "Tag", value: "tag" },
  { label: "Check Circle", value: "check-circle" },
  { label: "Circle", value: "circle" },
  { label: "List", value: "list" },
  { label: "Search Plus", value: "search-plus" },
  { label: "Arrow Down", value: "arrow-down" },
];

interface EditFilterModalProps {
  visible: boolean;
  onClose: () => void;
  editFilterValue: string | null; // Name of the filter to edit
  onFilterUpdate: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditFilterModal: React.FC<EditFilterModalProps> = ({
  visible,
  onClose,
  editFilterValue,
  onFilterUpdate,
  setRefresh,
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [filterName, setFilterName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("list");
  const [modalVisible, setModalVisible] = useState(false);
  const [filterId, setFilterId] = useState<number | null>(null);

  useEffect(() => {
    const loadFilterData = async () => {
      const existingFilters =
        (await getCachedDataByKey(filterType, filterKey)) || [];

      const filterToEdit = existingFilters.find(
        (filter: { name: string }) => filter.name === editFilterValue
      );

      if (filterToEdit) {
        setFilterId(filterToEdit.id);
        setFilterName(filterToEdit.name);
        setSelectedIcon(filterToEdit.icon_name);
      }
    };

    if (visible) {
      loadFilterData();
    }
  }, [visible, editFilterValue]);

  const handleSave = async () => {
    if (!filterName.trim()) {
      alert("Filter name cannot be empty");
      return;
    }
    setModalVisible(true)
  };

  return (
    <ModalLeftToRight
      visible={visible}
      onClose={onClose}
      name="Edit Filter"
      headerContent={
        <Text style={[styles.headerText, { color: theme.text }]}>Edit {editFilterValue}</Text>
      }
    >
      <View style={[styles.modalBody, { backgroundColor: theme.background }]}>
        <TextInput
          placeholder="Enter filter name"
          value={filterName}
          onChangeText={setFilterName}
          style={[
            styles.input,
            { backgroundColor: theme.inputBackground, color: theme.text },
          ]}
          placeholderTextColor={theme.textSecondary}
        />

        <Text style={[styles.label, { color: theme.text }]}>Select Icon:</Text>
        <View style={[styles.pickerContainer, { borderColor: theme.textSecondary }]}>
          <Picker
            selectedValue={selectedIcon}
            onValueChange={setSelectedIcon}
            style={[styles.picker, { color: theme.text }]}
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

        <TouchableOpacity
          onPress={handleSave}
          disabled={!filterName.trim()}
          style={[
            styles.saveButton,
            {
              backgroundColor: filterName.trim() ? theme.primary : theme.disabledButton,
              opacity: filterName.trim() ? 1 : 0.5,
            },
          ]}
        >
          <Text style={[styles.saveButtonText, { color: theme.framButtonText }]}>
            Add people or groups
          </Text>
        </TouchableOpacity>
      </View>
      <AddUsers
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        filterName={filterName}
        selectedIcon={selectedIcon}
        onFilterUpdate={onFilterUpdate}
        setRefresh={setRefresh} OldFilterName={editFilterValue}      />
    </ModalLeftToRight>
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
  saveButton: {
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonText: {
    fontWeight: "bold",
  },
});

export default EditFilterModal;
