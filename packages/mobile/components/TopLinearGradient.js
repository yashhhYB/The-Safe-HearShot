import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TopLinearGradient = () => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <LinearGradient
        // Top Linear Gradient
        colors={[
          "rgba(0,0,0,1)",
          "rgba(0,0,0,.8438)",
          "rgba(0,0,0,.3438)",
          "rgba(0,0,0,.17)",
          "rgba(0,0,0,0)",
        ]}
        locations={[0, 0.3, 0.7, 0.8, 1]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: insets.top + 100,
        }}
        pointerEvents={"none"}
      />
      <LinearGradient
        // Top Linear Gradient
        colors={["rgba(0,0,0,.95)", "rgba(0,0,0,.7438)", "rgba(0,0,0,0)"]}
        locations={[1, 0.5, 0]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: insets.bottom + 70,
        }}
        pointerEvents={"none"}
      />
    </>
  );
};

export default TopLinearGradient;
