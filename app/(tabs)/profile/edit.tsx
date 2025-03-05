import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { auth, db, storage } from "@/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function Page() {
  const router = useRouter();
  const userId = auth.currentUser?.uid;

  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUsername(userSnap.data().username || "");
          setProfileImage(userSnap.data().profilePicture || "");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, [userId]);

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

  const uploadImage = async (uri: string) => {
    if (!userId) return;
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `profilePictures/${userId}`);
    await uploadBytes(storageRef, blob);
    return getDownloadURL(storageRef);
  };

  const saveProfile = async () => {
    if (!userId) return;

    let finalUsername =
      username.trim() !== ""
        ? username
        : auth.currentUser?.email?.split("@")[0] || "User";

    let imageUrl = profileImage;
    if (profileImage.startsWith("file://")) {
      console.log("Uploading new profile image...");
      imageUrl = await uploadImage(profileImage);
    }

    console.log("Saving user data to Firestore:", { finalUsername, imageUrl });

    await setDoc(
      doc(db, "users", userId),
      {
        username: finalUsername,
        profilePicture: imageUrl,
      },
      { merge: true }
    );

    console.log("Profile saved successfully!");

    router.replace({
      pathname: "/profile",
      params: { refresh: new Date().getTime() },
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImagePlaceholder} />
        )}
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
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});
