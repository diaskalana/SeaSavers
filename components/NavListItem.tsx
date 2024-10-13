import * as React from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import { FontSize, FontFamily, Color } from "../GlobalStyles";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link } from "expo-router";

interface ListItemProps {
  text: string;
  link: string;
}

const ListItem: React.FC<ListItemProps> = ({ text, link }) => {
  return (
    <View>
      <View className="flex flex-row justify-between px-6 py-4 items-center">
        <View className="flex flex-row">
          <Link className="text-base" href={link as any}>
            {text}
          </Link>
        </View>
        <FontAwesome name="chevron-right" size={20} color={"#8F9098"} />
      </View>
      <View className="border-b border-gray-200"></View>
    </View>
  );
};

export default ListItem;
