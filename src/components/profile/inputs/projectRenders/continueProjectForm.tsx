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

export default function ContinueProjectForm({ lowerForm, setLowerForm }: { lowerForm: any, setLowerForm: (value: any) => void }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  const [startDate, setStartDate] = useState(lowerForm?.startDate || '');
  const [endDate, setEndDate] = useState(lowerForm?.endDate || '');
  const [isCurrent, setIsCurrent] = useState(lowerForm?.isCurrent || false);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(lowerForm?.selectedCompanies || []);
  const [selectedContributors, setSelectedContributors] = useState<string[]>(lowerForm?.selectedContributors || []);

  const [companyInput, setCompanyInput] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState<string[]>([]);

  const [contributorInput, setContributorInput] = useState('');
  const [filteredContributors, setFilteredContributors] = useState<string[]>([]);

  useEffect(() => {
    setLowerForm({
      startDate,
      endDate,
      isCurrent,
      selectedCompanies,
      selectedContributors,
    });
  }, [startDate, endDate, isCurrent, selectedCompanies, selectedContributors]);

  const handleDateInput = (text: string, type: 'start' | 'end') => {
    // Format the date as YYYY-MM-DD
    const formattedDate = text.replace(/[^0-9]/g, '').slice(0, 8); // Only take the first 8 digits
    const formattedText = formattedDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    
    if (type === 'start') {
      setStartDate(formattedText);
    } else {
      setEndDate(formattedText);
    }
  };

  const handleCompanySearch = (text: string) => {
    setCompanyInput(text);
    setFilteredCompanies(
      text.length > 0 ? dummyCompanies.filter(c => c.toLowerCase().includes(text.toLowerCase())) : []
    );
  };

  const addCompany = (company: string) => {
    if (company && !selectedCompanies.includes(company)) {
      const updatedCompanies = [...selectedCompanies, company];
      setSelectedCompanies(updatedCompanies);
    }
    setCompanyInput('');
    setFilteredCompanies([]);
  };

  const removeCompany = (company: string) => {
    const updatedCompanies = selectedCompanies.filter(c => c !== company);
    setSelectedCompanies(updatedCompanies);
  };

  const handleContributorSearch = (text: string) => {
    setContributorInput(text);
    setFilteredContributors(
      text.length > 0 ? dummyContributors.filter(c => c.toLowerCase().includes(text.toLowerCase())) : []
    );
  };

  const addContributor = (contributor: string) => {
    if (contributor && !selectedContributors.includes(contributor)) {
      const updatedContributors = [...selectedContributors, contributor];
      setSelectedContributors(updatedContributors);
    }
    setContributorInput('');
    setFilteredContributors([]);
  };

  const removeContributor = (contributor: string) => {
    const updatedContributors = selectedContributors.filter(c => c !== contributor);
    setSelectedContributors(updatedContributors);
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
            <TouchableOpacity key={item} onPress={() => addCompany(item)} style={[styles.suggestion, { backgroundColor: theme.buttonBackground }]}>
              <Text style={{ color: theme.text }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity onPress={() => addCompany(companyInput)} style={[styles.suggestion, { backgroundColor: theme.buttonBackground }]}>
        <Text style={{ color: theme.text }}>Add "{companyInput}"</Text>
      </TouchableOpacity>

      <View style={styles.tagContainer}>
        {selectedCompanies.map((company) => (
          <View key={company} style={[styles.tag, { backgroundColor: theme.buttonSecondary }]}>
            <Text style={{ color: theme.text }}>{company}</Text>
            <TouchableOpacity onPress={() => removeCompany(company)}>
              <Ionicons name="close-circle" size={18} color={theme.coloredText} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

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
            <TouchableOpacity key={item} onPress={() => addContributor(item)} style={[styles.suggestion, { backgroundColor: theme.buttonBackground }]}>
              <Text style={{ color: theme.text }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity onPress={() => addContributor(contributorInput)} style={[styles.suggestion, { backgroundColor: theme.buttonBackground }]}>
        <Text style={{ color: theme.text }}>Add "{contributorInput}"</Text>
      </TouchableOpacity>

      <View style={styles.tagContainer}>
        {selectedContributors.map((contributor) => (
          <View key={contributor} style={[styles.tag, { backgroundColor: theme.buttonSecondary }]}>
            <Text style={{ color: theme.text }}>{contributor}</Text>
            <TouchableOpacity onPress={() => removeContributor(contributor)}>
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
