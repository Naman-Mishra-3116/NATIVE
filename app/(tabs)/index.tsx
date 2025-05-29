import { useAuth } from "@/context/AuthContext";
import {
  client,
  DATABASE_ID,
  databases,
  HABIT_COLLECTION_ID,
} from "@/lib/appwrite";
import { Habit } from "@/types/database.type";

import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Button, Surface, Text } from "react-native-paper";

export default function Index() {
  const { user } = useAuth();
  const [resp, setResp] = useState<Habit[]>();
  const fetchAllHabits = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        HABIT_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      );
      setResp(response.documents as Habit[]);
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  useEffect(() => {
    if (user) {
      const channel = `databases.${DATABASE_ID}.collections.${HABIT_COLLECTION_ID}`;
      const habitSubscription = client.subscribe(
        channel,
        (response: { events: string[]; payload: any }) => {
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            fetchAllHabits();
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.update"
            )
          ) {
            fetchAllHabits();
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.delete"
            )
          ) {
            fetchAllHabits();
          }
        }
      );
      fetchAllHabits();
      return () => {
        habitSubscription();
      };
    }
  }, [user]);
  return (
    <View style={classes.container}>
      <View style={classes.header}>
        <Text
          variant="headlineSmall"
          style={{ color: "black", fontWeight: "bold" }}
        >
          Today&apos;s Habits
        </Text>
        <Button>
          <View style={{ display: "flex", flexDirection: "row", gap: "10" }}>
            <AntDesign name="logout" size={20} color="black" />
            <Text style={{ color: "black" }}>Sign out</Text>
          </View>
        </Button>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {resp?.length === 0 ? (
          <View style={classes.emptyState}>
            <Text style={classes.emptyText}>No Habits Today</Text>
          </View>
        ) : (
          resp?.map((item, index) => {
            return (
              <Surface key={index} style={classes.card} elevation={1}>
                <View style={classes.cardContent}>
                  <Text style={classes.cardTitle}>{item.title}</Text>
                  <Text style={classes.cardDesc}>{item.description}</Text>
                  <View style={classes.cardFooter}>
                    <View style={classes.streakBadge}>
                      <MaterialCommunityIcons
                        name="fire"
                        size={18}
                        color={"#ff9800"}
                      />
                      <Text style={classes.streakText}>
                        {item.streakCount} Day streak
                      </Text>
                    </View>
                    <View style={classes.freqBadge}>
                      <Text style={classes.freqText}>
                        {item.frequency.charAt(0).toUpperCase() +
                          item.frequency.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
              </Surface>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const classes = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: "#f5f5f5",
  },

  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#666666",
  },

  card: {
    marginBottom: 12,
    borderRadius: 18,
    backgroundColor: "#f7f2fa",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  cardContent: {
    padding: 16,
  },
  cardTitle: {
    color: "#22223b",
    marginBottom: 4,
    fontSize: 18,
    fontWeight: "bold",
  },
  cardDesc: {
    color: "#22223b",
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff7e0",
    borderRadius: "12px",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  streakText: {
    marginLeft: 6,
    color: "#ff9800",
    fontWeight: "bold",
    fontSize: 14,
  },
  freqBadge: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ede7f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    width: 90,
  },
  freqText: {
    marginLeft: 6,
    color: "#7c4dff",
    textTransform: "capitalize",
    fontWeight: "bold",
    fontSize: 14,
  },
});
