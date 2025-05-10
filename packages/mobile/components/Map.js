import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import mapStyles from "../static/mapstyles.json";
import React from "react";
import { Dimensions, Image, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { distance } from "../lib/distance";

const images = {
  fire: require("../assets/fire.png"),
  high: require("../assets/high.png"),
  medium: require("../assets/medium.png"),
  low: require("../assets/low.png"),
};

const SAMPLE_ALERTS = {
  alerts: [
    {
      id: "1",
      severity: "medium",
      name: "Aggravated Assault at Pioneer Hall",
      coord: [44.9704, 93.229],
      address: "615 Fulton St SE, Minneapolis, MN 55455",
      date: Date.now() - 10000,
      summary:
        "Victim was outside, walking down FultonSt Se when a male suspect fired a BB gun from a 3rd story window at Pioneer Hall. Victim was struck face.",
    },
    {
      id: "2",
      severity: "fire",
      name: "Fire at Pauley Pavilion",
      coord: [34.070313, -118.446938],
      address: "301 Westwood Plaza, Los Angeles, CA 90095",
      date: Date.now() - 100,
      summary:
        "Random turkeys appeared on campus and started setting everything on fire.",
    },
    {
      id: "3",
      severity: "high",
      name: "Shooting at XYZ",
      coord: [21.312, 74.232],
      address: "Kenneth H. Keller Hall, 200 Union St SE,Minneapolis, MN 55455",
      date: Date.now() - 5000,
      summary:
        "Shooting reported at XYZ. 2 Injured, suspect wearing black vest.",
    },
  ],
};

const Map = React.forwardRef(
  (
    { snapTo, setActiveAlert, alerts = SAMPLE_ALERTS.alerts, ...props },
    ref
  ) => {
    const insets = useSafeAreaInsets();

    alerts = alerts.map((alert) => ({
      ...alert,
      distance: distance(alert.coord || [0, 0]),
    }));

    return (
      <MapView
        ref={ref}
        provider={PROVIDER_GOOGLE}
        style={{
          width: "100%",
          height: Dimensions.get("window").height + insets.bottom + 25,
          position: "absolute",
          zIndex: -1,
        }}
        customMapStyle={mapStyles}
        userInterfaceStyle={"dark"}
        initialRegion={{
          latitude: 34.070313,
          longitude: -118.446938,
          latitudeDelta: 1 / 60,
          longitudeDelta: 1 / 60,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        // followsUserLocation={true}
        showsCompass={false}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={false}
        rotateEnabled={true}
        {...props}
      >
        {alerts.map((alert) => (
          <Marker
            key={alert.id}
            coordinate={{
              latitude: alert?.coord?.[0],
              longitude: alert?.coord?.[1],
            }}
            title={alert.name}
            description={alert.summary}
            anchor={{ x: 0, y: 1 }}
            onPress={() => {
              setActiveAlert(alert);
              snapTo(0);
              ref.current.animateCamera(
                {
                  center: {
                    latitude: alert?.coord?.[0],
                    longitude: alert?.coord?.[1],
                  },
                  zoom: 16,
                },
                { duration: 350 }
              );
            }}
          >
            <Callout tooltip={true} />
            <View>
              <Image
                source={images[alert.severity]}
                style={{
                  width: 42,
                  height: 40,
                }}
              />
            </View>
          </Marker>
        ))}
      </MapView>
    );
  }
);

export default Map;
