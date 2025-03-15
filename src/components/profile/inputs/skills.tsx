import React, { useState, useEffect } from 'react';
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
  setSelectEdit,
  selectEdit,
  setOpenAnyModal,
}: {
  visible: boolean;
  onClose: () => void;
  skills: { name: string; percentage: string; skillType: string, type: string }[];
  selectEdit: any[]; // Can contain different objects, but only one skill object
  setSkills: (value: { name: string; percentage: string; skillType: string, type: string }[]) => void;
  currentColors: any;
  startSelect: boolean;
  setStartSelect: (value: boolean) => void;
  setSelectEdit: (value: any[]) => void; setOpenAnyModal: (value: string) => void;
}) {
  const [skillInput, setSkillInput] = useState('');
  const [percentageInput, setPercentageInput] = useState('');
  const [skillType, setSkillType] = useState('Technical Skills');
  const [editingSkill, setEditingSkill] = useState<{ name: string; percentage: string; type: string } | null>(null);
  
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

  // Detect if a skill is in selectEdit and pre-fill the form
  useEffect(() => {
    console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb: ", selectEdit)
    const skillToEdit = selectEdit.find(item => item.name && item.percentage && item.type=='skill');
    if (skillToEdit) {
      setSkillInput(skillToEdit.name);
      setPercentageInput(skillToEdit.percentage);
      setSkillType(skillToEdit.type);
      setEditingSkill(skillToEdit);
    } else {
      resetForm();
    }
  }, [selectEdit]);

  // Reset form fields
  const resetForm = () => {
    setSkillInput('');
    setPercentageInput('');
    setSkillType('Technical Skills');
    setEditingSkill(null);
  };

  const handleAddOrEditSkill = () => {
    if (!skillInput || !percentageInput) return;

    if (isNaN(Number(percentageInput)) || Number(percentageInput) < 0 || Number(percentageInput) > 100) {
      return;
    }

    if (editingSkill) {
      // Update skill
      const updatedSkills = skills.map(skill =>
        skill.name === editingSkill.name ? { name: skillInput, percentage: percentageInput, skillType: skillType, type: 'skill' } : skill
      );

      setSkills(updatedSkills);
      setSelectEdit(selectEdit.filter(item => item !== editingSkill)); // Remove from edit list
      resetForm();
    } else {
      // Check if skill already exists
      const skillExists = skills.some(item => item.name.toLowerCase() === skillInput.toLowerCase());
      if (skillExists) {
        alert('This skill already exists!');
        return;
      }

      // Add new skill
      const newSkill = { name: skillInput, percentage: percentageInput, skillType: skillType, type: 'skill' };
      setSkills([...skills, newSkill]);
      setStartSelect(true);
      resetForm();
    }
  };

  return (
    <ModalRightToLeft
      visible={visible}
      onClose={onClose}
      name="Edit Skills"
      headerContent={
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: currentColors.textPrimary, fontWeight: 'bold' }} onPress={onClose}>
            Edit Skills
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="check" size={24} color={currentColors.primary} />
          </TouchableOpacity>
        </View>
      }
    >
      {/* Skills List */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingBottom: 20, marginTop: 20 }}>
        {skills.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', marginRight: 10 }}>
            {renderSkillItem(item, index, currentColors, skills, setSkills, setStartSelect, selectEdit, setSelectEdit, setOpenAnyModal)}
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

      {/* Add/Edit Skill Button */}
      <TouchableOpacity
        onPress={handleAddOrEditSkill}
        style={{
          backgroundColor: currentColors.primary,
          padding: 10,
          alignItems: 'center',
          borderRadius: 5,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: currentColors.buttonText }}>
          {editingSkill ? 'Edit Skill' : 'Add Skill'}
        </Text>
      </TouchableOpacity>

      {/* Suggested Skills */}
      <Text style={{ color: currentColors.textPrimary, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>
        Suggested Skills
      </Text>

      <FlatList
        data={suggestions}
        style={{ marginVertical: 20 }}
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
        nestedScrollEnabled={true}
      />
    </ModalRightToLeft>
  );
}
