import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { formatDistanceToNow, formatRelative } from "date-fns";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const TranscriptionItem = ({ item }) => {
  return (
    <View
      style={{
        marginVertical: 10,
      }}
    >
      <Text style={styles.text}>{item.content}</Text>
      <Text style={styles.detail}>
        {new Date(item.start).toLocaleTimeString()}
      </Text>
    </View>
  );
};

const Transcription = ({ transcript }) => {
  const { name, sections, done } = transcript;

  console.log("transcript", transcript);
  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: 16,
        },
      ]}
    >
      <View
        style={{
          marginBottom: 25,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={[
            styles.button,
            {
              width: 70,
            },
          ]}
          accessibilityLabel="Distance from event"
        >
          <Text
            style={{
              fontSize: 13,
              color: "#1C1C1E",
              fontWeight: "bold",
              height: "100%",
            }}
          >
            LIVE
          </Text>
        </View>
        <Image
          source={require("../assets/waveform.png")}
          style={{
            width: Dimensions.get("window").width - 40 - 85,
            height: 15,
          }}
        />
      </View>
      <Text style={styles.title}>{name}</Text>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 16,
          flexGrow: 1,
          height: "100%",
        }}
      >
        {sections
          .sort((a, b) => new Date(b.start) - new Date(a.start))
          .map((section) => (
            <TranscriptionItem
              item={section}
              key={section.id + section.content}
            />
          ))}
      </ScrollView>
    </View>
  );

  // return (
  //     {/*<Text style={styles.detail}>idk subtitles</Text>*/}
  //     {/*<Text>{done}</Text>*/}
  // );
};

export default Transcription;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  detail: {
    flexDirection: "row",
    color: "#C7C7C7",
    fontSize: 12,
  },
  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
  },
  text: {
    color: "#C7C7C7",
    fontSize: 20,
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,

    backgroundColor: "#FF5F3E",
    borderRadius: 40,
  },
});
