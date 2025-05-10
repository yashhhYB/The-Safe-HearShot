import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as PNF from "google-libphonenumber";
import Logo from "../assets/logo-full.png";
import SplashBackground from "../assets/splash-bkg.png";
import Collapsible from "react-native-collapsible";
import DismissKeyboardView from "../components/DismissKeyboardView";
import auth from "@react-native-firebase/auth";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import messaging from "@react-native-firebase/messaging";
import Input from "../components/Input";

const phoneUtil = PNF.PhoneNumberUtil.getInstance();

const logoHeight = 150;
const logoWidth = (1580 / 802) * logoHeight;
export default function SplashScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  useEffect(() => {
    // TODO: this is just a delay to show the splash screen loading, lol
    //       replace with actual check to see if things are loaded
    setTimeout(() => {
      setIsTransitioning(false);
    }, 2000);
    // TODO: probably add a transition here
  }, []);

  const [phoneNumber, setPhoneNumber] = useState("");
  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);

  // Handle login
  async function onAuthStateChanged(user) {
    if (user) {
      // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
      // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
      // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
      // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
      console.log("user logged in");
    } else {
      console.log("user logged out");
      setConfirm(null);
      setPhoneNumber("");
    }
  }

  useEffect(() => {
    return auth().onAuthStateChanged(onAuthStateChanged); // unsubscribe on unmount
  }, []);

  // Handle the button press
  async function signInWithPhoneNumber(phoneNumber) {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirm(confirmation);
  }

  async function confirmCode(code) {
    try {
      console.log("confirming code: " + code);
      await confirm.confirm(code);
      await navigation.navigate("Home");
    } catch (error) {
      console.log("Invalid code.");
    }
  }

  return (
    <ImageBackground
      source={SplashBackground}
      resizeMode="cover"
      style={styles.center}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <DismissKeyboardView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            style={{
              marginTop: 30,
              marginBottom: 40,
              height: logoHeight,
              width: logoWidth,
            }}
            source={Logo}
          ></Image>

          <Collapsible collapsed={isTransitioning || confirm} duration={750}>
            <Input
              caption={"Enter phone number"}
              onChange={(text) => setPhoneNumber(text)}
              contentType={"telephoneNumber"}
              keyboardType={"numeric"}
              placeholder={"(763) 333 5096"}
              state={phoneNumber}
            />
            <Pressable
              style={styles.button}
              title="Enter"
              accessibilityLabel="Enter a phone number"
              onPress={async () => {
                setIsLoading(true);
                let formattedNumber = "";

                try {
                  // validate phone number

                  const pn = phoneUtil.parse(phoneNumber, "US");

                  formattedNumber = phoneUtil.format(
                    pn,
                    PNF.PhoneNumberFormat.E164
                  );

                  if (!phoneUtil.isValidNumber(pn)) {
                    console.log("invalid number");
                    throw new Error("invalid number");
                  }

                  setPhoneNumber(formattedNumber);

                  console.log("formattedNumber: " + formattedNumber);
                } catch (error) {
                  console.log("error: " + error);
                  alert("Please enter a valid phone number");
                  setIsLoading(false);
                  return;
                }
                if (
                  !phoneUtil.isValidNumber(phoneUtil.parse(phoneNumber, "US"))
                ) {
                  alert("Please enter a valid phone number");
                  setIsLoading(false);
                  return;
                }
                console.log(
                  phoneUtil.isValidNumber(phoneUtil.parse(phoneNumber, "US"))
                );
                setIsLoading(false);

                await signInWithPhoneNumber(formattedNumber);
                setIsLoading(false);
                setPhoneNumber("");
              }}
            >
              <Text
                style={{ fontSize: 20, color: "white", fontWeight: "bold" }}
              >
                {isLoading ? "Loading..." : "Enter"}
              </Text>
            </Pressable>
          </Collapsible>

          {/* CONFIRMATION CODE */}
          <Collapsible
            collapsed={isTransitioning || isLoading || !confirm}
            duration={750}
          >
            <View style={{ display: "flex", justifyContent: "flex-start" }}>
              <Text style={styles.text}>Enter confirmation code</Text>
              <OTPInputView
                style={{ width: "80%", height: 50, alignSelf: "center" }}
                pinCount={6}
                // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                // onCodeChanged = {code => { this.setState({code})}}
                autoFocusOnLoad={false}
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                onCodeFilled={confirmCode}
              />
            </View>
          </Collapsible>
        </DismissKeyboardView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#C7C7C7",
    marginVertical: 8,
    fontSize: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  input: {
    width: 320,
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

  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 24,
    width: 320,
    height: 48,

    backgroundColor: "#FF5F3E",
    borderRadius: 40,
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
  },

  underlineStyleHighLighted: {
    borderColor: "#03DAC6",
  },
});
