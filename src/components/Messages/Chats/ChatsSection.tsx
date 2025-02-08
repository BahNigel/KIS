import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, Animated, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ListChats from './ListChats'; 
import SearchBarModel from '@/models/searchBarModel';
import { styles } from './chatStyles';
import { ChatsSectionProps } from './chatInterfaces';


const ChatsSection: React.FC<ChatsSectionProps> = ({
  isTablet,
  currentColors,
  searchQuery,
  setSearchQuery,
  filteredChats,
  select,
  setSelectedValue,
  setSelect,
  setAddContacts,
  selectedChats,
  setSelectedChats,
  setSingleUserData,
  viewChart,
  setViewChart,
  setChatRoomModalVisible,
  setChatRoomVisible,
  handleScroll,
}) => {
  return (
    <View>
      {isTablet && (
        <>
          <View style={styles.headerContainer1}>
            <View style={styles.topLayer}>
              <Text style={[styles.archivedText, { color: currentColors.textPrimary }]}>Chats</Text>
              <View style={styles.rightSection1}>
                <TouchableOpacity style={{ marginRight: 20 }} onPress={() => {/* Handle camera action */}}>
                  <Icon name="camera" size={15} color="gray" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {/* Handle hamburger menu */}}>
                  <Icon name="bars" size={15} color="gray" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.centerSection1}>
              <SearchBarModel
                value={searchQuery}
                onSearch={(query) => {
                  setSearchQuery(query);
                }}
              />
            </View>
          </View>
        </>
      )}

      <FlatList
        data={filteredChats}
        renderItem={({ item }) => (
          <ListChats
            chats={[item]}
            select={select}
            setSelectedValue={setSelectedValue}
            setSelect={setSelect}
            selectedChats={selectedChats}
            setSelectedChats={()=>setSelectedChats}
            setSingleUserData={setSingleUserData}
            viewChart={viewChart}
            setViewChart={setViewChart}
            setChatRoomModalVisible={setChatRoomModalVisible}
            setChatRoomVisible={setChatRoomVisible}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      />

      {isTablet && (
        <TouchableOpacity onPress={() => setAddContacts(true)} style={styles.addButton}>
          <Icon name="plus" size={15} color={currentColors.framButtonText} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ChatsSection;
