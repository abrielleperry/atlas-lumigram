import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "./ui/IconSymbol.ios";

export function LogoutComponent() {
  const router = useRouter();

  function logout() {
    router.replace("/login");
  }

  return (
    <Pressable onPress={logout}>
      <IconSymbol
        name="iphone.and.arrow.right.outward"
        size={24}
        color="black"
        style={{ marginRight: 16 }}
      />
    </Pressable>
  );
}
