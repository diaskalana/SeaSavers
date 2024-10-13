import React from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

type SelectFieldProps = {
  title: string;
  value: string;
  placeholder: string;
  options: { label: string; value: string }[];
  handleChange: (value: string) => void;
  otherStyles?: string;
  enabled?: boolean;
};

const SelectField: React.FC<SelectFieldProps> = ({
  title,
  value,
  placeholder,
  options,
  handleChange,
  otherStyles,
  enabled,
}) => {
  return (
    <View className={`space-y-1 ${otherStyles}`}>
      <Text className="text-base text-gray-900">{title}</Text>
      <View className="w-full px-4 rounded-md border-2 border-[#c5c6cc] focus:border-blue-300">
        <Picker
          selectedValue={value}
          onValueChange={handleChange}
          enabled={enabled}
          style={{ flex: 1 }}
        >
          {options.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default SelectField;
