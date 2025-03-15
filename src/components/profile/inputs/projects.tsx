import React, { useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ModalRightToLeft from '@/models/ModalRightToLeft';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProjectForm from './projectRenders';
import { Project, Skill } from '../../Messages/Chats/chatInterfaces';
import Skills from './skills';


export default function Projects({
  visible,
  onClose,
  skills,
  setSkills,
  projects,
  setProjects,
  currentColors,
  startSelect,
  setStartSelect,
  setSelectEdit,
  selectEdit,
  setOpenAnyModal, projectForm, setProjectForm, toggleProjects,
}: {
  visible: boolean;
  onClose: () => void;selectEdit: any[];
  skills: { name: string; percentage: string; skillType: string ; type: string}[];
  setSkills: (value: { name: string; percentage: string; type: string }[]) => void;
  projects: Project[];
  setProjects: (value: Project[]) => void;
  currentColors: any;
  startSelect: boolean;
  projectForm: Project; toggleProjects: (value: boolean) => void;
  setProjectForm: (form: any) => void;
  setStartSelect: (value: boolean) => void;setSelectEdit: (value: any[])=>void; setOpenAnyModal: (value: string) =>void;
}) {
  
  const [clearForm, setClearForm] = useState(false)
    useEffect(() => {
      setProjectForm((prevData: any) => {
        return { ...prevData, skills: skills };
      });
    }, [skills]);

    useEffect(()=>{
      if(visible){
        setClearForm(false)
      }
    }, [visible])
    
 
  const handleAddProject = () => {
    if (!projectForm.name || !projectForm.description) return;

    setProjects([...projects, projectForm]);
    resetForm();
  };

  const resetForm = () => {
    setProjectForm({
      id: 1, 
      name: '',
      description: '',
      skills: skills, // Reset skills to the passed skills
      selectedSkills: [],
      mediaType: 'file',
      media: '',
      isCurrent: false,
      endDate: '',
      selectedCompanies: [],
      selectedContributors: [],
      startDate: '',
      files: [],
      type: 'project',
    });
  };

  const handleRemoveProject = (index: number) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
  };

  const submit = () => {
    setClearForm(true);
    onClose();
  };
  

  return (
    <ModalRightToLeft
      visible={visible}
      onClose={onClose}
      name="Edit Projects"
      headerContent={
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: currentColors.textPrimary, fontWeight: 'bold' }} onPress={onClose}>
            Edit Projects
          </Text>
          <TouchableOpacity onPress={submit}>
            <Icon name="check" size={24} color={currentColors.primary} />
          </TouchableOpacity>
        </View>
      }
    >
      <View style={{ backgroundColor: currentColors.background, flex: 1, padding: 16 }}>
        {/* Horizontal Scroll for Added Projects */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
          {projects.map((project, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: currentColors.card,
                padding: 10,
                borderRadius: 10,
                marginRight: 10,
              }}
            >
              <Text style={{ color: currentColors.textPrimary, marginRight: 10 }}>{project.name}</Text>
              <TouchableOpacity onPress={() => handleRemoveProject(index)}>
                <Ionicons name="close-circle" size={20} color={currentColors.danger} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Project Form Component */}
        <ProjectForm
          projectForm={projectForm}
          setProjectForm={setProjectForm}
          currentColors={currentColors}
          handleAddProject={handleAddProject}
          startSelect={startSelect}
          setStartSelect={setStartSelect}
          setSkills={setSkills}
          projects={projects}
          setProjects={setProjects}
          setSelectEdit={setSelectEdit}
          selectEdit={selectEdit} setOpenAnyModal={setOpenAnyModal}
          clearForm={clearForm}
          setClearForm={setClearForm} toggleProjects={toggleProjects}
        />
      </View>
    </ModalRightToLeft>
  );
}
