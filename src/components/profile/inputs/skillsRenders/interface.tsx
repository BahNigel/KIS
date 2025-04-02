import { Skill } from "@/src/components/Messages/Chats/chatInterfaces";

export interface handleSkillPressProps {
    name: string;
    selectedSkillsSet: Set<any>; 
    selectedSkills: string[];
    setSelectedSkills: (skills: string[]) => void;
}

export interface SkillsSelectionProps {
    skills: Skill[];
    selectedSkills: string[];
    setSelectedSkills: (skills: string[]) => void;
    currentColors: any;
    startSelect: boolean;
    setStartSelect: (value: boolean)=>void;
    setSkills: (value: { name: string; percentage: string; type: string }[]) => void;
    setSelectEdit: (value: any[])=>void;
    selectEdit: any[]; setOpenAnyModal: (value: string) => void;
  }