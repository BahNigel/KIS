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
  type: string;
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
  name: string;
  description: string;
  skills: { name: string; percentage: string; type: string }[];
  mediaType: "link" | "file"; // 👈 Ensure this is restricted
  media: string;
  selectedSkills: string[];
  isCurrent: boolean;
  endDate: string;
  selectedCompanies: [];
  selectedContributors: [];
  startDate: string;
  files: File[];
}



export interface ProjectFormProps {
  projectForm: Project;
  setProjectForm: (form: Project) => void;
  currentColors: any;
  handleAddProject: () => void;
  startSelect: boolean;
  setStartSelect: (value: boolean) => void;
  setSkills: (value: { name: string; percentage: string; type: string }[]) => void;
  projects: Project[];
  setProjects: (projects: Project[]) => void;
}

