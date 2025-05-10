import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Tag({ filter, onDelete }) {
  const handleDelete = () => {
    onDelete(filter);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#8269E3",
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        margin: 6,
      }}
    >
      <TouchableOpacity onPress={handleDelete}>
        <MaterialCommunityIcons
          name={"window-close"}
          color={"#BDB5E5"}
          size={16}
        />
      </TouchableOpacity>
      <Text style={{ color: "#BDB5E5", marginHorizontal: 4 }}>{filter}</Text>
    </View>
  );
}
