import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { profileFeed } from "../../../placeholder";

const numColumns = 3;
const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth / numColumns;

export default function ProfileScreen() {
  const [profile, setProfile] = useState({
    username: profileFeed[0].createdBy,
    profileImage: profileFeed[0].image,
  });

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: profile.profileImage }}
        style={styles.profileImage}
      />

      <Text style={styles.username}>{profile.username}</Text>

      <FlatList
        data={profileFeed}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Image source={{ uri: item.image }} style={styles.postImage} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    marginBottom: 90,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,

    marginVertical: 30,
  },
  username: {
    fontSize: 20,

    marginBottom: 30,
  },
  postImage: {
    width: imageSize,
    height: imageSize,
  },
});
