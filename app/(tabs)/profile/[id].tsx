import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Page() {
  const { username, avatar } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {typeof avatar === "string" && (
        <Image source={{ uri: avatar }} style={styles.profileImage} />
      )}
      <Text style={styles.username}>{username}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  username: {
    fontSize: 20,
  },
});
