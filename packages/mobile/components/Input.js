import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function Input({
  caption,
  onChange,
  contentType,
  keyboardType,
  placeholder = "",
  state,
  ...props
}) {
  return (
    <View style={{ display: "flex", justifyContent: "flex-start" }}>
      <Text style={styles.text}>{caption}</Text>
      <TextInput
        style={styles.input}
        textContentType={contentType}
        placeholder={placeholder}
        placeholderTextColor={"#909090"}
        onChangeText={onChange}
        value={state}
        keyboardType={keyboardType}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#C7C7C7",
    marginVertical: 8,
    fontSize: 16,
  },

  input: {
    width: "100%",
    height: 48,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderStyle: "solid",
    borderColor: "#909090",
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: "#2C2C2E",
    color: "#C7C7C7",
    fontSize: 24,
  },
});
