import { View, Text, Image, Dimensions } from "react-native";
import React from "react";
const { width } = Dimensions.get("window");

interface ItemProps {
  title: string;
  imageUrl: string;
}

const ImageGallery = ({ title, imageUrl }: ItemProps) => {
  return (
    <View className="m-1 rounded-md shadow-lg shadow-black">
      <Image
        source={{ uri: imageUrl }}
        style={{ width: width * 0.78, height: 160 }}
        className="rounded-lg"
        accessibilityLabel={title}
      />
    </View>
  );
};

export default ImageGallery;
