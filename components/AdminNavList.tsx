import { StyleSheet, Text, View } from "react-native";
import React from "react";
import NavListItem from "./NavListItem";

const LinksList = [
    {
      title: "Profile",
      link: "/",
    },
    {
      title: "Events",
      link: "/(event)/AllEvents",
    },
    {
      title: "Event Request",
      link: "/(request)/AllRequest",
    },
    {
        title: "Blogs",
        link: "/(blog)/AllBlogs",
    },
    {
        title: "Competitions",
        link: "/(competition)/AllCompetitions",
    },
    {
        title: "Competition Entries",
        link: "/(compentry)/AllCompEntries",
    }
  ];

const AdminNavList = () => {
  return (
    <View className="bg-white rounded-xl">
      {LinksList.map((item, index) => (
        <NavListItem key={index} text={item.title} link={item.link} />
      ))}
    </View>
  );
};

export default AdminNavList;
