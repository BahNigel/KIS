import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, Button, ScrollView } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Skills from "./inputs/skills"; // Assuming this is a component for skills form/modal
import { handleRemoveEntry, renderSkillItem } from "./profileActions";
import Projects from "./inputs/projects";
import { Education, Experience, Project } from "../Messages/Chats/chatInterfaces";
import Ionicons from "react-native-vector-icons/Ionicons";
import Educations from "./inputs/Education";
import Experiences from "./inputs/experience";

const JobInputs = ({ currentColors }:{currentColors: any}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [services, setServices] = useState<any>([]);
  const [skills, setSkills] = useState<any>([]);
  const [certificates, setCertificates] = useState<any>([]);
  const [startSelect, setStartSelect] = useState(false);
  const [startSelectProject, setStartSelectProject] = useState(false);
  const [startSelectEducation, setStartSelectEducation] = useState(false);
  const [startSelectExperience, setStartSelectExperience] = useState(false);
  const [selectEdit, setSelectEdit] = useState<any[]>([]);
  const [openAnyModal, setOpenAnyModal] = useState('');

  const [projectForm, setProjectForm] = useState<Project>({
      id: 1,
      name: '',
      description: '',
      skills: skills, // Set initial skills to the passed skills
      selectedSkills: [],
      mediaType: 'file',
      media: '',
      isCurrent: false,
      endDate: '',
      selectedCompanies: [],
      selectedContributors: [],
      startDate: '',
      files: [],
      type: 'project'
    });

    const [educationForm, setEducationForm] = useState<Education>({
      id: 1,
      name: '',
      degree: '',
      description: '',
      field: '',
      skills: skills, // Set initial skills to the passed skills
      selectedSkills: [],
      mediaType: 'file',
      media: '',
      isCurrent: false,
      endDate: '',
      grades: '',
      activites: '',
      startDate: '',
      files: [],
      type: 'education',
      lectures: '',
      mentors: '',
    });
  const [experienceForm, setExperienceForm] = useState<any>({
    id: 1,
    name: '',
    employmentType: '',
    location: '',
    whereFound: '',
    company: '',
    position: '',
    description: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    type: 'experience',
    files: [],
  });

  // Modal visibility states
  const [openSkills, setOpenSkills] = useState(false);
  const [openProjects, setOpenProjects] = useState(false);
  const [openEducation, setOpenEducation] = useState(false);
  const [openExperience, setOpenExperience] = useState(false);
  const [openServices, setOpenServices] = useState(false);
  const [openCertificates, setOpenCertificates] = useState(false);

  useEffect(()=>{
  }, [openProjects])

  useEffect(()=>{
    if (selectEdit.length > 0) {
      const projectToEdit = selectEdit.find(item => item.name && item.type=='project');
      const educationToEdite = selectEdit.find(item => item.name && item.type=='education');
      setProjectForm(projectToEdit);
      setEducationForm(educationToEdite)
    }
  }, [selectEdit])
    

  useEffect(()=>{
    switch (openAnyModal) {
      case 'skill':
        if (!openSkills) {
          setOpenSkills(true);
        }
        break;
      case 'project':
        if (!openProjects && selectEdit.some(item => item.type === "project")) { 
          setOpenProjects(true);
        }      
        break;
      case 'education':
        if (!openEducation && selectEdit.some(item => item.type === "education")) { 
          setOpenEducation(true);
        } 
        break
      case 'experience':
        if (!openExperience && selectEdit.some(item => item.type === "experience")) {
          console.log('Experience Modal Opened');
          setOpenExperience(true);
        } 
        break;
      default:
        break;
    }    
  }, [selectEdit])

  // Function to close modals
  const closeSkills = () => setOpenSkills(false);
  const closeProjects = () => setOpenProjects(false);
  const toggleProjects = (value: boolean) => setOpenProjects(value);
  const toggleEducation = (value: boolean) => setOpenEducation(value);
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
                    {renderSkillItem(item,index,currentColors,skills,setSkills,setStartSelect, selectEdit, setSelectEdit, setOpenAnyModal)}
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
                {renderSkillItem(item,index,currentColors,projects,setProjects, setStartSelectProject, selectEdit, setSelectEdit, setOpenAnyModal)}
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
        <View style={{maxHeight: 60, borderBottomWidth: 1, borderBottomColor: currentColors.textSecondary, marginBottom: 10,marginLeft: 10, flex: 1,}}>
          {/* Display added projects */}
          <Text style={{color: currentColors.textSecondary}}>Education</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {education.map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', marginVertical: 5 }}>
                {renderSkillItem(item,index,currentColors,education,setEducation, setStartSelectEducation, selectEdit, setSelectEdit, setOpenAnyModal)}
              </View>
            ))}
          </ScrollView>
        </View>
        <TouchableOpacity onPress={() => setOpenEducation(true)}>
          <MaterialCommunityIcons name="plus" size={34} color={currentColors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Experience Section */}
      <View style={{ marginVertical: 10, flexDirection: "row", alignItems: "center" }}>
        <MaterialCommunityIcons name="briefcase" size={34} color={currentColors.textSecondary} />
        <View
          style={{
            maxHeight: 60,
            borderBottomWidth: 1,
            borderBottomColor: currentColors.textSecondary,
            marginBottom: 10,
            marginLeft: 10,
            flex: 1,
          }}
        >
          {/* Display added experience */}
          <Text style={{ color: currentColors.textSecondary }}>Experience</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {experience.map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', marginVertical: 5 }}>
                {renderSkillItem(item, index, currentColors, experience, setExperience, setStartSelectExperience, selectEdit, setSelectEdit, setOpenAnyModal)}
              </View>
            ))}
          </ScrollView>
        </View>
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

        <Skills visible={openSkills} onClose={closeSkills} skills={skills} setSkills={setSkills} currentColors={currentColors} startSelect={startSelect} setStartSelect={setStartSelect} setSelectEdit={setSelectEdit} selectEdit={selectEdit} setOpenAnyModal={setOpenAnyModal}/>
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
          setSelectEdit={setSelectEdit} selectEdit={selectEdit} setOpenAnyModal={setOpenAnyModal}
          projectForm={projectForm} setProjectForm={setProjectForm} toggleProjects={toggleProjects}
        />

        <Educations
          visible={openEducation} 
          onClose={closeEducation} 
          skills={skills} 
          setSkills={setSkills} 
          education={education} 
          setEducation={setEducation} 
          currentColors={currentColors}  
          startSelect={startSelectEducation} 
          setStartSelect={setStartSelectEducation} 
          setSelectEdit={setSelectEdit} selectEdit={selectEdit} setOpenAnyModal={setOpenAnyModal}
          educationForm={educationForm} setEducationForm={setEducationForm} toggleEducation={toggleEducation}
        />

        <Experiences
          visible={openExperience}
          onClose={closeExperience}
          skills={skills}
          setSkills={setSkills}
          experience={experience}
          setExperience={setExperience}
          currentColors={currentColors}
          startSelect={startSelect}
          setStartSelect={setStartSelectExperience}
          setSelectEdit={setSelectEdit}
          selectEdit={selectEdit}
          setOpenAnyModal={setOpenAnyModal}
          experienceForm={experienceForm}
          setExperienceForm={setExperienceForm}
          toggleExperience={setOpenExperience}
        />




    </View>
  );
};

export default JobInputs;
