import { Education } from "@/src/components/Messages/Chats/chatInterfaces";

export default interface handleFilePickerProps {
    selectedFiles: { uri: string; name: string; mimeType: string }[];
    educationForm: Education;
    setSelectedFiles: (value: { uri: string; name: string; mimeType: string }[]) => void;
    setEducationForm: (form: Education) => void;
}

export interface handleRemoveFileProps {
    uri: string;
    selectedFiles: { uri: string; name: string; mimeType: string }[];
    educationForm: Education;
    setSelectedFiles: (value: { uri: string; name: string; mimeType: string }[]) => void;
    setEducationForm: (form: Education) => void;
}

export interface handleMediaTypeChangeProps {
    type: 'link' | 'file';
    setMediaType: any;
    setEducationForm: (form: Education) => void;
    educationForm: Education;
    setMediaLink: any;
}

export interface getFileIconProps {
    mimeType: string;
    currentColors: any;
}
