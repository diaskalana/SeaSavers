import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface DateFieldProps {
  title: string;
  date: Date;
  handleDateChange: (date: Date) => void;
  otherStyles?: string;
}

const DateField: React.FC<DateFieldProps> = ({
  title,
  date,
  handleDateChange,
  otherStyles,
}) => {
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate: Date | undefined) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) {
      handleDateChange(selectedDate);
    }
  };

  const formattedDate = date.toLocaleDateString();

  return (
    <View className={`space-y-1 ${otherStyles}`}>
      <Text className="text-base text-gray-900">{title}</Text>
      <View className="w-full h-12 px-4 rounded-md border-2 border-[#c5c6cc] focus:border-blue-300 flex flex-row items-center">
        <TouchableOpacity onPress={() => setShow(true)}>
          <FontAwesome name="calendar" size={20} color="#c5c6cc" />
        </TouchableOpacity>
        <Text className="ml-4 text-base text-gray-900">{formattedDate}</Text>
        {show && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}
      </View>
    </View>
  );
};

export default DateField;