import React from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardTypeOptions,
} from "react-native";

interface TextFieldProps {
  title: string;
  value: string;
  placeholder: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType,
  secureTextEntry,
  multiline,
  numberOfLines,
  editable,
}) => {
  return (
    <View className={`space-y-1 ${otherStyles}`}>
      <Text className="text-base text-gray-900">{title}</Text>
      <View className="w-full px-4 rounded-md border-2 border-[#c5c6cc] focus:border-blue-300 flex flex-row items-center">
        <TextInput
          value={value}
          placeholder={placeholder}
          onChangeText={handleChangeText}
          keyboardType={keyboardType}
          style={{ flex: 1 }}
          multiline={multiline}
          numberOfLines={numberOfLines}
          className="w-full py-2 text-base text-gray-900"
          editable={editable}
        />
      </View>
    </View>
  );
};

export default TextField;
