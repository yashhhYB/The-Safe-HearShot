import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Notification from "../components/Notification";
import Breadcrumb from "../components/Breadcrumb";
import { distance } from "../lib/distance";
import { SafeAreaView } from "react-native-safe-area-context";

// TODO: dummy data stuff; replace when we actually get data.
function generateRandomDate() {
  const now = new Date();
  const randomOffset = Math.floor(Math.random() * 61) - 30;
  return new Date(now.getTime() + randomOffset * 60 * 1000);
}

const notifications = [
  {
    tagline: "Reported Gunshots",
    location: "Middlebrook Hall",
    notifLocation: [50.5123, 30.22],
    notifTime: generateRandomDate(),
  },
  {
    tagline: "Fire on 2nd Floor",
    location: "Keller Hall",
    notifLocation: [38.5123, 3.22],
    notifTime: generateRandomDate(),
  },
  {
    tagline: "Indecent Conduct",
    location: "Pioneer Hall",
    notifLocation: [20.5123, 23.22],
    notifTime: generateRandomDate(),
  },
  {
    tagline: "Attempted Carjacking",
    location: "600 11th Ave SE",
    notifLocation: [10.23, 16.22],
    notifTime: generateRandomDate(),
  },
];

// TODO: im assuming we're converting lat/long to distance here
//       and get the location string (ex: "keller hall") from it here too???

export default function NotificationScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Breadcrumb navigation={navigation} pageName={"Notifications"} />
      <Text
        style={{
          color: "white",
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 12,
          marginTop: 20,
        }}
      >
        Today
      </Text>
      {notifications
        .slice()
        .map((notif) => ({
          ...notif,
          distance: distance(notif.notifLocation),
        }))
        .sort((a, b) => a.distance - b.distance)
        .map((notif, index) => (
          <View key={notif.tagline}>
            <Notification
              tagline={notif.tagline}
              location={notif.location}
              notifLocation={notif.notifLocation}
              curLocation={[34.070313, -118.446938]}
              notifTime={notif.notifTime}
              distance={notif.distance}
            />
            {index !== notifications.length - 1 && (
              <View style={styles.hr}></View>
            )}
          </View>
        ))}
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

  title: {
    color: "#C7C7C7",
    fontSize: 24,
  },

  hr: {
    borderBottomColor: "#252525",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});
