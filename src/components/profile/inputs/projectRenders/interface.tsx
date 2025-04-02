import { Project } from "@/src/components/Messages/Chats/chatInterfaces";

export default interface handleFilePickerProps{
    selectedFiles: { uri: string; name: string; mimeType: string }[];
    projectForm: Project;
    setSelectedFiles: (value :{ uri: string; name: string; mimeType: string }[]) => void;
    setProjectForm: (form: Project) => void;
}

export interface handleRemoveFileProps{
    uri: string;
    selectedFiles: { uri: string; name: string; mimeType: string }[];
    projectForm: Project;
    setSelectedFiles: (value :{ uri: string; name: string; mimeType: string }[]) => void;
    setProjectForm: (form: Project) => void;
}

export interface handleMediaTypeChangeProps{
    type: 'link' | 'file';
    setMediaType: any;
    setProjectForm: (form: Project) => void;
    projectForm: Project;
    setMediaLink: any;
}

export interface getFileIconProps{
    mimeType: string;
    currentColors: any;
}