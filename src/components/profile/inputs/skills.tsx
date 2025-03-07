import React, { useState } from 'react';
import { Text, TouchableOpacity, ScrollView, TextInput, View, FlatList } from 'react-native';
import ModalRightToLeft from '@/models/ModalRightToLeft';
import { Picker } from '@react-native-picker/picker';
import { renderSkillItem } from '../profileActions';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Skills({
  visible,
  onClose,
  skills,
  setSkills,
  currentColors,
  startSelect,
   setStartSelect,
}: {
  visible: boolean;
  onClose: () => void;
  skills: { name: string; percentage: string; type: string }[];
  setSkills: (value: { name: string; percentage: string; type: string }[]) => void;
  currentColors: any;startSelect:boolean; setStartSelect: (value: boolean)=>void;
}) {
  const [skillInput, setSkillInput] = useState('');
  const [percentageInput, setPercentageInput] = useState('');
  const [skillType, setSkillType] = useState('Technical Skills');
  const [suggestions] = useState([
    'JavaScript',
    'React',
    'Node.js',
    'Python',
    'Django',
    'Java',
    'HTML',
    'CSS',
    'SQL',
    'TypeScript',
    'Swift',
    'Kotlin',
    'Ruby',
    'Go',
    'C++',
  ]);

  const handleAddSkill = () => {
    if (!skillInput || !percentageInput) return;
  
    if (isNaN(Number(percentageInput)) || Number(percentageInput) < 0 || Number(percentageInput) > 100) {
      return;
    }
  
    // Check if name already exists (case insensitive)
    const skillExists = skills.some((item) => item.name.toLowerCase() === skillInput.toLowerCase());
  
    if (skillExists) {
      alert("This name has already been added!"); // Optional: Replace with a better UI feedback mechanism
      return;
    }
  
    const newSkill = { name: skillInput, percentage: percentageInput, type: skillType };
    const updatedSkills = [...skills, newSkill]; // Add new name to the list
  
    setStartSelect(true);
    setSkills(updatedSkills);
    setSkillInput('');
    setPercentageInput('');
  };
  

  

  return (
    <ModalRightToLeft
      visible={visible}
      onClose={onClose}
      name="Edit Skills"
      headerContent={
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Text style={{ color: currentColors.textPrimary, fontWeight: 'bold' }} onPress={onClose}>
             Edit Skills
            </Text>
            <TouchableOpacity onPress={onClose}>
                <Icon name='check' size={24} color={currentColors.primary}/>    
            </TouchableOpacity>   
        </View>
        
      }
    >
        {/* Skills List (Horizontal Scroll) */}
        <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={{paddingBottom: 20, marginTop: 20 }}
        >
        {skills.map((item, index) => (
            <View key={index} style={{ flexDirection: 'row', marginRight: 10 }}>
            {/* Pass necessary props to renderSkillItem */}
            {renderSkillItem(item,index,currentColors,skills,setSkills,setStartSelect)}
            </View>
        ))}
        </ScrollView>
      <Text style={{ color: currentColors.textPrimary, fontWeight: 'bold', marginVertical: 20 }}>
        Enter Skills, Mastery Percentage, and Skill Type
      </Text>

      {/* Skill Input */}
      <TextInput
        value={skillInput}
        onChangeText={setSkillInput}
        placeholder="Enter name (e.g., JavaScript)"
        placeholderTextColor={currentColors.textSecondary}
        style={{
          padding: 10,
          borderWidth: 1,
          borderColor: currentColors.textSecondary,
          borderRadius: 5,
          color: currentColors.textPrimary,
          backgroundColor: currentColors.inputBackground,
          marginBottom: 10,
        }}
      />

      {/* Mastery Percentage Input */}
      <TextInput
        value={percentageInput}
        onChangeText={setPercentageInput}
        placeholder="Enter mastery percentage (0-100)"
        placeholderTextColor={currentColors.textSecondary}
        keyboardType="numeric"
        style={{
          padding: 10,
          borderWidth: 1,
          borderColor: currentColors.textSecondary,
          borderRadius: 5,
          color: currentColors.textPrimary,
          backgroundColor: currentColors.inputBackground,
          marginBottom: 10,
        }}
      />

      {/* Skill Type Picker */}
      <Text style={{ color: currentColors.textPrimary, fontWeight: 'bold', marginBottom: 10 }}>Select Skill Type</Text>

      <Picker
        selectedValue={skillType}
        onValueChange={(itemValue: React.SetStateAction<string>) => setSkillType(itemValue)}
        style={{
          height: 50,
          color: currentColors.textPrimary,
          backgroundColor: currentColors.inputBackground,
          marginBottom: 10,
        }}
      >
        <Picker.Item label="Technical Skills" value="Technical Skills" />
        <Picker.Item label="Soft Skills" value="Soft Skills" />
        <Picker.Item label="Management Skills" value="Management Skills" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      {/* Add Skill Button */}
      <TouchableOpacity
        onPress={handleAddSkill}
        style={{
          backgroundColor: currentColors.primary,
          padding: 10,
          alignItems: 'center',
          borderRadius: 5,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: currentColors.buttonText }}>Add Skill</Text>
      </TouchableOpacity>

      {/* Suggested Skills */}
      <Text style={{ color: currentColors.textPrimary, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>
        Suggested Skills
      </Text>

      <FlatList
        data={suggestions}
        style={{marginVertical: 20,}}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSkillInput(item)}
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: currentColors.textSecondary,
            }}
          >
            <Text style={{ color: currentColors.textPrimary }}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        nestedScrollEnabled={true} // ✅ Important when nested inside another FlatList
      />
    </ModalRightToLeft>
  );
}
