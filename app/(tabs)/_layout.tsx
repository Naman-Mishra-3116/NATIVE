import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
const TabsLayout = () => {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "green" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => {
            return focused ? (
              <FontAwesome size={20} color={color} name="home" />
            ) : (
              <Entypo size={20} color={color} name="home" />
            );
          },
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: "Login",
          tabBarIcon: ({ color, focused }) => {
            return focused ? (
              <MaterialCommunityIcons size={20} color={color} name="login" />
            ) : (
              <Entypo size={20} color={color} name="login" />
            );
          },
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
