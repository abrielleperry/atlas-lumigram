import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { userSearch } from "../../placeholder";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredUsers = userSearch.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search users"
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() =>
              router.push({
                pathname: `/profile/[id]`,
                params: {
                  id: item.id,
                  username: item.username,
                  avatar: item.avatar,
                },
              })
            }
          >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={styles.username}>{item.username}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    width: "100%",
    height: 55,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderColor: "#3FBFA8",
    borderWidth: 1,
    fontSize: 16,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
  },
});
