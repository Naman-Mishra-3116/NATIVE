import { useAuth } from "@/context/AuthContext";
import { DATABASE_ID, databases, HABIT_COLLECTION_ID } from "@/lib/appwrite";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ID } from "react-native-appwrite";
import {
  Button,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

const FREQENCIES = ["daily", "weekly", "monthly"];
type Frequency = (typeof FREQENCIES)[number];

const AddHabitScreen = () => {
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [freq, setFreq] = useState<Frequency>("daily");
  const [error, setError] = useState<string>("");
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const handleSubmit = async () => {
    try {
      if (!user) return;
      await databases.createDocument(
        DATABASE_ID,
        HABIT_COLLECTION_ID,
        ID.unique(),
        {
          user_id: user.$id,
          title,
          description: desc,
          frequency: freq,
          streakCount: 0,
          lastCompleted: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        }
      );

      router.back();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        return;
      }

      setError("There was an error creating the habit");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label={"Title"}
        mode="outlined"
        underlineColor="gray"
        activeUnderlineColor="blue"
        textColor="black"
        style={styles.input}
        onChangeText={setTitle}
      />
      <TextInput
        label={"Description"}
        mode="outlined"
        underlineColor="gray"
        activeUnderlineColor="red"
        textColor="black"
        style={styles.input}
        onChangeText={setDesc}
      />

      <View style={styles.btnGroup}>
        <SegmentedButtons
          value={freq}
          onValueChange={(value) => {
            setFreq(value);
          }}
          buttons={FREQENCIES.map((item) => {
            return {
              value: item,
              label: item.charAt(0).toUpperCase() + item.slice(1),
            };
          })}
        />
      </View>
      <Button
        mode="contained"
        disabled={!title || !desc}
        onPress={handleSubmit}
      >
        Add Habit
      </Button>
      {error && (
        <Text style={{ color: theme.colors.error ?? "red", marginTop: 4 }}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default AddHabitScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  input: { backgroundColor: "#f5f5f5", marginBottom: 16 },

  btnGroup: { marginBottom: 24 },
});
