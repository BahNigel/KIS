import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import EducationStyles from './styles';

const dummyLectures = ['Math 101', 'History 202', 'Physics 303', 'Computer Science 404'];
const dummyMentors = ['Dr. John Doe', 'Prof. Jane Smith', 'Dr. Elon Musk', 'Prof. Mark Zuckerberg'];

const styles = EducationStyles;

export default function EducationForm({ lowerForm, setLowerForm, setSelectEdit, selectEdit, clearForm }: { 
  lowerForm: any; 
  setLowerForm: (value: any) => void; 
  setSelectEdit: (value: any[]) => void; 
  selectEdit: any[]; clearForm: boolean;
}) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  useEffect(() => {
    if(clearForm){
      setStartDate('');
      setEndDate('');
      setIsCurrent(false);
      setSelectedLectures([]);
      setSelectedMentors([]);
      setLectureInput('');
      setFilteredLectures([]);
      setMentorInput('');
      setFilteredMentors([]);
    }
  }, [clearForm]);

  const [startDate, setStartDate] = useState(lowerForm?.startDate || '');
  const [endDate, setEndDate] = useState(lowerForm?.endDate || '');
  const [isCurrent, setIsCurrent] = useState(lowerForm?.isCurrent || false);
  const [selectedLectures, setSelectedLectures] = useState<string[]>(lowerForm?.selectedLectures || []);
  const [selectedMentors, setSelectedMentors] = useState<string[]>(lowerForm?.selectedMentors || []);

  const [lectureInput, setLectureInput] = useState('');
  const [filteredLectures, setFilteredLectures] = useState<string[]>([]);

  const [mentorInput, setMentorInput] = useState('');
  const [filteredMentors, setFilteredMentors] = useState<string[]>([]);

  // Populate fields when editing
  useEffect(() => {
    if (selectEdit.length > 0) {
      const project = selectEdit[0]; // Assuming single edit at a time
      setStartDate(project.startDate || '');
      setEndDate(project.endDate || '');
      setIsCurrent(project.isCurrent || false);
      setSelectedLectures(project.selectedLectures || []);
      setSelectedMentors(project.selectedMentors || []);
    }
  }, [selectEdit]);

  useEffect(() => {
    setLowerForm([{
      startDate,
      endDate,
      isCurrent,
      selectedLectures,
      selectedMentors,
    }]);
  }, [startDate, endDate, isCurrent, selectedLectures, selectedMentors]);

  const handleDateInput = (text: string, type: 'start' | 'end') => {
    const formattedDate = text.replace(/[^0-9]/g, '').slice(0, 8);
    const formattedText = formattedDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');

    if (type === 'start') {
      setStartDate(formattedText);
    } else {
      setEndDate(formattedText);
    }
  };

  const handleLectureSearch = (text: string) => {
    setLectureInput(text);
    setFilteredLectures(text.length > 0 ? dummyLectures.filter(l => l.toLowerCase().includes(text.toLowerCase())) : []);
  };

  const handleMentorSearch = (text: string) => {
    setMentorInput(text);
    setFilteredMentors(text.length > 0 ? dummyMentors.filter(m => m.toLowerCase().includes(text.toLowerCase())) : []);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.text }]}>Course Details</Text>

      <Text style={[styles.label, { color: theme.textSecondary }]}>Start Date</Text>
      <TextInput
        placeholder="YYYY-MM-DD"
        value={startDate}
        onChangeText={(text) => handleDateInput(text, 'start')}
        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText }]}
        keyboardType="numeric"
        placeholderTextColor={theme.textSecondary}
      />

      {!isCurrent && (
        <>
          <Text style={[styles.label, { color: theme.textSecondary }]}>End Date</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            value={endDate}
            onChangeText={(text) => handleDateInput(text, 'end')}
            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText }]}
            keyboardType="numeric"
            placeholderTextColor={theme.textSecondary}
          />
        </>
      )}

      <View style={styles.switchContainer}>
        <Text style={{ color: theme.text }}>Still studying this course</Text>
        <Switch value={isCurrent} onValueChange={setIsCurrent} />
      </View>

      {/* Lecture Selection */}
      <Text style={[styles.label, { color: theme.textSecondary }]}>Lectures</Text>
      <TextInput
        placeholder="Search or add lecture"
        value={lectureInput}
        onChangeText={handleLectureSearch}
        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText }]}
        placeholderTextColor={theme.textSecondary}
      />

      {filteredLectures.length > 0 && (
        <ScrollView style={styles.listContainer}>
          {filteredLectures.map((item) => (
            <TouchableOpacity key={item} onPress={() => setSelectedLectures([...selectedLectures, item])} style={[styles.suggestion, { backgroundColor: theme.buttonBackground }]}>
              <Text style={{ color: theme.text }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity onPress={() => setSelectedLectures([...selectedLectures, lectureInput])} style={[styles.suggestion, { backgroundColor: theme.buttonBackground }]}>
        <Text style={{ color: theme.text }}>Add "{lectureInput}"</Text>
      </TouchableOpacity>

      <View style={styles.tagContainer}>
        {selectedLectures.map((lecture) => (
          <View key={lecture} style={[styles.tag, { backgroundColor: theme.buttonSecondary }]}>
            <Text style={{ color: theme.text }}>{lecture}</Text>
            <TouchableOpacity onPress={() => setSelectedLectures(selectedLectures.filter(l => l !== lecture))}>
              <Ionicons name="close-circle" size={18} color={theme.coloredText} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Mentor Selection */}
      <Text style={[styles.label, { color: theme.textSecondary }]}>Mentors</Text>
      <TextInput
        placeholder="Search or add mentor"
        value={mentorInput}
        onChangeText={handleMentorSearch}
        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText }]}
        placeholderTextColor={theme.textSecondary}
      />

      {filteredMentors.length > 0 && (
        <ScrollView style={styles.listContainer}>
          {filteredMentors.map((item) => (
            <TouchableOpacity key={item} onPress={() => setSelectedMentors([...selectedMentors, item])} style={[styles.suggestion, { backgroundColor: theme.buttonBackground }]}>
              <Text style={{ color: theme.text }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity onPress={() => setSelectedMentors([...selectedMentors, mentorInput])} style={[styles.suggestion, { backgroundColor: theme.buttonBackground }]}>
        <Text style={{ color: theme.text }}>Add "{mentorInput}"</Text>
      </TouchableOpacity>

      <View style={styles.tagContainer}>
        {selectedMentors.map((mentor) => (
          <View key={mentor} style={[styles.tag, { backgroundColor: theme.buttonSecondary }]}>
            <Text style={{ color: theme.text }}>{mentor}</Text>
            <TouchableOpacity onPress={() => setSelectedMentors(selectedMentors.filter(m => m !== mentor))}>
              <Ionicons name="close-circle" size={18} color={theme.coloredText} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
