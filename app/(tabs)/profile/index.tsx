import React, { useState, useEffect } from "react";
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
import { useRouter, useGlobalSearchParams } from "expo-router";

const numColumns = 3;
const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth / numColumns;

export default function Page() {
  const router = useRouter();
  const params = useGlobalSearchParams();

  const [profile, setProfile] = useState({
    username: profileFeed[0].createdBy,
    profileImage: profileFeed[0].image,
  });

  useEffect(() => {
    if (params.username && params.profileImage) {
      setProfile({
        username: params.username as string,
        profileImage: params.profileImage as string,
      });
    }
  }, [params]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/profile/edit",
            params: {
              username: profile.username,
              profileImage: profile.profileImage,
            },
          })
        }
      >
        <Image
          source={{ uri: profile.profileImage }}
          style={styles.profileImage}
        />
      </TouchableOpacity>

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
