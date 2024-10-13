import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardTypeOptions,
  TouchableOpacity,
} from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface FormFieldProps {
  title: string;
  value: string;
  placeholder: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType,
  secureTextEntry,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`space-y-1 ${otherStyles}`}>
      {/* <Text className="text-base">{title}</Text> */}
      <View className="w-full h-12 px-4 rounded-2xl border-2 border-[#c5c6cc] focus:border-blue-300 flex flex-row items-center">
        <TextInput
          value={value}
          placeholder={placeholder}
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          keyboardType={keyboardType}
          style={{ flex: 1 }}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text className="w-6 h-6">
              <FontAwesome
                name={!showPassword ? "eye" : "eye-slash"}
                size={22}
                color="#c5c6cc"
              />
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
