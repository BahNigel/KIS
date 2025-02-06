import React from 'react';
import { View, TextInput, TextInputProps, useColorScheme, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Colors } from '@/constants/Colors';

interface SearchBarProps extends TextInputProps {
  value: string;
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBarModel: React.FC<SearchBarProps> = ({
  value,
  onSearch,
  placeholder = 'Search by name, contact, or date',
  ...props
}) => {
  const scheme = useColorScheme();
  const currentColors = Colors[scheme ?? 'light'];

  return (
    <View style={[styles.searchBarContainer, { backgroundColor: currentColors.inputBackground }]}>
      <Icon name="search" size={18} style={styles.searchIcon} color={currentColors.icon} />
      <TextInput
        style={[styles.searchInput, { color: currentColors.inputText }]}
        placeholder={placeholder}
        placeholderTextColor={currentColors.textSecondary}
        value={value}
        onChangeText={onSearch}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 10,
    marginVertical: 5,
    marginBottom: 30,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
});

export default SearchBarModel;
