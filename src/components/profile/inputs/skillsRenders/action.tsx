import { handleSkillPressProps } from "./interface";

const handleSkillPress = ({name, selectedSkillsSet, selectedSkills, setSelectedSkills}:handleSkillPressProps) => {
    const updatedSkills = selectedSkillsSet.has(name)
      ? selectedSkills.filter((s) => s !== name)
      : [...selectedSkills, name];

    setSelectedSkills(updatedSkills);
  };

export default handleSkillPress