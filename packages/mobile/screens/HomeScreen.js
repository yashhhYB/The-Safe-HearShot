import React, { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, View } from "react-native";
import notifee from "@notifee/react-native";
import Map from "../components/Map";
import TopLinearGradient from "../components/TopLinearGradient";
import BottomDrawer from "../components/BottomDrawer";
import NumberOfAlerts from "../components/NumberOfAlerts";
import { NavBar } from "../components/NavBar";
import firestore from "@react-native-firebase/firestore";

export default function HomeScreen({ navigation }) {
  useEffect(() => {
    Keyboard.dismiss();
  }, [navigation]);

  const [liveStreamData, setLiveStreamData] = useState(null);
  const [liveStream, setLiveStream] = useState(false);

  // get alerts from database and then set them to state
  const [alerts, setAlerts] = useState([]);
  useEffect(() => {
    const subscriber = firestore()
      .collection("alerts")
      .onSnapshot((collectionSnapshot) => {
        const alerts = collectionSnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            key: doc.id,
          };
        });
        setAlerts(alerts);
      });

    const subscriber2 = firestore()
      .collection("transcriptions")
      .doc("lapd")
      .onSnapshot((doc) => {
        console.log(doc.data(), "doc.data()");
        setLiveStreamData(doc.data());
      });

    // Stop listening for updates when no longer required
    return () => {
      subscriber();
      subscriber2();
    };
  }, []);

  // ref
  const bottomSheetRef = useRef(null);

  const [activeAlert, setActiveAlert] = useState(null);

  const mapRef = useRef(null);

  function onLiveClick() {
    setLiveStream(true);
    snapTo(1);
  }

  async function onDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });

    // Display a notification
    await notifee.displayNotification({
      title: "Notification Title",
      body: "Main body content of the notification",
      android: {
        channelId,
        smallIcon: "name-of-a-small-icon", // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: "default",
        },
      },
    });
  }

  const snapTo = useCallback((index) => {
    bottomSheetRef.current.snapToIndex(index);
  }, []);

  return (
    <View
      style={{
        height: "100%",
      }}
    >
      <Map
        ref={mapRef}
        snapTo={snapTo}
        setActiveAlert={setActiveAlert}
        alerts={alerts}
      />
      <TopLinearGradient />
      <NavBar navigation={navigation} onLiveClick={onLiveClick} />
      <NumberOfAlerts />
      <BottomDrawer
        liveStream={liveStreamData}
        liveStreamOn={liveStream}
        ref={bottomSheetRef}
        alert={activeAlert}
        setAlert={setActiveAlert}
        onClose={() => {
          setLiveStream(false);
        }}
      ></BottomDrawer>
    </View>
  );
}
