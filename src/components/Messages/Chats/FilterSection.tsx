import React from 'react';
import { View, FlatList, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NavigationButtons from './NavigationButtons';
import { styles } from './chatStyles';
import { FilterSectionProps } from './chatInterfaces';


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
}) => {
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
                {filters.map((filter) => (
                  <TouchableOpacity
                    key={filter.name}
                    style={[{ marginVertical: 4, padding: 10, borderRadius: 5 }, activeFilter === filter.name && styles.activeFilterButton]}
                    onPress={() => setActiveFilter(filter.name)}
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
              data={filters}
              renderItem={({ item: filter, index }) => (
                <>
                  <TouchableOpacity
                    key={filter.name}
                    style={[styles.filterButton, activeFilter === filter.name && styles.activeFilterButton]}
                    onPress={() => setActiveFilter(filter.name)}
                  >
                    <Text style={[styles.filterButtonText, { color: currentColors.textPrimary }]}>{filter.name}</Text>
                  </TouchableOpacity>

                  {index === filters.length - 1 && (
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
    </View>
  );
};

export default FilterSection;
