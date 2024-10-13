import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface TimeFieldProps {
  title: string;
  time: Date;
  handleTimeChange: (time: Date) => void;
  otherStyles?: string;
}

const TimeField: React.FC<TimeFieldProps> = ({
  title,
  time,
  handleTimeChange,
  otherStyles,
}) => {
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedTime: Date | undefined) => {
    setShow(Platform.OS === "ios");
    if (selectedTime) {
      handleTimeChange(selectedTime);
    }
  };

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View className={`space-y-1 ${otherStyles}`}>
      <Text className="text-base text-gray-900">{title}</Text>
      <View className="w-full h-12 px-4 rounded-md border-2 border-[#c5c6cc] focus:border-blue-300 flex flex-row items-center">
        <TouchableOpacity onPress={() => setShow(true)}>
          <FontAwesome name="clock-o" size={24} color="#006FFD" />
        </TouchableOpacity>
        <Text className="ml-4 text-base text-gray-900">{formattedTime}</Text>
        {show && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={onChange}
          />
        )}
      </View>
    </View>
  );
};

export default TimeField;