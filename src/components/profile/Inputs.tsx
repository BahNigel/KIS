import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, Button, ScrollView } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Skills from "./inputs/skills"; // Assuming this is a component for skills form/modal
import { handleRemoveEntry, renderSkillItem } from "./profileActions";
import Projects from "./inputs/projects";
import { Certificate, Education, Experience, Project, Service } from "../Messages/Chats/chatInterfaces";
import Ionicons from "react-native-vector-icons/Ionicons";
import Educations from "./inputs/Education";
import Experiences from "./inputs/experience";
import Services from "./inputs/services";
import Certificates from "./inputs/certificates";

const JobInputs = ({ 
  currentColors,
  skills,
  setSkills,
  projects,
  setProjects,
  education,
  setEducation,
  experience,
  setExperience,
  services,
  setServices,
  certificates, 
  setCertificates,
 }:{
  currentColors: any,
  skills: any[];
  setSkills: (value: any[]) => void;
  projects: Project[];
  setProjects: (value: Project[]) => void;
  education: Education[];
  setEducation: (value: Education[]) => void;
  experience: Experience[];
  setExperience: (value: Experience[]) => void;
  services: Service[];
  setServices: (value: Service[]) => void;
  certificates: Certificate[];
  setCertificates: (value: Certificate[]) => void;
}) => {
  const [startSelect, setStartSelect] = useState(false);
  const [startSelectProject, setStartSelectProject] = useState(false);
  const [startSelectEducation, setStartSelectEducation] = useState(false);
  const [startSelectExperience, setStartSelectExperience] = useState(false);
  const [startSelectService, setStartSelectService] = useState(false);
  const [startSelectcertificate, setStartSelectCertificate] = useState(false);
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

  const [servicesForm, setServicesForm] = useState<Service>({
    id: 1,
    name: '',
    location: '',
    whereFound: '',
    description: '',
    startDate: '',
    endDate: '',
    price: '',
    type: 'service',
    files: [],
    skills: [],
    selectedSkills: [],
    media: '',
    mediaType: 'file',
  });

const [certificateForm, setCertificateForm] = useState<Certificate>({
  id: 1,
  name: '',
  issuedBy: '',
  reference: '',
  description: '',
  startDate: '',
  endDate: '',
  type: 'certificate',
  files: [],
  skills: [],
  selectedSkills: [],
  media: '',
  mediaType: 'file',
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
      const experienceToEdit = selectEdit.find(item => item.name && item.type=='experience');
      const serviceToEdite = selectEdit.find(item => item.name && item.type=='service');
      setProjectForm(projectToEdit);
      setEducationForm(educationToEdite);
      setExperienceForm(experienceToEdit);
      setServicesForm(serviceToEdite);
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
      case 'service':
        if (!openExperience && selectEdit.some(item => item.type === "service")) {
          console.log('Service Modal Opened');
          setOpenServices(true);
        } 
        break;
      case 'certificate':
        if (!openExperience && selectEdit.some(item => item.type === "certificate")) {
          console.log('Certificate Modal Opened');
          setOpenCertificates(true);
        } 
        break;
      default:
        break;
    }    
  }, [selectEdit])

  const sections: {
    key: string;
    title: string;
    icon: "account-wrench" | "school" | "briefcase" | "handshake" | "certificate" | "tools";
    data: any[];
    setData: React.Dispatch<React.SetStateAction<any[]>>;
    setStartSelect: React.Dispatch<React.SetStateAction<boolean>>;
    openModal: () => void;
  }[] = [
    { key: 'skills', title: 'Skills', icon: 'tools', data: skills, setData: (value) => setSkills(typeof value === 'function' ? value(skills) : value), setStartSelect: setStartSelect, openModal: () => setOpenSkills(true) },
    { key: 'projects', title: 'Projects', icon: 'account-wrench', data: projects, setData: (value) => setProjects(typeof value === 'function' ? value(projects) : value), setStartSelect: setStartSelectProject, openModal: () => setOpenProjects(true) },
    { key: 'education', title: 'Education', icon: 'school', data: education, setData: (value) => setEducation(typeof value === 'function' ? value(education) : value), setStartSelect: setStartSelectEducation, openModal: () => setOpenEducation(true) },
    { key: 'experience', title: 'Experience', icon: 'briefcase', data: experience, setData: (value) => setExperience(typeof value === 'function' ? value(experience) : value), setStartSelect: setStartSelectExperience, openModal: () => setOpenExperience(true) },
    { key: 'services', title: 'Services', icon: 'handshake', data: services, setData: (value) => setServices(typeof value === 'function' ? value(services) : value), setStartSelect: setStartSelectService, openModal: () => setOpenServices(true) },
    { key: 'certificates', title: 'Certificates', icon: 'certificate', data: certificates, setData: (value) => setCertificates, setStartSelect: setStartSelectService, openModal: () => setOpenCertificates(true) },
  ];
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
      {sections.map(({ key, title, icon, data, setData, setStartSelect, openModal }) => (
        <View key={key} style={{ marginVertical: 10, flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons name={icon} size={34} color={currentColors.textSecondary} />
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
            <Text style={{ color: currentColors.textSecondary }}>{title}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {data.map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', marginVertical: 5 }}>
                  {renderSkillItem(item, index, currentColors, data, setData, setStartSelect, selectEdit, setSelectEdit, setOpenAnyModal)}
                </View>
              ))}
            </ScrollView>
          </View>
          <TouchableOpacity onPress={openModal}>
            <MaterialCommunityIcons name="plus" size={34} color={currentColors.textSecondary} />
          </TouchableOpacity>
        </View>
      ))}

        <Skills visible={openSkills} onClose={closeSkills} skills={skills} setSkills={setSkills} currentColors={currentColors} startSelect={startSelect} setStartSelect={setStartSelect} setSelectEdit={setSelectEdit} selectEdit={selectEdit} setOpenAnyModal={setOpenAnyModal}/>
        <Projects visible={openProjects} onClose={closeProjects} skills={skills} setSkills={setSkills} projects={projects} setProjects={setProjects} currentColors={currentColors} startSelect={startSelectProject} setStartSelect={setStartSelectProject} setSelectEdit={setSelectEdit} selectEdit={selectEdit} setOpenAnyModal={setOpenAnyModal} projectForm={projectForm} setProjectForm={setProjectForm} toggleProjects={toggleProjects} />
        <Educations visible={openEducation} onClose={closeEducation} skills={skills} setSkills={setSkills} education={education} setEducation={setEducation} currentColors={currentColors} startSelect={startSelectEducation} setStartSelect={setStartSelectEducation} setSelectEdit={setSelectEdit} selectEdit={selectEdit} setOpenAnyModal={setOpenAnyModal} educationForm={educationForm} setEducationForm={setEducationForm} toggleEducation={toggleEducation} />
        <Experiences visible={openExperience} onClose={closeExperience} skills={skills} setSkills={setSkills} experience={experience} setExperience={setExperience} currentColors={currentColors} startSelect={startSelect} setStartSelect={setStartSelectExperience} setSelectEdit={setSelectEdit} selectEdit={selectEdit} setOpenAnyModal={setOpenAnyModal} experienceForm={experienceForm} setExperienceForm={setExperienceForm} toggleExperience={setOpenExperience} />
        <Services visible={openServices} onClose={closeServices} skills={skills} setSkills={setSkills} services={services} setServices={setServices} servicesForm={servicesForm} setServicesForm={setServicesForm} currentColors={currentColors} startSelect={startSelect} setStartSelect={setStartSelectService} setSelectEdit={setSelectEdit} selectEdit={selectEdit} setOpenAnyModal={setOpenAnyModal} toggleService={setOpenServices} />
        <Certificates visible={openCertificates} onClose={closeCertificates} skills={skills} setSkills={setSkills} certificates={certificates} setCertificates={setCertificates} certificateForm={certificateForm} setCertificateForm={setCertificateForm} currentColors={currentColors} startSelect={startSelect} setStartSelect={setStartSelectCertificate} setSelectEdit={setSelectEdit} selectEdit={selectEdit} setOpenAnyModal={setOpenAnyModal} toggleCertificate={setOpenCertificates} />
    </View>
  );
};

export default JobInputs;
