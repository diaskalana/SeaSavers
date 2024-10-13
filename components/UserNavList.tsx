import { Text, View } from "react-native";
import React from "react";
import NavListItem from "./NavListItem";

const LinksList = [
  {
    title: "Profile",
    link: "/",
  },
  {
    title: "Competition",
    link: "/(tabs)/competitions",
  },
  {
    title:"Request Event",
    link:"/(request)/AddRequest"
  }
];

export default function UserNavList() {
  return (
    <View className="bg-white rounded-xl">
      {LinksList.map((item, index) => (
        <NavListItem key={index} text={item.title} link={item.link} />
      ))}
    </View>
  );
}
