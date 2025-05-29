import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
        headerStyle: {
          backgroundColor: "#f5f5f5",
        },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: "#f5f5f5",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today's Habits",
          tabBarIcon: ({ color }) => {
            return (
              <MaterialCommunityIcons size={18} color={color} name="calendar" />
            );
          },
        }}
      />
      <Tabs.Screen
        name="streaks"
        options={{
          title: "Streaks",
          tabBarIcon: ({ color }) => {
            return (
              <MaterialCommunityIcons
                size={18}
                color={color}
                name="chart-line"
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="add-habits"
        options={{
          title: "Add Habit",
          tabBarIcon: ({ color }) => {
            return (
              <MaterialCommunityIcons
                size={18}
                color={color}
                name="plus-circle"
              />
            );
          },
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
