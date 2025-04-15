import { Skill } from "@/src/components/Messages/Chats/chatInterfaces";
import { useState } from "react";
import { ScrollView, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Skills from "../skills";
import handleSkillPress from "./action";
import { SkillsSelectionProps } from "./interface";
import styles from "./styles";


export default function SkillsSelection({
  skills,
  selectedSkills,
  setSelectedSkills,
  currentColors,
  startSelect,
  setStartSelect,
  setSkills,
  setSelectEdit, 
  selectEdit,
  setOpenAnyModal,
}: SkillsSelectionProps) {
  const selectedSkillsSet = new Set(selectedSkills);
  const [openSkills, setOpenSkills] = useState(false);

  const closeSkills = () => {
    setOpenSkills(false);
  };

  return (
    <>
      {/* Display available and selected skills count */}
      <Text style={[styles.skillCountText, { color: currentColors.textPrimary }]}>
        {`Selected ${selectedSkills?.length} out of ${skills?.length} skills`}
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
              onPress={() => handleSkillPress({name: item.name, selectedSkillsSet, selectedSkills, setSelectedSkills})}
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
      <Skills visible={openSkills} onClose={closeSkills} skills={skills} setSkills={setSkills} currentColors={currentColors} startSelect={startSelect} setStartSelect={setStartSelect}
      setSelectEdit={setSelectEdit} selectEdit={selectEdit} setOpenAnyModal={setOpenAnyModal}
      />
    </>
  );
}


