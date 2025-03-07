import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, Button, ScrollView } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Skills from "./inputs/skills"; // Assuming this is a component for skills form/modal
import { handleRemoveProject, renderSkillItem } from "./profileActions";
import Projects from "./inputs/projects";
import { Project } from "../Messages/Chats/chatInterfaces";
import Ionicons from "react-native-vector-icons/Ionicons";

const JobInputs = ({ currentColors }:{currentColors: any}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [education, setEducation] = useState<any>([]);
  const [experience, setExperience] = useState<any>([]);
  const [services, setServices] = useState<any>([]);
  const [skills, setSkills] = useState<any>([]);
  const [certificates, setCertificates] = useState<any>([]);
  const [startSelect, setStartSelect] = useState(false);
  const [startSelectProject, setStartSelectProject] = useState(false);

  // Modal visibility states
  const [openSkills, setOpenSkills] = useState(false);
  const [openProjects, setOpenProjects] = useState(false);
  const [openEducation, setOpenEducation] = useState(false);
  const [openExperience, setOpenExperience] = useState(false);
  const [openServices, setOpenServices] = useState(false);
  const [openCertificates, setOpenCertificates] = useState(false);

  // Function to close modals
  const closeSkills = () => setOpenSkills(false);
  const closeProjects = () => setOpenProjects(false);
  const closeEducation = () => setOpenEducation(false);
  const closeExperience = () => setOpenExperience(false);
  const closeServices = () => setOpenServices(false);
  const closeCertificates = () => setOpenCertificates(false);

  return (
    <View>
      {/* Skills Section */}
      <Text style={{color:currentColors.textSecondary, marginVertical: 20}}>Advance Options</Text>
      <View style={{ marginVertical: 10, flexDirection: "row", alignItems: "center" }}>
        <MaterialCommunityIcons name="tools" size={34} color={currentColors.textSecondary} />
        <View
            style={{
                borderBottomWidth: 1,
                borderBottomColor: currentColors.textSecondary,
                marginBottom: 10,
                marginLeft: 10,
                flex: 1,
                maxHeight: 60,
            }}
            >
                <Text style={{color: currentColors.textSecondary}}>Skills</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{
                marginTop: 10,
                borderBottomWidth: 1,
                borderBottomColor: currentColors.textSecondary,
                }}
            >
                {skills.map((item: any, index: any) => (
                <View key={index} style={{ flexDirection: 'row', marginRight: 10 }}>
                    {/* Pass necessary props to renderSkillItem */}
                    {renderSkillItem(item,index,currentColors,skills,setSkills,setStartSelect)}
                </View>
                ))}
            </ScrollView>
            </View>

        <TouchableOpacity onPress={() => setOpenSkills(true)}>
          <MaterialCommunityIcons name="plus" size={34} color={currentColors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Projects Section */}
      <View style={{ marginVertical: 10, flexDirection: "row", alignItems: "center" }}>
        <MaterialCommunityIcons name="account-wrench" size={34} color={currentColors.textSecondary} />
        <View style={{maxHeight: 60, borderBottomWidth: 1, borderBottomColor: currentColors.textSecondary, marginBottom: 10,marginLeft: 10, flex: 1,}}>
          {/* Display added projects */}
          <Text style={{color: currentColors.textSecondary}}>Projects</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {projects.map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', marginVertical: 5 }}>
                {renderSkillItem(item,index,currentColors,projects,setProjects, setStartSelectProject, )}
              </View>
            ))}
          </ScrollView>
        </View>
        <TouchableOpacity onPress={() => setOpenProjects(true)}>
          <MaterialCommunityIcons name="plus" size={34} color={currentColors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Education Section */}
      <View style={{ marginVertical: 10, flexDirection: "row", alignItems: "center" }}>
        <MaterialCommunityIcons name="school" size={34} color={currentColors.textSecondary} />
        <TextInput
          style={{
            height: 40,
            borderBottomWidth: 1,
            borderBottomColor: currentColors.textSecondary,
            marginBottom: 10,
            color: currentColors.textPrimary,
            marginLeft: 10,
            flex: 1,
          }}
          placeholder="Education"
          placeholderTextColor={currentColors.textSecondary}
          value={education}
          onChangeText={setEducation}
        />
        <TouchableOpacity onPress={() => setOpenEducation(true)}>
          <MaterialCommunityIcons name="plus" size={34} color={currentColors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Experience Section */}
      <View style={{ marginVertical: 10, flexDirection: "row", alignItems: "center" }}>
        <MaterialCommunityIcons name="briefcase" size={34} color={currentColors.textSecondary} />
        <TextInput
          style={{
            height: 40,
            borderBottomWidth: 1,
            borderBottomColor: currentColors.textSecondary,
            marginBottom: 10,
            color: currentColors.textPrimary,
            marginLeft: 10,
            flex: 1,
          }}
          placeholder="Experience"
          placeholderTextColor={currentColors.textSecondary}
          value={experience}
          onChangeText={setExperience}
        />
        <TouchableOpacity onPress={() => setOpenExperience(true)}>
          <MaterialCommunityIcons name="plus" size={34} color={currentColors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Services Section */}
      <View style={{ marginVertical: 10, flexDirection: "row", alignItems: "center" }}>
        <MaterialCommunityIcons name="account-cog" size={34} color={currentColors.textSecondary} />
        <TextInput
          style={{
            height: 40,
            borderBottomWidth: 1,
            borderBottomColor: currentColors.textSecondary,
            marginBottom: 10,
            color: currentColors.textPrimary,
            marginLeft: 10,
            flex: 1,
          }}
          placeholder="Services"
          placeholderTextColor={currentColors.textSecondary}
          value={services}
          onChangeText={setServices}
        />
        <TouchableOpacity onPress={() => setOpenServices(true)}>
          <MaterialCommunityIcons name="plus" size={34} color={currentColors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Certificates Section */}
      <View style={{ marginVertical: 10, flexDirection: "row", alignItems: "center" }}>
        <MaterialCommunityIcons name="certificate" size={34} color={currentColors.textSecondary} />
        <TextInput
          style={{
            height: 40,
            borderBottomWidth: 1,
            borderBottomColor: currentColors.textSecondary,
            marginBottom: 10,
            color: currentColors.textPrimary,
            marginLeft: 10,
            flex: 1,
          }}
          placeholder="Certificates"
          placeholderTextColor={currentColors.textSecondary}
          value={certificates}
          onChangeText={setCertificates}
        />
        <TouchableOpacity onPress={() => setOpenCertificates(true)}>
          <MaterialCommunityIcons name="plus" size={34} color={currentColors.textSecondary} />
        </TouchableOpacity>
      </View>

        <Skills visible={openSkills} onClose={closeSkills} skills={skills} setSkills={setSkills} currentColors={currentColors} startSelect={startSelect} setStartSelect={setStartSelect}/>
        <Projects
  visible={openProjects} 
  onClose={closeProjects} 
  skills={skills} 
  setSkills={setSkills} 
  projects={projects} 
  setProjects={setProjects} 
  currentColors={currentColors}  
  startSelect={startSelectProject} 
  setStartSelect={setStartSelectProject} 
/>

    </View>
  );
};

export default JobInputs;
