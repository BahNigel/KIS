import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Text, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NavigationButtons from './NavigationButtons';
import { styles } from './chatStyles';
import { FilterSectionProps } from './chatInterfaces';
import EditFilterModal from './EditFilterModal';
import ReorderFilterModal from './ReorderFilterModal';
import { deleteFilter } from './filterService';

const defaultFilters = [
  { name: 'all', icon_name: 'list' },
  { name: 'single', icon_name: 'user' },
  { name: 'group', icon_name: 'users' },
  { name: 'unread', icon_name: 'envelope-open' },
  { name: 'favorite', icon_name: 'star' }
];

const FilterSection: React.FC<FilterSectionProps> = ({
  isTablet,
  setIsArchived,
  isArchived,
  currentColors,
  unreadArchived,
  filters,
  activeFilter,
  setActiveFilter,
  setModalAddFilterVisible,
  route,
  setModalVisible,
  onFilterUpdate,
  setRefresh,
}) => {
  const [filterList, setFilterList] = useState(filters);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [longPressedFilter, setLongPressedFilter] = useState<string | null>(null);
  const [openEditFilter, setOpenEditFilter] = useState(false);
  const [openReorderFilter, setOpenReorderFilter] = useState(false);
  const [editFilterValue, setEditFilterValue] = useState<string | null>(null);
  const [longPress, setLongPress] = useState(false)
  const { width } = Dimensions.get('window');
  const dropdownWidth =  width - 230

  const maxLeft = width - ( dropdownWidth); // Ensure dropdown does not cross the right edge
  const minLeft = 10; // Ensures it does not go beyond the left edge
  
  // Store button refs to calculate position
  const buttonRefs = useRef<{ [key: string]: any }>({});

  // Update filterList whenever filters prop changes
  useEffect(() => {
    setFilterList(filters);
    console.log(filters);
  }, [filters]);

  const handleLongPress = (filterName: string, event: any) => {
    if(filterName !== 'all'){
      setLongPressedFilter(filterName);
      setSelectedFilter(filterName);
      const { pageY, pageX } = event.nativeEvent;
      setDropdownPosition({ top: pageY, left: pageX });
      setShowDropdown(true);
    }
   
  };

  const handleEdit = (Value: string|null) => {
    console.log(`Edit filter: ${selectedFilter}`);
    // Handle the Edit logic here (e.g., open an edit modal)
    setEditFilterValue(Value);
    setShowDropdown(false);
    setLongPressedFilter(null);
    setOpenEditFilter(true)
  };
  const handleCloseEditFilter = () =>{
    setOpenEditFilter(false);
  }
  const handleCloseReorderFilter = () =>{
    setOpenReorderFilter(false);
  }

  const handleDelete = async (value: string | null) => {
    console.log(`Delete filter: ${selectedFilter}`);
    // Handle the Delete logic here (e.g., remove filter from state)
    await deleteFilter(value)
    setShowDropdown(false);
    setLongPressedFilter(null);
    onFilterUpdate();
    setRefresh(true);
  };

  const handleCloseDropdown = () => {
    setLongPressedFilter(null);
    setLongPress(false)
    setShowDropdown(false);
    setSelectedFilter(null);
  };

  return (
    <View>
      {isTablet ? (
        <ScrollView showsHorizontalScrollIndicator={false}>
          <View>
            <View style={styles.achieveSection}>
              <TouchableOpacity
                onPress={() => setIsArchived((prev) => !prev)}
                style={[styles.achieveButton, isArchived ? styles.activeSelectButton : '']}
              >
                <Icon name="archive" size={15} color={isArchived ? 'white' : currentColors.textPrimary} solid={false} />
                <Text style={[styles.archivedText, { color: currentColors.coloredText }]}>{unreadArchived}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.filterSection}>
              <View style={{ flexDirection: 'column', flexWrap: 'wrap' }}>
                {filterList.map((filter) => (
                  <TouchableOpacity
                    key={filter.name}
                    ref={(ref) => buttonRefs.current[filter.name] = ref}
                    style={[{ marginVertical: 4, padding: 10, borderRadius: 5 }, activeFilter === filter.name && styles.activeFilterButton]}
                    onPress={() => setActiveFilter(filter.name)}
                    onLongPress={(event) => handleLongPress(filter.name, event)} // Added event to capture position
                  >
                    <Icon name={filter.icon_name} size={15} color={currentColors.textPrimary} />
                  </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={() => setModalAddFilterVisible(true)} style={styles.openAddFilterButton}>
                  <Icon name="plus" size={15} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <NavigationButtons activeTab={route.name} />
          </View>
        </ScrollView>
      ) : (
        <>
          <View style={styles.filterSection}>
            <Text style={[styles.filterText, { color: currentColors.textPrimary }]}>Filter</Text>
            <FlatList
              horizontal
              contentContainerStyle={styles.filterButtons}
              showsHorizontalScrollIndicator={false}
              data={filterList}
              keyExtractor={(item) => item.name}
              renderItem={({ item: filter, index }) => (
                <>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      activeFilter === filter.name && styles.activeFilterButton,
                      longPressedFilter === filter.name && { backgroundColor: currentColors.tint }
                    ]}
                    onPress={() => setActiveFilter(filter.name)}
                    onLongPress={(event) => handleLongPress(filter.name, event)}
                  >
                    <Text style={[styles.filterButtonText, { color: currentColors.textPrimary }]}>
                      {filter.name}
                    </Text>
                  </TouchableOpacity>
                  {index === filterList.length - 1 && (
                    <TouchableOpacity onPress={() => setModalAddFilterVisible(true)} style={styles.openAddFilterButton}>
                      <Icon name="plus" size={15} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                </>
              )}
            />
          </View>
          <View style={styles.achieveSection}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.achieveButton}>
              <Icon name="archive" size={15} color={currentColors.textPrimary} solid={false} />
              <Text style={[styles.archivedText, { color: currentColors.textPrimary }]}>Archived</Text>
              <Text style={[styles.archivedText, { color: currentColors.coloredText }]}>{unreadArchived}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Dropdown for Edit/Delete */}
      {showDropdown && (
        <TouchableWithoutFeedback onPress={handleCloseDropdown}>
          <View style={[styles.dropdownContainer]}>
            <View style={[styles.dropdownMenu,{backgroundColor: currentColors.tint}, { top:  110, left: Math.max(minLeft, Math.min(dropdownPosition.left - 15, maxLeft)) }]}>
              {selectedFilter !== 'all' && (
                <View style={{paddingHorizontal: 20}}>
                  <TouchableOpacity
                    onPress={() => handleEdit(longPressedFilter)}
                    style={styles.dropdownOption}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      <Icon name="edit" size={16} color={currentColors.textPrimary} style={{ marginRight: 10 }} />
                      <Text style={styles.dropdownOptionText}>Edit</Text>
                    </View>
                  </TouchableOpacity>

                  {!defaultFilters.some(f => f.name === selectedFilter) && (
                    <TouchableOpacity
                      onPress={() => handleDelete(selectedFilter)}
                      style={styles.dropdownOption}
                    >
                      <View style={{ flexDirection: 'row' }}>
                        <Icon name="trash" size={16} color={currentColors.textPrimary} style={{ marginRight: 10 }} />
                        <Text style={styles.dropdownOptionText}>Delete</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          
          </View>
        </TouchableWithoutFeedback>
      )}
      <EditFilterModal visible={openEditFilter} onClose={handleCloseEditFilter} editFilterValue={editFilterValue} onFilterUpdate={onFilterUpdate} setRefresh={setRefresh}/>
    </View>
  );
};

export default FilterSection;
