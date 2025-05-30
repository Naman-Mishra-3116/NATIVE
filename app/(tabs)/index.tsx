import { useAuth } from "@/context/AuthContext";
import {
  client,
  DATABASE_ID,
  databases,
  HABIT_COLLECTION_ID,
  HABIT_COMPLETION_ID,
} from "@/lib/appwrite";
import { Habit } from "@/types/database.type";

import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ID, Query } from "react-native-appwrite";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Surface, Text } from "react-native-paper";

export default function Index() {
  const swipableRef = useRef<{ [key: string]: Swipeable | null }>({});
  const { user, signout } = useAuth();
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
      const channel = `databases.${DATABASE_ID}.collections.${HABIT_COLLECTION_ID}.documents`;
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

  const handleDeleteHabit = async (id: string) => {
    try {
      await databases.deleteDocument(DATABASE_ID, HABIT_COLLECTION_ID, id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCompleteHabit = async (id: string) => {
    if (!user) return;
    try {
      await databases.createDocument(
        DATABASE_ID,
        HABIT_COMPLETION_ID,
        ID.unique(),
        {
          habitId: id,
          userId: user.$id,
          completedAt: new Date().toISOString(),
        }
      );
      const habit = resp?.find((h) => h.$id === id);
      if (!habit) return;

      await databases.updateDocument(DATABASE_ID, HABIT_COLLECTION_ID, id, {
        streakCount: habit.streakCount + 1,
        lastCompleted: new Date().toISOString(),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const renderRightAction = () => (
    <View style={classes.right}>
      <MaterialCommunityIcons
        name="check-circle-outline"
        size={32}
        color={"#fff"}
      />
    </View>
  );

  const renderLeftAction = () => (
    <View style={classes.left}>
      <MaterialCommunityIcons
        name="trash-can-outline"
        size={32}
        color={"#fff"}
      />
    </View>
  );

  return (
    <View style={classes.container}>
      <View style={classes.header}>
        <Text
          variant="headlineSmall"
          style={{ color: "black", fontWeight: "bold" }}
        >
          Today&apos;s Habits
        </Text>
        <Button onPress={signout}>
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
              <Swipeable
                onSwipeableOpen={(direction) => {
                  if (direction === "right") {
                    handleDeleteHabit(item.$id);
                  } else if (direction === "left") {
                    handleCompleteHabit(item.$id);
                  }

                  swipableRef.current[item.$id]?.close();
                }}
                key={index}
                overshootLeft={false}
                overshootRight={false}
                renderRightActions={renderLeftAction}
                renderLeftActions={renderRightAction}
                ref={(ref) => {
                  swipableRef.current[item.$id] = ref;
                }}
              >
                <Surface style={classes.card} elevation={1}>
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
              </Swipeable>
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

  left: {
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    backgroundColor: "#e53935",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingRight: 16,
  },

  right: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    backgroundColor: "#4caf50",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingLeft: 16,
  },
});
