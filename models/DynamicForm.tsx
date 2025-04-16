import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Button,
  Platform,
  Modal,
  useColorScheme,
  ScrollView,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import DatePicker from 'react-native-date-picker';

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
  canSetaction?: boolean;
}

interface getFileIconProps{
    mimeType: string;
    currentColors: any;
}

interface DynamicFormProps {
  fields: DynamicFormField[];
  formData?: any;
  setFormData?: (records: any) => void;
  setAction: (action: boolean) => void;
}


// Custom Date Picker Component
const CustomDatePicker = ({ visible, onConfirm, onCancel, initialDate }: any) => {
    const [selectedDay, setSelectedDay] = useState(initialDate.getDate());
    const [selectedMonth, setSelectedMonth] = useState(initialDate.getMonth());
    const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear());
  
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  
    const handleConfirm = () => {
      const selectedDate = new Date(selectedYear, selectedMonth, selectedDay);
      onConfirm(selectedDate);
    };
  
    return (
      <Modal visible={visible} transparent={true} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 16, marginBottom: 10 }}>Select Date</Text>
  
            {/* Day Picker */}
            <Picker
              selectedValue={selectedDay}
              onValueChange={(value) => setSelectedDay(value)}
              style={{ marginBottom: 10 }}
            >
              {[...Array(daysInMonth)].map((_, index) => (
                <Picker.Item key={index} label={`${index}`} value={index + 1} />
              ))}
            </Picker>
  
            {/* Month Picker */}
            <Picker
              selectedValue={selectedMonth}
              onValueChange={(value) => setSelectedMonth(value)}
              style={{ marginBottom: 10 }}
            >
              {[
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
              ].map((month, index) => (
                <Picker.Item key={index} label={month} value={index} />
              ))}
            </Picker>
  
            {/* Year Picker */}
            <Picker
              selectedValue={selectedYear}
              onValueChange={(value) => setSelectedYear(value)}
              style={{ marginBottom: 10 }}
            >
              {Array.from({ length: 100 }, (_, index) => {
                const year = new Date().getFullYear() - 50 + index;
                return <Picker.Item key={year} label={`${year}`} value={year} />;
              })}
            </Picker>
  
            {/* Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={onCancel}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirm}>
                <Text>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

const DynamicForm: React.FC<DynamicFormProps> = ({ fields, formData, setFormData, setAction }) => {
//   const [formData, setFormData] = useState<Record<string, any>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDateField, setCurrentDateField] = useState<string | null>(null);
  const [filteredOptions, setFilteredOptions] = useState<Record<string, any[]>>({});

  // Detect current theme (light or dark mode)
  const scheme = useColorScheme();
  const colors = Colors[scheme || 'light']; // Default to light mode if undefined

  const handleChange = (name: string, value: any) => {
    setFormData?.((prev: Record<string, any>) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = async (name: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: true,
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const existingFiles: { name: string; mimeType: string }[] = formData[name] || [];
        const newFiles = [...existingFiles, ...result.assets];
        handleChange(name, newFiles);
        console.log('Selected files:', newFiles);
      }
    } catch (e) {
      console.warn('File pick failed', e);
    }
  };
  
  const handleFileRemove = (name: string, index: number) => {
    const existingFiles = formData[name] || [];
    const updatedFiles = existingFiles.filter((_: { name: string; mimeType: string }, i: number) => i !== index);
    handleChange(name, updatedFiles);
  };

    const getFileIcon = ({mimeType, currentColors}: getFileIconProps) => {
      if (mimeType.includes('image')) {
        return <Ionicons name="image" size={30} color={currentColors.textPrimary} />;
      } else if (mimeType.includes('pdf')) {
        return <Ionicons name="document-text" size={30} color="red" />;
      } else if (mimeType.includes('msword') || mimeType.includes('wordprocessingml')) {
        return <Ionicons name="document" size={30} color="blue" />;
      }
      return <Ionicons name="document" size={30} color={currentColors.textPrimary} />;
    };
  

 
  
  // Add these just before renderInput

const renderTextField = (field: DynamicFormField) => (
    <TextInput
      placeholder={field.placeholder || field.name}
      secureTextEntry={field.secureTextEntry}
      keyboardType={field.keyboardType === 'decimal' ? 'numeric' : field.keyboardType || 'default'}
      value={formData?.[field.name] !== undefined ? formData?.[field.name] : (field.defaultValue || '')}
      onChangeText={(text) => handleChange(field.name, text)}
      style={{
        padding: 10,
        borderRadius: 5,
        marginVertical: 6,
        backgroundColor: colors.inputBackground,
        color: colors.inputText,
      }}
      placeholderTextColor={colors.textSecondary}
      editable={field.editable}
      maxLength={field.maxLength}
    />
  );
  
  const renderNumberField = (field: DynamicFormField) => (
    <TextInput
      placeholder={field.placeholder || field.name}
      keyboardType="numeric"
      value={formData?.[field.name]?.toString() || field.defaultValue?.toString() || ''}
      onChangeText={(text) => {
        let value = Number(text);
        if (field.min !== undefined && value < field.min) value = field.min;
        if (field.max !== undefined && value > field.max) value = field.max;
        handleChange(field.name, value);
      }}
      style={{
        padding: 10,
        borderRadius: 5,
        marginVertical: 6,
        backgroundColor: colors.inputBackground,
        color: colors.inputText,
      }}
      placeholderTextColor={colors.textSecondary}
    />
  );
  
  const renderTextareaField = (field: DynamicFormField) => (
    <TextInput
      placeholder={field.placeholder || field.name}
      multiline
      numberOfLines={field.numberOfLines || 4}
      value={formData?.[field.name] !== undefined ? formData?.[field.name] : (field.defaultValue || '')}
      onChangeText={(text) => handleChange(field.name, text)}
      style={{
        padding: 10,
        borderRadius: 5,
        marginVertical: 6,
        minHeight: 100,
        textAlignVertical: 'top',
        backgroundColor: colors.inputBackground,
        color: colors.inputText,
      }}
      placeholderTextColor={colors.textSecondary}
      editable={field.editable}
    />
  );
  
  const renderCheckboxField = (field: DynamicFormField) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 6 }}>
      <Switch
        value={formData?.[field.name] !== undefined ? Boolean(formData?.[field.name]) : Boolean(field.defaultValue)}

        onValueChange={(value) => {
            handleChange(field.name, value);
            if(field.canSetaction){
                setAction(value);
            }
        }}
      />
      <Text style={{ marginLeft: 10, color: colors.textPrimary }}>{field.label || field.name}</Text>
    </View>
  );
  
  const renderRadioField = (field: DynamicFormField) => (
    <View style={{ marginVertical: 6 }}>
      {field.options?.map((opt) => (
        <TouchableOpacity
          key={opt}
          onPress={() => handleChange(field.name, opt)}
          style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}
        >
          <View style={{ height: 18, width: 18, borderRadius: 9, borderWidth: 1, borderColor: colors.textPrimary, alignItems: 'center', justifyContent: 'center' }}>
            {formData?.[field.name] === opt && (
              <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: colors.primary }} />
            )}
          </View>
          <Text style={{ marginLeft: 10, color: colors.textPrimary }}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const handleLectureSearch = (field: DynamicFormField, text: string, name: string) => {
    if (field.name === name) {
      handleChange(field.name, text);
      const filtered = text
        ? (field.options ?? []).filter((item: string) =>
            item.toLowerCase().includes(text.toLowerCase())
          )
        : [];
      setFilteredOptions(prev => ({ ...prev, [field.name]: filtered }));
    }
  };
  

  const renderTypeSelector = (field: DynamicFormField) => {
    const options = filteredOptions[field.name] || [];
  
    return (
      <View style={{ marginVertical: 6 }}>
        <TextInput
          placeholder={field.placeholder || field.name}
          value={formData?.[field.name] !== undefined ? formData?.[field.name] : (field.defaultValue || '')}
          onChangeText={(text) => handleLectureSearch(field, text, field.name)}
          style={{
            padding: 10,
            borderRadius: 5,
            marginVertical: 6,
            backgroundColor: colors.inputBackground,
            color: colors.inputText,
          }}
          placeholderTextColor={colors.textSecondary}
        />
  
        {options.length > 0 && (
          <ScrollView style={{ maxHeight: 150, marginBottom: 10 }}>
            {options.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  handleChange(field.name, item);
                  setFilteredOptions(prev => ({ ...prev, [field.name]: [] }));
                }}
                style={{
                  padding: 8,
                  marginVertical: 2,
                  borderRadius: 5,
                  backgroundColor: colors.buttonBackground,
                }}
              >
                <Text style={{ color: colors.text }}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    );
  };
  
  
  const renderSelectField = (field: DynamicFormField) => (
    <View style={{ marginVertical: 6 , borderRadius: 5}}>
      <Picker
        selectedValue={formData?.[field.name] || field.defaultValue}
        onValueChange={(value) => handleChange(field.name, value)}
        style={{ backgroundColor: colors.inputBackground, color: colors.inputText , borderRadius: 5}}
      >
        <Picker.Item label="Select..." value="" />
        {field.options?.map((option) => (
          <Picker.Item key={option} label={option} value={option} />
        ))}
      </Picker>
    </View>
  );
  
  const renderTabChoiceField = (field: DynamicFormField) => (
    <View style={{ marginVertical: 6 }}>
      <ScrollView horizontal>
        <View style={{ flexDirection: 'row' }}>
          {field.options?.map((option) => (
            <TouchableOpacity
              key={option.name}
              onPress={() => handleChange(field.name, option.name)}
              style={{
                padding: 10,
                borderRadius: 5,
                backgroundColor:
                formData?.[field.name] === option.name
                    ? colors.primary
                    : colors.inputBackground,

                marginRight: 10,
              }}
            >
              <Text style={{ color: formData?.[field.name] === option.name ? 'white' : colors.textPrimary }}>
                {option.label || option.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {formData?.[field.name] &&
        field.options?.map((option) => {
            if (option.name === formData?.[field.name]) {
            return (
                <View key={option.name} style={{ marginTop: 10 }}>
                <View>
                    {option.label && (
                    <Text style={{ color: colors.textPrimary, marginBottom: 4 }}>
                        {option.label}
                    </Text>
                    )}
                    {renderInput(option)}
                </View>
                </View>
            );
            }
            return null; // always return something in map
        })}

    </View>
  );
  
  const renderFileField = (field: DynamicFormField) => (
    <>
    <TouchableOpacity
      onPress={() => handleFileSelect(field.name)}
      style={{
        padding: 10,
        borderRadius: 5,
        backgroundColor: colors.primary,
        marginVertical: 6,
      }}
    >
      <Text style={{ color: 'white', textAlign: 'center' }}>
        {formData?.[field.name]?.name ?? 'Select File'}
      </Text>

    </TouchableOpacity>

    <View style={{ padding: 10, borderRadius: 5 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {formData?.[field.name]?.map((file: any, index:any) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
            {getFileIcon({mimeType:file.mimeType, currentColors: colors})}
            <Text style={{ color: colors.textPrimary, marginLeft: 5, maxWidth: 100 }} numberOfLines={1}>
                {file.name}
            </Text>
            <TouchableOpacity onPress={() => handleFileRemove(field.name, index)} style={{ marginLeft: 10 }}>
                <Ionicons name="close-circle" size={25} color={colors.danger} />
            </TouchableOpacity>
            </View>
        ))}
        </ScrollView>
    </View>

    </>
  );
  

  
  const renderColorField = (field: DynamicFormField) => (
    <TextInput
      placeholder={field.placeholder || '#000000'}
      value={formData?.[field.name] !== undefined ? formData?.[field.name] : (field.defaultValue || '')}
      onChangeText={(color) => handleChange(field.name, color)}
      style={{
        padding: 10,
        borderRadius: 5,
        marginVertical: 6,
        backgroundColor: colors.inputBackground,
        color: colors.inputText,
      }}
      placeholderTextColor={colors.textSecondary}
    />
  );
  
  const renderRangeField = (field: DynamicFormField) => (
    <TextInput
      placeholder={field.placeholder || '0 - 100'}
      keyboardType="numeric"
      value={formData?.[field.name]?.toString() || field.defaultValue?.toString() || ''}
      onChangeText={(value) => handleChange(field.name, Number(value))}
      style={{
        padding: 10,
        borderRadius: 5,
        marginVertical: 6,
        backgroundColor: colors.inputBackground,
        color: colors.inputText,
      }}
      placeholderTextColor={colors.textSecondary}
    />
  );

  const showDatePickerForField = (fieldName: string) => {
    setCurrentDateField(fieldName);
    setShowDatePicker(true);
  };

  const hideDatePicker = () => {
    setShowDatePicker(false);
    setCurrentDateField(null);
  };

  const handleDatePickerConfirm = (selectedDate: Date) => {
    if (currentDateField) {
      if (setFormData) {
        setFormData((prevData: any) => ({
          ...prevData,
          [currentDateField]: selectedDate.toISOString().split('T')[0],
        }));
      }
    }
    hideDatePicker();
  };

  const renderDateField = (field: any) => (
    <View style={{ marginVertical: 6 }}>
      <TouchableOpacity
        onPress={() => showDatePickerForField(field.name)}
        style={{
          padding: 10,
          borderRadius: 5,
          backgroundColor: colors.inputBackground,
          marginTop: 6,
        }}
      >
        <Text style={{ color: colors.textPrimary }}>
          {formData?.[field.name]
            ? new Date(formData?.[field.name]).toLocaleDateString()
            : 'Pick a date'}
        </Text>
      </TouchableOpacity>

      {/* Custom Date Picker Modal */}
      <CustomDatePicker
        visible={showDatePicker && currentDateField === field.name}
        initialDate={formData?.[field.name] ? new Date(formData?.[field.name]) : new Date()}
        onConfirm={handleDatePickerConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );

  

  const renderInput = (field: DynamicFormField) => {
    if (field.hidden) return null;
  
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'phone':
      case 'url':
      case 'search':
        return renderTextField(field);
      case 'number':
        return renderNumberField(field);
      case 'textarea':
        return renderTextareaField(field);
      case 'checkbox':
        return renderCheckboxField(field);
      case 'radio':
        return renderRadioField(field);
      case 'select':
        return renderSelectField(field);
      case 'tabchoice':
        return renderTabChoiceField(field);
      case 'file':
        return renderFileField(field);
      case 'date':
      case 'datetime':
      case 'time':
      case 'month':
      case 'week':
        return renderDateField(field);
      case 'color':
        return renderColorField(field);
      case 'range':
        return renderRangeField(field);
      case 'typeSelector':
        return renderTypeSelector(field);
      case 'hidden':
        return null;
      default:
        return null;
    }
  };
  
  return (
    <ScrollView >
      {fields.map((field) => (
        <View key={field.name}>
          {field.label && <Text style={{ color: colors.textPrimary, marginBottom: 4 }}>{field.label}</Text>}
          {renderInput(field)}
        </View>
      ))}
    </ScrollView>
  );
}  

export default DynamicForm;
