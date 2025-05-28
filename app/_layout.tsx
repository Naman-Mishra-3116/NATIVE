import AuthContext, { useAuth } from "@/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

interface GuardType {
  children: React.ReactNode;
}

const RouteGuard: React.FC<GuardType> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segment = useSegments();

  useEffect(() => {
    const curr = segment[0] === "auth";
    const timeout = setTimeout(() => {
      if (!user && !curr && !isLoading) {
        router.replace("/auth");
      } else if (user && curr && !isLoading) {
        router.replace("/");
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [user, segment]);

  return <>{children}</>;
};

export default function RootLayout() {
  return (
    <AuthContext>
      <RouteGuard>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </RouteGuard>
    </AuthContext>
  );
}
