import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type FieldType = 'text' | 'number' | 'date' | 'select';

interface FormField {
  name: string;
  type: FieldType;
  options?: string[]; // for select fields
  label?: string;
  placeholder?: string;
}

interface DynamicFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ fields, onSubmit }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderInput = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'number':
      case 'date':
        return (
          <TextInput
            key={field.name}
            placeholder={field.placeholder || field.name}
            keyboardType={field.type === 'number' ? 'numeric' : 'default'}
            onChangeText={text => handleChange(field.name, text)}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 8,
              marginVertical: 6,
              borderRadius: 6
            }}
          />
        );
      case 'select':
        return (
          <View key={field.name} style={{ marginVertical: 6 }}>
            <Text>{field.label || field.name}</Text>
            <Picker
              selectedValue={formData[field.name]}
              onValueChange={value => handleChange(field.name, value)}
            >
              <Picker.Item label="Select..." value="" />
              {field.options?.map(option => (
                <Picker.Item label={option} value={option} key={option} />
              ))}
            </Picker>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View>
      {fields.map(field => (
        <View key={field.name}>
          <Text style={{ marginTop: 10 }}>{field.label || field.name}</Text>
          {renderInput(field)}
        </View>
      ))}
      <TouchableOpacity
        onPress={() => onSubmit(formData)}
        style={{
          marginTop: 20,
          backgroundColor: '#2196F3',
          padding: 10,
          borderRadius: 5
        }}
      >
        <Text style={{ textAlign: 'center', color: 'white' }}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DynamicForm;
