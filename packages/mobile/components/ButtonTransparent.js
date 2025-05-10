import React from "react";
import { Pressable, Touchable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";

export default function ButtonTransparent({
  hexBorder,
  rgbFill,
  iconName,
  color,
  ...props
}) {
  return (
    <Pressable
      style={{
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: hexBorder,
        padding: 8,
        borderRadius: 6,
        backgroundColor: rgbFill,
      }}
      {...props}
    >
      <Octicons name={iconName} color={color || hexBorder} size={28} />
    </Pressable>
  );
}
