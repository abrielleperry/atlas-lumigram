import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function Page() {
  const router = useRouter();
  const { username: initialUsername, profileImage: initialProfileImage } =
    useLocalSearchParams();

  const [username, setUsername] = useState(initialUsername as string);
  const [profileImage, setProfileImage] = useState(
    initialProfileImage as string
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const saveProfile = () => {
    router.replace({
      pathname: "/profile",
      params: {
        username,
        profileImage,
      },
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Enter new username"
      />
      <Pressable style={styles.saveButton} onPress={saveProfile}>
        <Text style={styles.saveText}>Save profile</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 55,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderColor: "#3FBFA8",
    borderWidth: 1,
    color: "#333",
    fontSize: 16,
  },
  saveButton: {
    width: "90%",
    height: 60,
    backgroundColor: "#3FBFA8",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 5,
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
