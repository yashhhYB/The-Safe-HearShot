import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import Section from "../components/Section";
import auth from "@react-native-firebase/auth";
import Breadcrumb from "../components/Breadcrumb";
import { SafeAreaView } from "react-native-safe-area-context";

const generalSections = [
  {
    title: "Past Notifications",
    subtitle: "See previous messages",
    iconName: "bell-badge-outline",
    link: "Notifications",
  },
  {
    title: "Filters",
    subtitle: "Get fewer notifications",
    iconName: "filter-outline",
    link: "Filters",
  },
];

const supportSections = [
  {
    title: "Github",
    subtitle: "View our code",
    iconName: "github",
    link: "https://github.com/MiniHacks/hearshot",
  },
  {
    title: "Devpost",
    subtitle: "Leave a like!",
    iconName: "routes",
    link: "https://devpost.com/software/hearshot",
  },
  {
    title: "Feedback",
    subtitle: "Drop us a line",
    iconName: "comment-quote-outline",
    link: "https://devpost.com/software/hearshot",
  },
];

export default function SettingsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Breadcrumb navigation={navigation} pageName={"Settings"} />

      <Text style={styles.heading}>General</Text>
      {generalSections.map((section, index) => (
        <View key={section.title}>
          <Section
            title={section.title}
            subtitle={section.subtitle}
            iconName={section.iconName}
            link={section.link}
            onPress={() => navigation.navigate(section.link)}
          />
          {index !== generalSections.length - 1 && (
            <View style={styles.hr}></View>
          )}
        </View>
      ))}

      <Text
        style={[
          styles.heading,
          {
            marginTop: 20,
          },
        ]}
      >
        Support us
      </Text>
      {supportSections.map((section, index) => (
        <View key={section.title}>
          <Section
            key={section.title}
            title={section.title}
            subtitle={section.subtitle}
            iconName={section.iconName}
            onPress={() => Linking.openURL(section.link)}
          />
          {index !== supportSections.length - 1 && (
            <View style={styles.hr}></View>
          )}
        </View>
      ))}
      <Pressable
        style={[
          styles.button,
          {
            marginTop: 40,
          },
        ]}
        title="Enter"
        accessibilityLabel="Enter a phone number"
        onPress={async () => {
          await auth().signOut();
          console.log("Logged out");

          navigation.navigate("Splash");
        }}
      >
        <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
          Logout
        </Text>
      </Pressable>
      <Text
        style={{ color: "#C7C7C7", alignSelf: "center", textAlign: "center" }}
      >
        Developed by Samyok, Sasha, Minnerva, and Ritik for LAHacks 2023
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 16,
    backgroundColor: "#1C1C1E",
  },

  heading: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 20,
  },

  title: {
    color: "#C7C7C7",
    fontSize: 24,
  },

  hr: {
    borderBottomColor: "#252525",
    borderBottomWidth: 1,
    marginVertical: 10,
  },

  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 16,
    width: 320,
    height: 48,

    backgroundColor: "#FF5F3E",
    borderRadius: 40,
  },
});
