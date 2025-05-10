import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Breadcrumb({ navigation, pageName }) {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
      }}
      onPress={() => navigation.pop()}
    >
      <MaterialCommunityIcons name="chevron-left" color="#C7C7C7" size={28} />
      <Text style={styles.title}>{pageName}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#C7C7C7",
    fontSize: 20,
    letterSpacing: 2,
    fontWeight: "300",
    marginLeft: 8,
  },
});
