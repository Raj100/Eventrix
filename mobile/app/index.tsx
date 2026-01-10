import { Redirect } from "expo-router";
import { useUserStore } from "../src/store";

export default function Index() {
  const { user } = useUserStore();

  // If logged in, go to tabs. If not, go to login.
  if (!user) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/home" />;
}