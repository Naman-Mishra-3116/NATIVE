import { useAuth } from "@/context/AuthContext";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";

const Login: React.FC = () => {
  const { signout } = useAuth();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Logout Page</Text>
      <Button onPress={signout} mode="contained">
        Logout
      </Button>
    </View>
  );
};

export default Login;
