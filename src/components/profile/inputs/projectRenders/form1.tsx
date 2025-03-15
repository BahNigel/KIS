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
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

const dummyCompanies = ['Google', 'Microsoft', 'Amazon', 'Tesla', 'OpenAI'];
const dummyContributors = ['John Doe', 'Jane Smith', 'Elon Musk', 'Mark Zuckerberg', 'Sundar Pichai'];

export default function ContinueProjectForm({ lowerForm, setLowerForm, setSelectEdit, selectEdit, clearForm }: { 
  lowerForm: any; 
  setLowerForm: (value: any) => void; 
  setSelectEdit: (value: any[]) => void; 
  selectEdit: any[]; clearForm: boolean;
}) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];


   useEffect(() =>{
      if(clearForm){
        setStartDate('');
        setEndDate('');
        setIsCurrent(false);
        setSelectedCompanies([]);
        setSelectedContributors([]);
        setCompanyInput('');
        setFilteredCompanies([]);
        setContributorInput('');
        setFilteredContributors([]);
      }
    },[clearForm])

  const [startDate, setStartDate] = useState(lowerForm?.startDate || '');
  const [endDate, setEndDate] = useState(lowerForm?.endDate || '');
  const [isCurrent, setIsCurrent] = useState(lowerForm?.isCurrent || false);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(lowerForm?.selectedCompanies || []);
  const [selectedContributors, setSelectedContributors] = useState<string[]>(lowerForm?.selectedContributors || []);

  const [companyInput, setCompanyInput] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState<string[]>([]);

  const [contributorInput, setContributorInput] = useState('');
  const [filteredContributors, setFilteredContributors] = useState<string[]>([]);

  // Populate fields when editing
  useEffect(() => {
    if (selectEdit.length > 0) {
      const project = selectEdit[0]; // Assuming single edit at a time
      setStartDate(project.startDate || '');
      setEndDate(project.endDate || '');
      setIsCurrent(project.isCurrent || false);
      setSelectedCompanies(project.selectedCompanies || []);
      setSelectedContributors(project.selectedContributors || []);
    }
  }, [selectEdit]);

  useEffect(() => {
    setLowerForm([{
      startDate,
      endDate,
      isCurrent,
      selectedCompanies,
      selectedContributors,
    }]);
  }, [startDate, endDate, isCurrent, selectedCompanies, selectedContributors]);

  const handleDateInput = (text: string, type: 'start' | 'end') => {
    const formattedDate = text.replace(/[^0-9]/g, '').slice(0, 8);
    const formattedText = formattedDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');

    if (type === 'start') {
      setStartDate(formattedText);
    } else {
      setEndDate(formattedText);
    }
  };

  const handleCompanySearch = (text: string) => {
    setCompanyInput(text);
    setFilteredCompanies(text.length > 0 ? dummyCompanies.filter(c => c.toLowerCase().includes(text.toLowerCase())) : []);
  };

  const handleContributorSearch = (text: string) => {
    setContributorInput(text);
    setFilteredContributors(text.length > 0 ? dummyContributors.filter(c => c.toLowerCase().includes(text.toLowerCase())) : []);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.text }]}>Project Details</Text>

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
        <Text style={{ color: theme.text }}>Still working on this project</Text>
        <Switch value={isCurrent} onValueChange={setIsCurrent} />
      </View>

      {/* Company Selection */}
      <Text style={[styles.label, { color: theme.textSecondary }]}>Company</Text>
      <TextInput
        placeholder="Search or add company"
        value={companyInput}
        onChangeText={handleCompanySearch}
        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText }]}
        placeholderTextColor={theme.textSecondary}
      />

      {filteredCompanies.length > 0 && (
        <ScrollView style={styles.listContainer}>
          {filteredCompanies.map((item) => (
            <TouchableOpacity key={item} onPress={() => setSelectedCompanies([...selectedCompanies, item])} style={[styles.suggestion, { backgroundColor: theme.buttonBackground }]}>
              <Text style={{ color: theme.text }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity onPress={() => setSelectedCompanies([...selectedCompanies, companyInput])} style={[styles.suggestion, { backgroundColor: theme.buttonBackground }]}>
        <Text style={{ color: theme.text }}>Add "{companyInput}"</Text>
      </TouchableOpacity>

      <View style={styles.tagContainer}>
        {selectedCompanies.map((company) => (
          <View key={company} style={[styles.tag, { backgroundColor: theme.buttonSecondary }]}>
            <Text style={{ color: theme.text }}>{company}</Text>
            <TouchableOpacity onPress={() => setSelectedCompanies(selectedCompanies.filter(c => c !== company))}>
              <Ionicons name="close-circle" size={18} color={theme.coloredText} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Contributor Selection */}
      <Text style={[styles.label, { color: theme.textSecondary }]}>Contributors</Text>
      <TextInput
        placeholder="Search or add contributor"
        value={contributorInput}
        onChangeText={handleContributorSearch}
        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText }]}
        placeholderTextColor={theme.textSecondary}
      />

      {filteredContributors.length > 0 && (
        <ScrollView style={styles.listContainer}>
          {filteredContributors.map((item) => (
            <TouchableOpacity key={item} onPress={() => setSelectedContributors([...selectedContributors, item])} style={[styles.suggestion, { backgroundColor: theme.buttonBackground }]}>
              <Text style={{ color: theme.text }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity onPress={() => setSelectedContributors([...selectedContributors, contributorInput])} style={[styles.suggestion, { backgroundColor: theme.buttonBackground }]}>
        <Text style={{ color: theme.text }}>Add "{contributorInput}"</Text>
      </TouchableOpacity>

      <View style={styles.tagContainer}>
        {selectedContributors.map((contributor) => (
          <View key={contributor} style={[styles.tag, { backgroundColor: theme.buttonSecondary }]}>
            <Text style={{ color: theme.text }}>{contributor}</Text>
            <TouchableOpacity onPress={() => setSelectedContributors(selectedContributors.filter(c => c !== contributor))}>
              <Ionicons name="close-circle" size={18} color={theme.coloredText} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  label: { marginBottom: 5 },
  input: { borderRadius: 5, padding: 10, marginBottom: 10 },
  switchContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  listContainer: { maxHeight: 150, marginBottom: 10 },
  suggestion: { padding: 8, marginVertical: 2, borderRadius: 5 },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  tag: { flexDirection: 'row', alignItems: 'center', padding: 5, margin: 5, borderRadius: 5 },
});
