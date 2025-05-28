import { IMAGES } from "@/assets/images";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

const AuthScreen = () => {
  const [isSignUp, setIsSignup] = useState<boolean>(true);
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const { signin, signup } = useAuth();
  const router = useRouter();

  const handleSwitchMode = () => {
    setIsSignup((prev) => !prev);
  };

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Please enter both the fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 character");
      return;
    }

    setError(null);
    if (isSignUp) {
      const error = await signup(email, password);
      if (error) {
        setError(error);
        return;
      }
    } else {
      const error = await signin(email, password);
      if (error) {
        setError(error);
      }

      router.replace("/");
    }
  };
  return (
    <KeyboardAvoidingView
      style={classes.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={classes.content}>
        <Text style={classes.heading} variant="headlineMedium">
          {isSignUp ? "Create Account" : "Welcome Back!"}
        </Text>
        <TextInput
          label={"Email"}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="example@gmail.com"
          mode="outlined"
          onChangeText={setEmail}
        />

        <TextInput
          onChangeText={setPassword}
          label={"Password"}
          autoCapitalize="none"
          secureTextEntry
          mode="outlined"
        />

        {error && (
          <Text style={{ color: theme.colors.error ?? "red" }}>{error}</Text>
        )}

        <Button mode="contained" onPress={handleAuth}>
          {isSignUp ? "Sign up" : "Sign in"}
        </Button>
        <Button mode="text" onPress={handleSwitchMode}>
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </Button>
        <View style={classes.imgView}>
          <Image source={IMAGES.illustrator} style={classes.image} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;

const classes = StyleSheet.create({
  imgView: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    mixBlendMode: "multiply",
    width: 300,
    height: 300,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  content: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },

  heading: {
    textAlign: "center",
    marginBottom: 10,
    fontWeight: 900,
  },
});
