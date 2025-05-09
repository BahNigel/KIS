import React from "react";
import { Animated, NativeScrollEvent, NativeSyntheticEvent } from "react-native";

export interface UserData {
  id: string;
  name: string;
  contacts: string;
  lastMessage: string;
  image: string | null;
  lastMessageTime: string;
  unreadCount: number;
  type: any;
  favorite: boolean;
  archived?: boolean;
}

export interface logedInUserData {
  id: string;
  name: string;
  contacts: string;
  lastMessage: string;
  image: string | null;
  lastMessageTime: string;
  unreadCount: number;
  type: any;
  favorite: boolean;
  archived?: boolean;
  status: string;
  points: Number;
  space: Number;
  files: Number;
}

export const defaultUserData = {
  id: '',
  name: 'Unknown User',
  contacts: '',
  lastMessage: 'No messages yet.',
  image: null,
  lastMessageTime: '',
  unreadCount: 0,
  type: '', // Set to an empty string, but adjust as necessary
  favorite: false,
  archived: false,
  status: 'No status available',
  points: 0,
  space: 0,
  files: 0,
};


export interface ChatsProps {
  select: boolean; // Added 'select' with boolean type
  setSelectedValue: React.Dispatch<React.SetStateAction<number>>; // Correctly typing setSelectedValue
  setSelect: React.Dispatch<React.SetStateAction<boolean>>; // Correctly typing setSelect
}




export interface ChatRoomProps {
  visible: boolean;
  onClose: () => void;
  userData: {
    id: string;
    name: string;
    contacts: string;
    lastMessage: string;
    image: string | null;
    lastMessageTime: string;
    unreadCount: number;
    type: string;
    favorite: boolean;
  };
}


export interface ChatRoom2Props {
  userData: {
    id: string;
    name: string;
    contacts: string;
    lastMessage: string;
    image: string | null;
    lastMessageTime: string;
    unreadCount: number;
    type: string;
    favorite: boolean;
  };
}


export interface ChatRoomModalProps {
  userData: {
    id: string;
    name: string;
    contacts: string;
    lastMessage: string;
    image: string | null;
    unreadCount: number;
    type: string;
    favorite: boolean;
  };
}

export const userDataInit = {
    id: '',
    name: '',
    lastMessage: '',
    contacts: '',
    image: null,
    lastMessageTime: '',
    unreadCount: 0,
    type: 'single',
    favorite: false,
}

// Define the interface for the parameters
export interface HandleScrollParams {
  event: any; // Adjust type based on the event type (e.g., GestureResponderEvent)
  lastOffset: number;
  showFilter: boolean;
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  scrollAnim: Animated.Value;
  setLastOffset: React.Dispatch<React.SetStateAction<number>>;
}


export interface FilterSectionProps {
  isTablet: boolean;
  setIsArchived: React.Dispatch<React.SetStateAction<boolean>>;
  isArchived: boolean;
  currentColors: {
    textPrimary: string;
    coloredText: string;
    backgroundSecondary: string;
    framButtonText: string;
    tint: string;
  };
  unreadArchived: number;
  filters: { name: string; icon_name: string }[];
  activeFilter: string;
  setActiveFilter: React.Dispatch<React.SetStateAction<string>>;
  setModalAddFilterVisible: React.Dispatch<React.SetStateAction<boolean>>;
  route: { name: string };
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onFilterUpdate: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}


export interface ChatsSectionProps {
  isTablet: boolean;
  currentColors: {
    textPrimary: string;
    framButtonText: string;
    background: string;
    backgroundSecondary: string;
  };
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredChats: any[]; // Type it further depending on the data structure
  select: boolean;
  setSelectedValue: (value: any) => void;
  setSelect: (select: boolean) => void;
  setAddContacts: (value: boolean) => void;
  setSingleUserData: (data: any) => void; // Type this more specifically based on your data structure
  viewChart: number | null;
  setViewChart: (value: number | null) => void;
  setChatRoomModalVisible: (value: boolean) => void;
  setChatRoomVisible: (value: boolean) => void;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export interface Skill {
  name: string;
  percentage: string;
  skillType: string;
  type:string,
}

export interface ProjectsProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  visible: boolean;
  onClose: () => void;
  skills: { name: string; percentage: string; type: string }[];
  setSkills: (skills: { name: string; percentage: string; type: string }[]) => void;
  currentColors: any;
  startSelect: boolean;
  setStartSelect: (value: boolean) => void;
}


export interface Project {
  id: number,
  name: string;
  description: string;
  skills: { name: string; percentage: string; skillType: string; type: string }[];
  mediaType: "link" | "file"; // 👈 Ensure this is restricted
  media: {uri: string, name: string, mimeType: string}[]| string;
  selectedSkills: string[];
  isCurrent: boolean;
  endDate: string;
  selectedCompanies: [];
  selectedContributors: [];
  startDate: string;
  files: { uri: string; name: string; mimeType: string }[];
  type: string;
}

export interface Education {
  id: number,
  name: string;
  degree: string;
  description: string;
  field: string
  skills: { name: string; percentage: string; skillType: string; type: string }[];
  mediaType: "link" | "file"; // 👈 Ensure this is restricted
  media: {uri: string, name: string, mimeType: string}[]| string;
  selectedSkills: string[];
  isCurrent: boolean;
  endDate: string;
  grades: string;
  activites: string;
  startDate: string;
  files: { uri: string; name: string; mimeType: string }[];
  type: string;
  lectures: string;
  mentors: string;
}

export interface Experience {
  id: number;
  name: string;
  employmentType: string;
  location: string;
  whereFound: string;
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  type: 'experience';
  files: { uri: string; name: string; mimeType: string }[];
  skills?: any[];
  selectedSkills: string[];
  media?: { uri: string; name: string; mimeType: string }[] | string; // for file or link
  mediaType?: 'file' | 'link'; // to differentiate between file and link uploads
}



export interface ProjectFormProps {
  skills:any[];
  projectForm: Project;
  setProjectForm: (form: Project) => void;
  currentColors: any;
  handleAddEntry: () => void;
  startSelect: boolean;
  setStartSelect: (value: boolean) => void;
  setSkills: (value: { name: string; percentage: string; type: string }[]) => void;
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  setSelectEdit: (value: any[])=>void;
  toggleProjects:(value: boolean)=>void;
  selectEdit: any[]; 
  setOpenAnyModal: (value: string) => void; 
  clearForm: boolean;
  setClearForm:(value: boolean)=>void;
}

export interface EducationFormProps {
  visible: boolean;
  skills: any[];
  educationForm: any;
  setEducationForm: (form: any) => void;
  currentColors: any;
  handleAddEducation: () => void;
  startSelect: boolean;
  setStartSelect: (value: boolean) => void;
  setSkills: (value: { name: string; percentage: string; type: string }[]) => void;
  education: Education[];
  setEducation: (education: Education[]) => void;
  setSelectEdit: (value: any[]) => void;
  toggleEducation: (value: boolean) => void;
  selectEdit: any[];
  setOpenAnyModal: (value: string) => void;
  clearForm: boolean;
  setClearForm: (value: boolean) => void;
}

export interface ExperienceFormProps {
  visible: boolean; 
  skills: any[];
  experienceForm: Experience;
  setExperienceForm: (form: Experience) => void;
  currentColors: any;
  handleAddExperience: () => void;
  startSelect: boolean;
  setStartSelect: (value: boolean) => void;
  setSkills: (value: { name: string; percentage: string; type: string }[]) => void;
  experience: Experience[];
  setExperience: (experience: Experience[]) => void;
  setSelectEdit: (value: any[]) => void;
  toggleExperience:(value: boolean)=>void;
  selectEdit:any[];
  setOpenAnyModal:(value:string)=>void;
  clearForm: boolean;
  setClearForm: (value: boolean) => void;
  type: string;
}

export interface Service{
  id: number;
  name: string;
  location: string;
  whereFound: string;
  description?: string;
  startDate: string;
  endDate: string;
  price: string;
  type: 'service';
  files: { uri: string; name: string; mimeType: string }[];
  skills?: any[];
  selectedSkills: string[];
  media?: { uri: string; name: string; mimeType: string }[] | string; // for file or link
  mediaType?: 'file' | 'link'; // to differentiate between file and link uploads
}

export interface ServicesFormProps {
  visible: boolean;
  skills: any[];
  servicesForm: Service;
  setServicesForm: (form: Service) => void;
  currentColors: any;
  handleAddService: () => void;
  startSelect: boolean;
  setStartSelect: (value: boolean) => void;
  setSkills: (value: { name: string; percentage: string; type: string }[]) => void;
  services: Service[];
  setServices: (services: Service[]) => void;
  setSelectEdit: (value: any[]) => void;
  toggleService: (value: boolean) => void;
  selectEdit: any[];
  setOpenAnyModal: (value: string) => void;
  clearForm: boolean;
  setClearForm: (value: boolean) => void;
  type: string;
}


export interface Certificate {
  id: number;
  name: string;
  issuedBy: string;
  reference: string;
  description?: string;
  startDate: string;
  endDate: string;
  type: 'certificate';
  files: { uri: string; name: string; mimeType: string }[];
  skills?: any[];
  selectedSkills: string[];
  media?: { uri: string; name: string; mimeType: string }[] | string; // for file or link
  mediaType?: 'file' | 'link'; // to differentiate between file and link uploads
}

export interface CertificatesFormProps {
  visible: boolean;
  skills: any[];
  certificatesForm: Certificate;
  setCertificatesForm: (form: Certificate) => void;
  currentColors: any;
  handleAddCertificate: () => void;
  startSelect: boolean;
  setStartSelect: (value: boolean) => void;
  setSkills: (value: { name: string; percentage: string; type: string }[]) => void;
  certificates: Certificate[];
  setCertificates: (certificates: Certificate[]) => void;
  setSelectEdit: (value: any[]) => void;
  toggleCertificate: (value: boolean) => void;
  selectEdit: any[];
  setOpenAnyModal: (value: string) => void;
  clearForm: boolean;
  setClearForm: (value: boolean) => void;
  type: string;
}
