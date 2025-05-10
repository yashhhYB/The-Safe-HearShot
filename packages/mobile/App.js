import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SettingsScreen from "./screens/SettingsScreen";
import HomeScreen from "./screens/HomeScreen";
import SplashScreen from "./screens/SplashScreen";
import NotificationScreen from "./screens/NotificationScreen";
import FilterScreen from "./screens/FilterScreen";
import messaging from "@react-native-firebase/messaging";
import firestore from "@react-native-firebase/firestore";

const Stack = createStackNavigator();

const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ cardStyleInterpolator: forFade, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ cardStyleInterpolator: forFade, gestureEnabled: false }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="Filters" component={FilterScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    async function requestTokens() {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log("Authorization status:", authStatus);
      } else {
        console.log("Authorization status:", authStatus);
        return;
      }
      // await messaging().registerDeviceForRemoteMessages();

      const token = await messaging().getAPNSToken();

      console.log("APNS Token:", token);

      const fcmToken = await messaging().getToken();

      console.log("FCM Token:", fcmToken);

      await messaging().subscribeToTopic("alerts");

      // updadte firestore with token
      await firestore()
        .collection("tokens")
        .doc("alerts")
        .set(
          {
            // array union
            tokens: firestore.FieldValue.arrayUnion(fcmToken),
          },
          { merge: true }
        );
    }
    requestTokens();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <MyStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
