import { Skill } from "@/src/components/Messages/Chats/chatInterfaces";
import { useState } from "react";
import { ScrollView, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Skills from "../skills";

interface Props {
  skills: Skill[];
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
  currentColors: any;
  startSelect: boolean;
  setStartSelect: (value: boolean)=>void;
  setSkills: (value: { name: string; percentage: string; type: string }[]) => void;
}

export default function SkillsSelection({
  skills,
  selectedSkills,
  setSelectedSkills,
  currentColors,
  startSelect,
  setStartSelect,
  setSkills,
}: Props) {
  const selectedSkillsSet = new Set(selectedSkills);
  const [openSkills, setOpenSkills] = useState(false);

  const closeSkills = () => {
    setOpenSkills(false);
  };


  const handleSkillPress = (name: string) => {
    const updatedSkills = selectedSkillsSet.has(name)
      ? selectedSkills.filter((s) => s !== name)
      : [...selectedSkills, name];

    setSelectedSkills(updatedSkills);
  };

  return (
    <>
      {/* Display available and selected skills count */}
      <Text style={[styles.skillCountText, { color: currentColors.textPrimary }]}>
        {`Selected ${selectedSkills.length} out of ${skills.length} skills`}
      </Text>

      {/* Skills Selection */}
      {skills.length > 0 ? (
        <ScrollView
          horizontal
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {skills.map((item) => (
            <TouchableOpacity
              key={item.name}
              onPress={() => handleSkillPress(item.name)}
              style={[
                styles.skillButton,
                {
                  backgroundColor: selectedSkillsSet.has(item.name)
                    ? currentColors.primary
                    : currentColors.card,
                },
              ]}
            >
              <View
                style={[
                  styles.skillContainer,
                  {
                    backgroundColor: selectedSkillsSet.has(item.name)
                      ? currentColors.primary
                      : currentColors.tint,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.skillText,
                    {
                      color: selectedSkillsSet.has(item.name)
                        ? 'white'
                        : currentColors.textPrimary,
                    },
                  ]}
                >
                  {item.name}
                </Text>
                <Text
                  style={[
                    styles.skillText,
                    {
                      color: selectedSkillsSet.has(item.name)
                        ? 'white'
                        : currentColors.textPrimary,
                    },
                  ]}
                >
                  {item.percentage}%
                </Text>
                <Text
                  style={[
                    styles.skillText,
                    {
                      color: selectedSkillsSet.has(item.name)
                        ? 'white'
                        : currentColors.textPrimary,
                    },
                  ]}
                >
                  ({item.type})
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: currentColors.buttonBackground,
            borderRadius: 5,
            marginVertical: 10,
            justifyContent: 'center',
          }}
          onPress={() => setOpenSkills(true)}
        >
          <Text style={{ color: currentColors.textSecondary }}>Add Skills</Text>
        </TouchableOpacity>
      )}
      <Skills visible={openSkills} onClose={closeSkills} skills={skills} setSkills={setSkills} currentColors={currentColors} startSelect={startSelect} setStartSelect={setStartSelect}/>
    </>
  );
}

const styles = StyleSheet.create({
  skillCountText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  scrollView: {
    maxHeight: 150,
    marginVertical: 10,
  },
  scrollContent: {
    flexDirection: "row",
  },
  skillButton: {
    padding: 8,
    borderRadius: 8,
    margin: 3,
    flexDirection: "row",
  },
  skillContainer: {
    flexDirection: "row",
    padding: 5,
    borderRadius: 5,
  },
  skillText: {
    marginRight: 5,
  },
});
