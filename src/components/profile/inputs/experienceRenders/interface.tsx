import { Experience } from "@/src/components/Messages/Chats/chatInterfaces";

export default interface handleFilePickerProps {
  selectedFiles: { uri: string; name: string; mimeType: string }[];
  experienceForm: Experience;
  setSelectedFiles: (value: { uri: string; name: string; mimeType: string }[]) => void;
  setExperienceForm: (form: Experience) => void;
}

export interface handleRemoveFileProps {
  uri: string;
  selectedFiles: { uri: string; name: string; mimeType: string }[];
  experienceForm: Experience;
  setSelectedFiles: (value: { uri: string; name: string; mimeType: string }[]) => void;
  setExperienceForm: (form: Experience) => void;
}

export interface handleMediaTypeChangeProps {
  type: 'link' | 'file';
  setMediaType: any;
  setExperienceForm: (form: Experience) => void;
  experienceForm: Experience;
  setMediaLink: any;
}

export interface getFileIconProps {
  mimeType: string;
  currentColors: any;
}

type FieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'email'
  | 'phone'
  | 'password'
  | 'url'
  | 'textarea'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'color'
  | 'range'
  | 'datetime'
  | 'time'
  | 'month'
  | 'week'
  | 'search'
  | 'hidden'
  | 'tabchoice'
  | 'typeSelector'
  | 'select';

export interface DynamicFormField {
  name: string;
  type: FieldType;
  options?: any[]; // for select, radio, tabchoice
  label?: string;
  placeholder?: string;
  hidden?: boolean;
  required?: boolean;
  defaultValue?: string | number | boolean;
  min?: number;
  max?: number;
  step?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url' | 'decimal' | 'number-pad';
  secureTextEntry?: boolean;
  editable?: boolean;
  maxLength?: number;
  numberOfLines?: number;
  value?: (value: any) => void;
  isVisible?: boolean;
  canSetaction?: boolean;
}
