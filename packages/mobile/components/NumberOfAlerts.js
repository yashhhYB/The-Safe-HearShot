import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import React from "react";

const NumberOfAlerts = ({ num }) => {
  return (
    <SafeAreaView
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        alignItems: "center",
      }}
      pointerEvents={"none"}
    >
      <Text
        style={{
          color: "#C7C7C7",
          marginVertical: 8,
          fontSize: 16,
        }}
      >
        5 recent alerts in this area
      </Text>
    </SafeAreaView>
  );
};

export default NumberOfAlerts;
