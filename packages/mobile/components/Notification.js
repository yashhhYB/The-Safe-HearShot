import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatDistanceToNow, formatRelative } from "date-fns";

export default function Notification({
  tagline,
  location,
  distance,
  notifTime,
  onPress,
}) {
  // FIXME: should probably just do calculation in screen instead?
  const currentTime = new Date();
  const MAX_RECENCY = 15;
  const minDiff = () => {
    const diff = Math.abs(currentTime.getTime() - notifTime.getTime());
    return Math.floor(diff / (1000 * 60));
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container style={styles.container} onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          textAlignVertical: "center",
        }}
      >
        <Text style={styles.detail}>
          {formatDistanceToNow(notifTime)} ago ·{" "}
          {formatRelative(notifTime, currentTime)}{" "}
        </Text>
        {minDiff() < MAX_RECENCY && (
          <MaterialCommunityIcons
            name="cast-audio-variant"
            color="#FF5F3E"
            size={18}
          />
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 8,
        }}
      >
        <Text style={styles.title}>{tagline}</Text>
        <Pressable
          style={styles.button}
          accessibilityLabel="Distance from event"
        >
          <Text style={{ fontSize: 14, color: "#1C1C1E", fontWeight: "bold" }}>
            {distance?.toFixed(1)} mi
          </Text>
        </Pressable>
      </View>
      <Text style={styles.subtitle}>{location}</Text>
    </Container>
  );
}

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
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    flexWrap: "wrap",
  },
  subtitle: {
    color: "#C7C7C7",
    fontSize: 16,
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
