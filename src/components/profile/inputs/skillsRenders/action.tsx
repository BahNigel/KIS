import { handleSkillPressProps } from "./interface";

const handleSkillPress = ({ 
  name, 
  selectedSkillsSet = new Set(), 
  selectedSkills = [], 
  setSelectedSkills = () => {} 
}: handleSkillPressProps) => {
  
  if (!name) return; // Prevent errors if name is undefined

  const updatedSkills = selectedSkillsSet.has(name)
    ? selectedSkills.filter((s) => s !== name)
    : [...selectedSkills, name];

  setSelectedSkills(updatedSkills);
};

export default handleSkillPress;
