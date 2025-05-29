import { Models } from "react-native-appwrite";

export interface Habit extends Models.Document {
  user_id: string;
  title: string;
  description: string;
  frequency: string;
  streakCount: number;
  createdAt: string;
  lastCompleted: string;
}
